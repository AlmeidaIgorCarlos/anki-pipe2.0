import 'reflect-metadata';
import assert from 'assert';
import sinon from 'sinon';
import { NotFoundServerError } from '../../src/server/server-errors/not-found-server-error';

describe('not-found-server-error.ts', () => {
	it('handle should call respond method', () => {
		const genericServerError = new NotFoundServerError();
        
		const streamStub: any = {
			respond: sinon.spy(),
			end: () => true
		};
        
		genericServerError.handle(streamStub);
        
		assert(streamStub.respond.called);
	});
	it('handle should call end method', () => {
		const genericServerError = new NotFoundServerError();
        
		const streamStub: any = {
			respond: () => true,
			end: sinon.spy(),
		};
        
		genericServerError.handle(streamStub);
        
		assert(streamStub.end.called);
	});
	it('status should be 404', () => {
		const genericServerError = new NotFoundServerError();
        
		const streamStub: any = {
			respond: sinon.spy(),
			end: () => true
		};
        
		genericServerError.handle(streamStub);

		const respondArg = streamStub.respond.args[0][0];

		assert(respondArg[':status'] === 404);
	});
});