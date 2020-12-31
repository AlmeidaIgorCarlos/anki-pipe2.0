import http2, { Http2Server } from 'http2';
import url from 'url';
import { Controller } from './contracts/controller';
import { HttpResponse } from './contracts/http-response';
import { match } from 'path-to-regexp';

export enum Methods {
    GET = 'GET',
    POST = 'POST',
    ALL = 'ALL'
}

export type Route = {
    method: string
    pathname: string
    controller: Controller
}

export interface ServerOptions {
    key: Buffer
    cert: Buffer
}

export class Server {
private readonly http2: Http2Server;

private routes: Route[] = [];
    
constructor(options: ServerOptions) {
	this.http2 = http2.createSecureServer(options);
}

public setRoutes = (routes: Route[]): void => {
	this.routes = routes;
}

public listen = (port: number): void => {
	this.http2.on('stream', this.onConnect);
	this.http2.listen(port);
}

private onConnect = (stream: any, headers: any) => {
	const path = headers[':path'];
	const method = headers[':method'];
	const { query, pathname } = url.parse(path, true);

	// Colocar esse código no Router
	let params = {};
	const route: Route = this.routes.find((route: Route) => {
		const matchPath = match(route.pathname, { decode: decodeURIComponent });
		const matched = matchPath(pathname);
		if (matched && (route.method === method || route.method === Methods.ALL)) {
			params = matched.params;
			return true;
		} else throw new Error('');
	});

	const httpRequest = {
		headers: headers,
		body: headers.body,
		params: params,
		query: query
	};
	const controller: Controller = route.controller;
	const httpResponse: HttpResponse = controller.handle(httpRequest);
	stream.respond({
		'content-type': 'text/html; charset=utf-8',
		':status': httpResponse.statusCode
	});
	stream.end(httpResponse.body);
}
}