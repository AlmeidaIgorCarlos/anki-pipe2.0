import { ServerError } from './server-error';

export type ServerOptions = {
	key: Buffer
	cert: Buffer,
	genericServerError: ServerError,
	notFoundServerError: ServerError
}