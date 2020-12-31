import { Controller } from '../server/contracts/controller';
import { HttpRequest } from '../server/contracts/http-request';
import { HttpResponse } from '../server/contracts/http-response';

export class NotFoundController implements Controller {
	handle (httpRequest: HttpRequest): HttpResponse {
		return {
			statusCode: 404,
			body: 'NOT FOUND'
		};
	}
}