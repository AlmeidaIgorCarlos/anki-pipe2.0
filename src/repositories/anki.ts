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
		

		const sentence: Sentence = card.children.filter(child => child instanceof Sentence)[0] as unknown as Sentence;
		
		const pronunciation: Pronunciation = card.children.filter(child => child instanceof Pronunciation)[0] as unknown as Pronunciation;
		
		const grammarClassesElements = card.children.filter(child => child instanceof GrammarClass);
		const grammarClasses = grammarClassesElements.map(gC => gC as unknown as GrammarClass);

		const noteBuilder = new NoteBuilder();

		noteBuilder.addNote({
			deckName: card.deck,
			modelName: 'Básico'
		}).fields({
			Frente: sentence.sentence,
			Verso: grammarClasses[0]._grammarClass
		}).options({
			allowDuplicate: false,
			duplicateScope: 'test',
			duplicateScopeOptions: {
				deckName: 'Básico',
				checkChildren: false
			}
		}).tags([
			'test'
		]);

		const response: any = await new Promise((resolve, reject) => {
			let result = '';
			const params = JSON.stringify(noteBuilder.build());

			const request = http.request({
				host: 'localhost',
				method: 'POST',
				port: 8765,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': Buffer.byteLength(params)
				}
			}, res=>{
				res.setEncoding('utf8');
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
			
			request.write(params);
			request.end();
		});

		if(!response)
			throw new AnkiConnectionError();

		return response;
	}
}

export default Anki;