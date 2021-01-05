import 'reflect-metadata';
import assert from 'assert';
import { BaseController } from '../../../src/server/controllers/base-controller';

describe('generic-server-error.ts', () => {
	it('handle should return correct values', async () => {

		const baseController = new BaseController();

		const httpResponse = await baseController.handle({
			body: 'Hello World!'
		});

		assert.deepStrictEqual(httpResponse, {
			statusCode: 200,
			body: 'Hello World!'
		});
	});
    
	it('render should return correct values', async () => {

		const baseController = new BaseController();

		const httpResponse = await baseController.render('index', { hello: 'Hello World!' });

		assert.deepStrictEqual(httpResponse, {
			statusCode: 200,
			body: '@index',
			data: {
				hello: 'Hello World!'
			}
		});
	});
});