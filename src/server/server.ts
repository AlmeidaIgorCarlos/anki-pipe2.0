import http2, { Http2SecureServer } from 'http2';
import url from 'url';
import { Controller } from './contracts/controller';
import { HttpResponse } from './contracts/http-response';
import assert from 'assert';
import { Route } from './route';
import { NotFoundController } from './controllers/not-found-controller';

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
		this.http2.on('stream', this.onConnect);
		this.http2.listen(port);
		return this.http2;
	}

	public findRoute(route: Route) {
		const foundRoute: Route = this.routes.find((fRoute: Route) => {
			if (route.equals(fRoute))
				return true
			else return false
		}) as Route

		if (foundRoute)
			return foundRoute
		else throw new Error('ERROR_NOT_FOUND')
	}

	public onConnect = (stream: any, headers: any): void => {
		const method = headers[':method'];
		const { query, pathname } = url.parse(headers[':path'], true);

		assert(pathname);

		const route: Route = this.findRoute(new Route(method, pathname, new NotFoundController()))

		const httpRequest = {
			headers: headers,
			body: headers.body,
			query: query
		};

		const httpResponse: HttpResponse = route.controller.handle(httpRequest);

		stream.respond({
			'content-type': 'text/html; charset=utf-8',
			':status': httpResponse.statusCode
		});
		stream.end(httpResponse.body);
	}
}