import {Methods} from '../../../src/server/contracts/methods';
import assert from 'assert';

describe('methods.ts', ()=>{
	it('GET element from enum must be equal to string GET', ()=>{
		assert.strictEqual(Methods.GET, 'GET');
	});
	it('POST element from enum must be equal to string POST', ()=>{
		assert.strictEqual(Methods.POST, 'POST');
	});
	it('ALL element from enum must be equal to string ALL', ()=>{
		assert.strictEqual(Methods.ALL, 'ALL');
	});
});