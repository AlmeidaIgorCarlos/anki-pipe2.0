import http from 'http';

import {AnkiConnectionError} from './errors/anki-connection-error';
import { Card } from '../domain/card';
import Repository from '../domain/repository';
import {NoteBuilder} from '../builders/note-builder';
import { Sentence } from '../domain/sentence';
import { GrammarClass } from '../domain/grammar-class';
import { Pronunciation } from '../domain/pronunciation';

class Anki implements Repository{

	async save(card: Card): Promise<boolean> {
		const noteBuilder = new NoteBuilder();

		noteBuilder.addNote({
			deckName: card.deck,
			modelName: 'Basic'
		});

		const sentence: Sentence = card.children.filter(child => child instanceof Sentence)[0] as unknown as Sentence;
		
		const pronunciation: Pronunciation = card.children.filter(child => child instanceof Pronunciation)[0] as unknown as Pronunciation;
		
		const grammarClassesElements = card.children.filter(child => child instanceof GrammarClass);
		const grammarClasses = grammarClassesElements.map(gC => gC as unknown as GrammarClass);

		noteBuilder.fields({
			Front: sentence.sentence,
			Back: grammarClasses[0]._grammarClass
		});

		noteBuilder.options({
			allowDuplicate: true,
		});
		
		const response: boolean = await new Promise((resolve, reject) => {
			const request = http.request({
				hostname: 'http://127.0.0.1:8765',
				method: 'POST',
				port: '8765',
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 'no-cache'
				}
			}, res=>{
				if(res.statusCode === 200 || res.statusCode === 201)
					resolve(true);
				else reject(false);
			});
	
			request.write({
				action: 'addNote',
				version: 6,
				params: noteBuilder.build()
			});
		});

		if(!response)
			throw new AnkiConnectionError();

		return response;
	}
}

export default Anki;