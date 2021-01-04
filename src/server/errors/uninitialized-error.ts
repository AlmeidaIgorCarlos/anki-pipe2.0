import { Errors } from '../contracts/errors';

export class UninitializedError implements Error {
    
    name: string;
    message: string;
    stack?: string | undefined;

    constructor () {
	    this.name = Errors.ERROR_UNINITIALIZED;
	    this.message = Errors.ERROR_UNINITIALIZED;
    }
}