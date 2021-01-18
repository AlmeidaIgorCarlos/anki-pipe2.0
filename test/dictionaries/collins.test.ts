import assert from 'assert';
import {createSandbox} from 'sinon';
import { Collins } from '../../src/dictionaries/collins';
import { Dictionary } from '../../src/domain/dictionary';
import { NotFoundError } from '../../src/server/errors/not-found-error';
import { Pronunciation } from '../../src/domain/pronunciation';
import { UninitializedError } from '../../src/server/errors/uninitialized-error';
import { GrammarClass } from '../../src/domain/grammar-class';
import { Definition } from '../../src/domain/definition';
import { Example } from '../../src/domain/example';

describe('collins.ts', ()=>{
	const sinon = createSandbox();

	beforeEach(()=>{
		sinon.restore();
	});
    
	describe('getDictionaryContent', ()=>{
		it('Once it is called, it must return the content from the dictionary site', async ()=>{
			const collinsDictionary = new Collins('hello');
			const dictionaryContent = await collinsDictionary.getDictionaryContent();
			assert(typeof dictionaryContent === 'string'); 
		});
        
		it('Once it is called, if something goes wrong in the request an exception must be thrown', async ()=>{
			try {
				const collinsDictionary = new Collins('hello/test/test');
				await collinsDictionary.getDictionaryContent();
				assert.fail('EXCEPTION_NOT_FOUND');
			} catch (error) {
				assert(error instanceof NotFoundError);    
			}
		});
        
	});
    
	describe('searchPronunciation', ()=>{
		it('When called it must return an instance of Pronunciation with property pronunciation equal to the content found at the collins dictionary', async ()=>{
			const collins: Dictionary = new Collins('hello');
			await collins.getDictionaryContent();
    
			const pronunciation: Pronunciation = await collins.searchPronunciation();
            
			assert.strictEqual(pronunciation.pronunciation, 'heloʊ');
		});
        
		it('Once it is called and cheerio instance is not loaded, throw an exception', async ()=>{
			try {
				const collins: Dictionary = new Collins('hello');
				await collins.searchPronunciation();
				assert.fail('EXCEPTION_NOT_FOUND');
			} catch (error) {
				assert(error instanceof UninitializedError);
			}
		});
	});

	describe('searchGrammarClasses', ()=>{
		it('Once it is called and cheerio instance is not loaded, throw an exception', ()=>{
			try {
				const collins: Dictionary = new Collins('hello');
				collins.searchGrammarClasses();
				assert.fail('EXCEPTION_NOT_FOUND');
			} catch (error) {
				assert(error instanceof UninitializedError);
			}
		});

		it('Once it is called it must return an array of instances of GrammarClass', async ()=>{
			const collins: Dictionary = new Collins('hello');
			await collins.getDictionaryContent();

			const grammarClasses: GrammarClass[] = await collins.searchGrammarClasses();
			
			assert(grammarClasses.length === 4);
		});
	});

	describe('searchDefinitions', ()=>{
		it('Once it is called and cheerio instance is not loaded, throw an exception', ()=>{
			try {
				const collins: Dictionary = new Collins('hello');
				collins.searchDefinitions();
				assert.fail('EXCEPTION_NOT_FOUND');
			} catch (error) {
				assert(error instanceof UninitializedError);
			}
		});

		it('Once it is called it must return an array of instances of GrammarClass', async ()=>{
			const collins: Dictionary = new Collins('hello');
			await collins.getDictionaryContent();

			const definitions: Definition[] = await collins.searchDefinitions();

			assert(definitions.length === 5);
		});
	});

	describe('searchExamples', ()=>{
		it('Once it is called and cheerio instance is not loaded, throw an exception', async ()=>{
			try {
				const collins: Dictionary = new Collins('hello');
				await collins.searchExamples();
				assert.fail('EXCEPTION_NOT_FOUND');
			} catch (error) {
				assert(error instanceof UninitializedError);
			}
		});

		it('Once it is called it must return an array of instances of GrammarClass', async ()=>{
			const collins: Dictionary = new Collins('hello');
			await collins.getDictionaryContent();

			const examples: Example[] = await collins.searchExamples();

			assert(examples.length === 9);
		});
	});
});