import { Controller } from '../contracts/controller';
import { HttpRequest } from '../contracts/http-request';
import { HttpResponse } from '../contracts/http-response';

export class HomeController implements Controller {
	handle (httpRequest: HttpRequest): HttpResponse {
		return {
			statusCode: 200,
			body: 'HOMEPAGE'
		};
	}
}