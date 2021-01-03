import { Controller } from '../contracts/controller';
import { HttpRequest } from '../contracts/http-request';
import { HttpResponse } from '../contracts/http-response';

export class BaseController implements Controller {

	async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		return {
			statusCode: 200,
			body: httpRequest.body
		};
	}
    
	async render (view: string, data: any, statusCode = 200): Promise<HttpResponse> {
		return {
			statusCode,
			body: `@${view}`,
			data: data
		};
	}
}