import assert from 'assert';
import { readFileSync } from 'fs';
import { spy } from 'sinon';
import http2, { Http2SecureServer, ServerHttp2Stream } from 'http2';
import {
	Server
} from '../../src/server/server';
import { Route } from '../../src/server/route';
import { Methods } from '../../src/server/contracts/methods';
import { NotFoundController } from '../../src/server/controllers/not-found-controller';
import { HomeController } from '../../src/server/controllers/home-controller';

describe('server.ts', () => {
	const key = readFileSync('src/server/ssl/localhost-privkey.pem');
	const cert = readFileSync('src/server/ssl/localhost-cert.pem');

	let server: Server;
	beforeEach(() => {
		server = new Server({ key, cert });
	});

	describe('listen', () => {

		it('Once it is called the server must have a handler for the stream event', (done) => {
			server.onConnect = () => true;

			const spyer = spy(server, 'onConnect');

			const http2Server: Http2SecureServer = server.listen(3000);
			http2Server.emit('stream', {}, {});

			assert(spyer.called);
			http2Server.close();
			done();
		});

		it('Once it is called, the server must be ready for connections', (done) => {
			const http2Server: Http2SecureServer = server.listen(3000);
			http2.connect('https://localhost:3000/', {
				cert,
				rejectUnauthorized: false
			}, () => {
				http2Server.close();
				done();
			});
		});

	});

	describe('findRoute', () => {

		it('Given a server with many routes, if no route is found return false', () => {
			const routeToFind: Route = new Route(Methods.POST, '/', new NotFoundController());
			assert.throws(() => {
				server.findRoute(routeToFind);
			});
		});

		it('Given a server with many routes, if the wanted route is found it must return the wanted route ', () => {
			const server = new Server({
				cert,
				key
			}, [
				new Route(Methods.POST, '/', new NotFoundController())
			]);

			const routeToFind: Route = new Route(Methods.POST, '/', new NotFoundController());
			assert(server.findRoute(routeToFind));
		});

		it('Given a server with many routes, if the wanted route is found it must return the wanted route specifically from the server', () => {
			const server = new Server({
				cert,
				key
			}, [
				new Route(Methods.POST, '/', new HomeController())
			]);

			const routeToFind: Route = new Route(Methods.POST, '/', new NotFoundController());
			const foundRoute: Route = server.findRoute(routeToFind);
			assert(foundRoute.controller instanceof HomeController);
		});

	});

	describe('onConnect', () => {
		it('In case pathname is not defined, throw an exception', ()=>{
			assert.throws(()=>{
				server.onConnect({} as ServerHttp2Stream, {
					':method': 'GET',
					':path': ''
				});
			});
		});

		it('when called, it must return the body from the result of the controller');
	});
});