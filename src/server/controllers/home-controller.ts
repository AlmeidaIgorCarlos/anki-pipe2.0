import { HttpRequest } from '../contracts/http-request';
import { HttpResponse } from '../contracts/http-response';
import { BaseController } from './base-controller';
export class HomeController extends BaseController {
	async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		const { params } = httpRequest;
		const data = { id: params.id };

		return this.render('homepage', data);
	}
}