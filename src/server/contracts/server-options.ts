import { ServerError } from './server-error';
import { ServerPush } from './server-push';
import { TemplateEngine } from './template-engine';

export type ServerOptions = {
	key: Buffer
	cert: Buffer,
	genericServerError: ServerError,
	notFoundServerError: ServerError,
	templateEngine?: TemplateEngine;
	serverPushers?: ServerPush[];
}