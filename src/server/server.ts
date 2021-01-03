import http2, { Http2SecureServer, ServerHttp2Stream } from 'http2';
import url from 'url';
import { HttpResponse } from './contracts/http-response';
import assert from 'assert';
import { Route } from './route';
import { NotFoundController } from './controllers/not-found-controller';
import { ServerOptions } from './contracts/server-options';

export class Server {
	private readonly http2: Http2SecureServer;
	private routes: Route[];

	constructor(options: ServerOptions, routes?: Route[]) {
		this.http2 = http2.createSecureServer(options);
		this.routes = routes ? routes : [];
	}

	public listen (port: number): Http2SecureServer {
		this.http2.on('stream', this.onConnect);
		this.http2.listen(port);
		return this.http2;
	}

	public findRoute(route: Route) {
		const foundRoute: Route = this.routes.find((fRoute: Route) => {
			if (route.equals(fRoute))
				return true;
			else return false;
		}) as Route;

		if (foundRoute)
			return foundRoute;
		else throw new Error('ROUTE_NOT_FOUND');
	}

	public onConnect (stream: ServerHttp2Stream, headers: any): void {
		const method = headers[':method'];
		const { query, pathname } = url.parse(headers[':path'], true);

		assert(pathname);

		const route: Route = this.findRoute(new Route(method, pathname, new NotFoundController()));

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