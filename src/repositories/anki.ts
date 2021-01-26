import http from 'http';

import {AnkiConnectionError} from './errors/anki-connection-error';
import { Card } from '../domain/card';
import Repository from '../domain/repository';
import {NoteBuilder} from '../builders/note-builder';
import { Sentence } from '../domain/sentence';
import { GrammarClass } from '../domain/grammar-class';
import { Pronunciation } from '../domain/pronunciation';

class Anki implements Repository{

	async save(card: Card): Promise<any> {
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

		const response: any = await new Promise((resolve, reject) => {
			let result = '';

			const request = http.request({
				host: 'localhost',
				method: 'POST',
				port: 8765,
				headers: {
					'Content-Type': 'application/json'
				}
			}, res=>{
				if(res.statusCode === 200 || res.statusCode === 201){
					res.on('data', chunk => {
						result+=chunk;
					});

					res.on('end', ()=>{
						console.log(result);
						resolve(result);
					});
				}
				else reject(false);
			});

			const params = JSON.stringify(noteBuilder.build());
	
			request.write(params);
			request.end();
		});

		if(!response)
			throw new AnkiConnectionError();

		return response;
	}
}

export default Anki;