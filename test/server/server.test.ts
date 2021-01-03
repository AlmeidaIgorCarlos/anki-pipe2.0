import 'reflect-metadata';
import assert from 'assert';
import { readFileSync } from 'fs';
import { stub, spy, createSandbox } from 'sinon';
import http2, { Http2SecureServer, ServerHttp2Stream } from 'http2';
import {
	Server
} from '../../src/server/server';
import { Route } from '../../src/server/route';
import { Methods } from '../../src/server/contracts/methods';
import { HomeController } from '../../src/server/controllers/home-controller';
import { BaseController } from '../../src/server/controllers/base-controller';
import { NotFoundError } from '../../src/server/errors/not-found-error';
import { GenericServerError } from '../../src/server/server-errors/generic-server-error';
import { NotFoundServerError } from '../../src/server/server-errors/not-found-server-error';
import { ServerOptions } from '../../src/server/contracts/server-options';

describe('server.ts', () => {
	const key = readFileSync('src/server/ssl/localhost-privkey.pem');
	const cert = readFileSync('src/server/ssl/localhost-cert.pem');
	
	const getServerOptions = (): ServerOptions => ({
		key,
		cert,
		genericServerError: new GenericServerError(),
		notFoundServerError: new NotFoundServerError()
	});

	const sinon = createSandbox();
	let server: Server;
	beforeEach(() => {
		sinon.restore();
		server = new Server(getServerOptions());
	});

	describe('listen', () => {

		it('Once it is called the server must have a handler for the stream event', (done) => {
			server.onConnect = () => Promise.resolve();

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
			const server = new Server(getServerOptions(), [
				new Route(Methods.POST, '/test', new BaseController())
			]);
			const routeToFind: Route = new Route(Methods.POST, '/', new BaseController());
			assert.throws(() => {
				server.findRoute(routeToFind);
			});
		});

		it('Given a server with many routes, if the wanted route is found it must return the wanted route ', () => {
			const server = new Server(getServerOptions(), [
				new Route(Methods.POST, '/', new BaseController())
			]);

			const routeToFind: Route = new Route(Methods.POST, '/', new BaseController());
			assert(server.findRoute(routeToFind));
		});

		it('Given a server with many routes, if the wanted route is found it must return the wanted route specifically from the server', () => {
			const server = new Server(getServerOptions(), [
				new Route(Methods.POST, '/', new HomeController())
			]);

			const routeToFind: Route = new Route(Methods.POST, '/', new BaseController());
			const foundRoute: Route = server.findRoute(routeToFind);
			assert(foundRoute.controller instanceof HomeController);
		});

	});

	describe('onConnect', () => {
		it('In case pathname is not defined, throw an exception', async ()=>{

			assert.rejects( async ()=>{
				server.onConnect({} as ServerHttp2Stream, {
					':method': 'GET',
					':path': ''
				});
			});
		});

		it('when called, it must return the body from the result of the controller', async ()=>{
			const homeController = new HomeController;
			stub(homeController, 'handle')
				.returns(Promise.resolve({
					body: 'HomeControllerResult',
					statusCode: 200
				}));

			const server = new Server(getServerOptions(), [
				new Route(
					Methods.GET,
					'/',
					homeController
				)
			]);

			const spyFunction = spy();

			const stream = {
				respond(){
					console.log('respond being executed');
				},
				end: spyFunction
			};

			await server.onConnect(stream as unknown as ServerHttp2Stream, {
				':method': 'GET',
				':path': '/'
			});

			assert(stream.end.called);
			const response = await homeController.handle({});
			assert(stream.end.calledWith(response.body));
		});

		it('when called, it must return the statusCode from the result of the controller', async ()=>{
			const homeController = new HomeController;
			sinon.stub(homeController, 'handle')
				.returns(Promise.resolve({
					body: 'HomeControllerResult',
					statusCode: 200
				}));

			const server = new Server(getServerOptions(), [
				new Route(
					Methods.GET,
					'/',
					homeController
				)
			]);

			const spyFunction = sinon.spy();

			const stream = {
				respond: spyFunction,
				end(){
					console.log('end function is being called');
				}
			};

			server.onConnect(stream as unknown as ServerHttp2Stream, {
				':method': 'GET',
				':path': '/'
			});

			const response = await homeController.handle({});

			assert(stream.respond.called);
			assert(stream.respond.calledWith({
				'content-type': 'text/html; charset=utf-8',
				':status': response.statusCode
			}));
		});

		it('if template engine exists, render should be called with correct params', async () => {
			const baseController = new BaseController;
			sinon.stub(baseController, 'handle')
				.returns(Promise.resolve({
					body: '@BaseControllerView',
					data: { hello: 'Hello World!' },
					statusCode: 200
				}));

			const options: {
				key: Buffer
				cert: Buffer,
				genericServerError: any,
				notFoundServerError: any,
				templateEngine?: any;
			} = getServerOptions();
			options.templateEngine = {
				render: spy()
			};

			const stream = {
				respond(){
					console.log('respond function is being called');
				},
				end(){
					console.log('end function is being called');
				}
			};

			const server = new Server(options, [
				new Route(
					Methods.GET,
					'/',
					baseController
				)
			]);

			await server.onConnect(stream as unknown as ServerHttp2Stream, {
				':method': 'GET',
				':path': '/'
			});

			const args = options.templateEngine.render.args[0];
			
			assert(args[0] === '@BaseControllerView');
			assert.deepStrictEqual(args[1], { hello: 'Hello World!' });
		});
		it('if template engine exists, httpResponse body should be equals the render return', async () => {
			const baseController = new BaseController;
			sinon.stub(baseController, 'handle')
				.returns(Promise.resolve({
					body: '@BaseControllerView',
					data: { hello: 'Hello World!' },
					statusCode: 200
				}));

			const options: {
				key: Buffer
				cert: Buffer,
				genericServerError: any,
				notFoundServerError: any,
				templateEngine?: any;
			} = getServerOptions();
			options.templateEngine = {
				render() {
					return 'render return';
				}
			};

			const stream = {
				respond(){
					console.log('respond function is being called');
				},
				end: spy()
			};

			const server = new Server(options, [
				new Route(
					Methods.GET,
					'/',
					baseController
				)
			]);

			await server.onConnect(stream as unknown as ServerHttp2Stream, {
				':method': 'GET',
				':path': '/'
			});

			assert(stream.end.calledWith('render return'));
		});
	});

	describe('_main', ()=>{
		it('In case a NotFoundError is thrown, notfound function must be called', ()=>{
			const options: {
				key: Buffer
				cert: Buffer,
				genericServerError: any,
				notFoundServerError: any
			} = getServerOptions();

			options.notFoundServerError.handle = sinon.spy();

			const server = new Server(options);

			sinon.stub(server, 'onConnect')
				.throws(new NotFoundError());

			server._main({} as ServerHttp2Stream, {});

			assert(options.notFoundServerError.handle.called);
		});

		it('In case a any Error is thrown, GenericServerError handle function must be called', ()=>{
			const options: {
				key: Buffer
				cert: Buffer,
				genericServerError: any,
				notFoundServerError: any
			} = getServerOptions();

			options.genericServerError.handle = sinon.spy();

			const server = new Server(options);

			sinon.stub(server, 'onConnect')
				.throws(new Error('any'));

			server._main({} as ServerHttp2Stream, {});

			assert(options.genericServerError.handle.called);
		});
	});
});