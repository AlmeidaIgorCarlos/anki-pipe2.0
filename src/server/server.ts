import http2, { Http2SecureServer, ServerHttp2Stream } from 'http2';
import url from 'url';
import { HttpResponse } from './contracts/http-response';
import assert from 'assert';
import { Route } from './route';
import { NotFoundController } from './controllers/not-found-controller';
import { notFound, serverError } from './error-helper';
import { NotFoundError } from './errors/not-found-error';
export interface ServerOptions {
	key: Buffer
	cert: Buffer
}

export class Server {
	private readonly http2: Http2SecureServer;
	private routes: Route[];

	constructor(options: ServerOptions, routes?: Route[]) {
		this.http2 = http2.createSecureServer(options);
		this.routes = routes ? routes : [];
	}

	public listen = (port: number): Http2SecureServer => {
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
		else throw new Error();
	}

	public onStream = (stream: ServerHttp2Stream, headers: any): void => {
		const method = headers[':method'];
		const { query, pathname } = url.parse(headers[':path'], true);
	
		assert(pathname);
	
		const route: Route = this.findRoute(new Route(method, pathname, new NotFoundController()));

		const httpRequest = {
			headers: headers,
			body: headers['body'],
			params: route.params(pathname),
			query: query
		};
	
		const httpResponse: HttpResponse = route.controller.handle(httpRequest);
	
		stream.respond({
			'content-type': 'text/html; charset=utf-8',
			':status': httpResponse.statusCode
		});
		stream.end(httpResponse.body);
	}

	private _main = (stream: ServerHttp2Stream, headers: any) => {
		try {
			this.onStream(stream, headers);
		} catch (err) {
			if (err instanceof NotFoundError) {
				notFound(stream);
			} else {
				serverError(stream, err);
			}
		}
	}
}