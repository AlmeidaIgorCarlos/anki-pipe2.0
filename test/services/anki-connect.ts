/*import axios from 'axios';
import assert from 'assert';
import sinon, { createSandbox } from 'sinon';
import { AnkiConnect, AnkiConnectionError } from '../../src/services/anki-connect';
import { NoteBuilder } from '../../src/builders/note-builder';
import { use, expect }  from 'chai';
import chaiAsPromised = require('chai-as-promised');

before(async () => {
	use(chaiAsPromised);
});

const note = new NoteBuilder();
note.addNote({
	'deckName': 'English::English - Anki Pipe',
	'modelName': 'Basic',
}).fields({
	'Front': 'front content',
	'Back': 'back content'
}).options({
	'allowDuplicate': false,
	'duplicateScope': 'deck',
	'duplicateScopeOptions': {
		'deckName': 'Default',
		'checkChildren': false
	}
}).tags([
	'yomichan'
]).audio([{
	'url': 'https://assets.languagepod101.com/dictionary/japanese/audiomp3.php?kanji=猫&kana=ねこ',
	'filename': 'yomichan_ねこ_猫.mp3',
	'skipHash': '7e2c2f954ef6051373ba916f000168dc',
	'fields': [
		'Front'
	]
}]);

describe('anki-connect.ts', () => {
    
	describe('addNote', () => {
		it('Should call axios post with correct values', async () => {
			sinon.stub(axios, 'post').resolves({
				status: 200,
				data: {
					result: 1496198395707,
					error: null
				}
			});
			const spy = axios.post as any;
			const ankiConnect = new AnkiConnect(80);
			await ankiConnect.addNote(note.build());
			assert(spy.calledWith('http://127.0.0.1:80', {
				action: 'addNote',
				version: 6,
				params: {
					note: note.build()
				}
			}, {
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'no-cache'
				}
			}));
		});
		it('Should throw AnkiConnectionError if axios post method return undefined', async () => {
			const sandbox = createSandbox();
			sandbox.stub(axios, 'post').returns(Promise.resolve(undefined));
			const stub = axios.post as any;
			stub.returns(Promise.resolve(undefined));
			const ankiConnect = new AnkiConnect(80);
			const promise = ankiConnect.addNote(note.build());
			expect(promise).to.be.rejectedWith(new AnkiConnectionError());
		});
		/*it('Should throw if axios throws', async () => {
			const error = new Error();
			sinon.stub(axios, 'post').rejects(error);
			const ankiConnect = new AnkiConnect(80);
			const promise = ankiConnect.addNote(note.build());
			await expect(promise).to.be.rejectedWith(error);
		});*/
/*it('Should return success if success', async () => {
			sinon.stub(axios, 'post').resolves({
				status: 200,
				data: {
					result: 1496198395707,
					error: null
				}
			});
			const ankiConnect = new AnkiConnect(80);
			const response = await ankiConnect.addNote(note.build());
			expect(response).to.deep.equal({ result: 1496198395707, error: null });
		});
	});
});*/