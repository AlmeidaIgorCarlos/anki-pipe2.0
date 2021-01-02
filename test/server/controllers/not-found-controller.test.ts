import { HttpRequest } from '../../../src/server/contracts/http-request';
import {NotFoundController} from '../../../src/server/controllers/not-found-controller';
import assert from 'assert';
import { HttpResponse } from '../../../src/server/contracts/http-response';

describe('not-found-controller.ts', ()=>{
	describe('handle', ()=>{
		it('In case it is executed, a response with body "NOT FOUND" must be returned', ()=>{
			const notFoundController = new NotFoundController();
			const request: HttpRequest = {};
			const response: HttpResponse = notFoundController.handle(request);
			assert.strictEqual(response.body, 'NOT FOUND');
		});
        
		it('In case it is executed, a response with status code 404 must be returned', ()=>{
			const notFoundController = new NotFoundController();
			const request: HttpRequest = {};
			const response: HttpResponse = notFoundController.handle(request);
			assert.strictEqual(response.statusCode, 404);
		});
	}); 
});