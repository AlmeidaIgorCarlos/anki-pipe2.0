import 'reflect-metadata';
import assert from 'assert';
import { GenericServerError } from '../../src/server/server-errors/generic-server-error';
import sinon from 'sinon';

describe('generic-server-error.ts', () => {
	it('handle should call respond method', () => {
		const genericServerError = new GenericServerError();
        
		const streamStub: any = {
			respond: sinon.spy(),
			end: () => true
		};
        
		genericServerError.handle(streamStub, new Error());
        
		assert(streamStub.respond.called);
	});
	it('handle should call end method', () => {
		const genericServerError = new GenericServerError();
        
		const streamStub: any = {
			respond: () => true,
			end: sinon.spy(),
		};
        
		genericServerError.handle(streamStub, new Error());
        
		assert(streamStub.end.called);
	});
	it('status should be 500', () => {
		const genericServerError = new GenericServerError();
        
		const streamStub: any = {
			respond: sinon.spy(),
			end: () => true
		};
        
		genericServerError.handle(streamStub, new Error());

		const respondArg = streamStub.respond.args[0][0];

		assert(respondArg[':status'] === 500);
	});
});