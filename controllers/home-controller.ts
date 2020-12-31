import { Controller } from '../server/contracts/controller';
import { HttpRequest } from '../server/contracts/http-request';
import { HttpResponse } from '../server/contracts/http-response';

export class HomeController implements Controller {
	handle (httpRequest: HttpRequest): HttpResponse {
		return {
			statusCode: 200,
			body: 'HOMEPAGE'
		};
	}
}