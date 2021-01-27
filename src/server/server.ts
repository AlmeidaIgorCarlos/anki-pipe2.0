import http2, { Http2SecureServer, ServerHttp2Stream } from 'http2';
import url from 'url';
import assert from 'assert';
import { HttpResponse } from './contracts/http-response';
import { Route } from './route';
import { NotFoundError } from './errors/not-found-error';
import { ServerOptions } from './contracts/server-options';
import { ServerError } from './contracts/server-error';
import { TemplateEngine } from './contracts/template-engine';
import { BaseController } from './controllers/base-controller';
import { ServerPush } from './contracts/server-push';

export class Server {
	private readonly http2: Http2SecureServer;
	private readonly routes: Route[];
	private readonly genericServerError: ServerError;
	private readonly notFoundServerError: ServerError;
	public readonly templateEngine: TemplateEngine | undefined;
	private readonly serverPushers: ServerPush[] | undefined;

	constructor(
		options: ServerOptions,
		routes?: Route[]
	) {
		this.http2 = http2.createSecureServer(options);
		this.routes = routes ? routes : [];
		this.genericServerError = options.genericServerError;
		this.notFoundServerError = options.notFoundServerError;
		this.templateEngine = options.templateEngine;
		this.serverPushers = options.serverPushers;
	}

	public listen (port: number): Http2SecureServer {
		this.http2.on('stream', this._main);
		this.http2.listen(port);
		return this.http2;
	}

	public findRoute(route: Route) : Route {
		const foundRoute: Route = this.routes.find((fRoute: Route) => {
			if (fRoute.equals(route))
				return true;
			else return false;
		}) as Route;

		if (foundRoute)
			return foundRoute;
		else throw new NotFoundError();
	}

	public async onConnect(stream: ServerHttp2Stream, headers: any): Promise<void> {
		const method = headers[':method'];
		const { query, pathname } = url.parse(headers[':path'], true);
	
		assert(pathname);

		const body = await new Promise((resolve) => {
			let result = '';

			stream.on('data', chunk=>{
				result+=chunk;
			});

			stream.on('end', ()=>{
				const data = result ? JSON.parse(result) : null;
				resolve(data);
			});

		});
	
		const route: Route = this.findRoute(new Route(method, pathname, new BaseController()));

		const httpRequest = {
			headers: headers,
			body,
			params: route.params(pathname),
			query: query
		};
	
		const httpResponse: HttpResponse = await route.controller.handle(httpRequest);

		if (this.templateEngine) {
			httpResponse.body = await this.templateEngine.render(httpResponse.body, httpResponse.data);
			if(this.serverPushers){
				// this.serverPushers.forEach(pusher => pusher.pushAssets(stream, httpResponse.body));
			}
		}
	
		stream.respond({
			'content-type': 'text/html; charset=utf-8',
			':status': httpResponse.statusCode
		});

		stream.end(httpResponse.body);
	}

	public _main = async (stream: ServerHttp2Stream, headers: any) => {
		try {
			await this.onConnect(stream, headers);
		} catch (err) {
			if (err instanceof NotFoundError) {
				this.notFoundServerError.handle(stream, err);
			} else {
				this.genericServerError.handle(stream, err);
			}
			console.log(err);
		}
	}
}