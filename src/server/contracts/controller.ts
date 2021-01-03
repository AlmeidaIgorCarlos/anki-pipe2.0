import { HttpResponse } from './http-response';
import { HttpRequest } from './http-request';

export interface Controller {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
