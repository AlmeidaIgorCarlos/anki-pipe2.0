import axios from 'axios';
import assert from 'assert';
import sinon from 'sinon';
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
			const axiosInstance = axios.create();
			const ankiConnect = new AnkiConnect(axiosInstance);
			const spy = sinon.stub(axiosInstance, 'post').returns(Promise.resolve({
				'result': [1496198395707, null],
				'error': null
			}));
			await ankiConnect.addNote(note.build());
			assert(spy.calledWith('http://127.0.0.1:8765', {
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
			const axiosInstance = axios.create();
			const ankiConnect = new AnkiConnect(axiosInstance);
			sinon.stub(axiosInstance, 'post').returns(Promise.resolve(undefined));
			const promise = ankiConnect.addNote(note.build());
			await expect(promise).to.eventually.be.rejected
				.and.be.an.instanceOf(AnkiConnectionError);
		});
		it('Should throw if axios throws', async () => {
			const axiosInstance = axios.create();
			const ankiConnect = new AnkiConnect(axiosInstance);
			sinon.stub(axiosInstance, 'post').returns(Promise.reject(new Error()));
			const promise = ankiConnect.addNote(note.build());
			await expect(promise).to.be.rejected;
		});
		it('Should return Axios data if success', async () => {
			const axiosInstance = axios.create();
			const ankiConnect = new AnkiConnect(axiosInstance);
			sinon.stub(axiosInstance, 'post').resolves({
				status: 200,
				data: {
					result: 1496198395707,
					error: null
				}
			});
			const response = await ankiConnect.addNote(note.build());
			expect(response).to.deep.equal({ result: 1496198395707, error: null });
		});
	});
});