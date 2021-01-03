import { Errors } from '../contracts/errors';

export class NotFoundError implements Error {
    
    name: string;
    message: string;
    stack?: string | undefined;

    constructor () {
	    this.name = Errors.ERROR_NOT_FOUND;
	    this.message = Errors.ERROR_NOT_FOUND;
    }

}
