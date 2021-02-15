import { Controller } from '../contracts/controller';
import { HttpRequest } from '../contracts/http-request';
import { HttpResponse } from '../contracts/http-response';

export class BaseController implements Controller {

	private headers: any = []

	constructor() {
		this.headers['Content-Type'] = 'text/html';
	}

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

	json(): BaseController {
		this.headers['Content-Type'] = 'application/json';
		return this;
	}

	response(statusCode: number, body: any, headers?: any) {
		let response = {
			statusCode: statusCode,
			body,
			headers: { ...this.headers, headers }
		};
		if (response.headers['Content-Type'] === 'application/json') {
			response = { ...response, body: JSON.stringify(body) };
		}
		return response;
	}

	serverError (body: any, headers?: any): HttpResponse {
		return this.response(500, body, headers);
	}

	badGateway (body: any, headers?: any): HttpResponse {
		return this.response(502, body, headers);
	}

	ok (body: any, headers?: any): HttpResponse {
		return this.response(200, body, headers);
	}

	notFound (body: any, headers?: any): HttpResponse {
		return this.response(404, body, headers);
	}
}