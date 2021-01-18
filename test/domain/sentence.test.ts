import assert from 'assert';
import { createSandbox } from 'sinon';
import { Collins } from '../../src/dictionaries/collins';
import { Dictionary } from '../../src/domain/dictionary';
import {Sentence} from '../../src/domain/sentence';

describe.skip('sentence.ts', ()=>{

	const sinon = createSandbox();
	beforeEach(()=>{
		sinon.restore();
	});

	describe('constructor', ()=>{
		it('given an instanciation, if _sentence is no set, an error must be thrown');
		it('given an instanciation, if _word is no set, an error must be thrown');
	});
    
	describe('sentence', ()=>{
		// it('Given a Sentence object, the sentence method must return the sentence given on its constructor', ()=>{
		// 	const sentence = 'Hello World';
		// 	const word = 'Hello';
		// 	const collinsDictionary: Dictionary = sinon.createStubInstance(Collins);

		// 	// const sentenceObject = new Sentence(sentence, word, collinsDictionary);

		// 	assert.strictEqual(sentenceObject.sentence, sentence);
		// });
	});
    
	describe('searchForWord', ()=>{
		it('Once it is called, must return a Card instance');
	});
});