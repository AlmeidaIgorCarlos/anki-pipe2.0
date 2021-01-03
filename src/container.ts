import {Container} from 'inversify';
import {TYPES} from './types';
import {ServerError} from './server/contracts/server-error';
import { GenericServerError } from './server/server-errors/generic-server-error';
import { NotFoundServerError } from './server/server-errors/not-found-server-error';

const container = new Container();

container.bind<ServerError>(TYPES.GenericServerError).to(GenericServerError);
container.bind<ServerError>(TYPES.NotFoundServerError).to(NotFoundServerError);

export {container};