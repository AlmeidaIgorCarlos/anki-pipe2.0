import http from 'http';

import {AnkiConnectionError} from './errors/anki-connection-error';
import { Card } from '../domain/card';
import Repository from '../domain/repository';
import {NoteBuilder} from '../builders/note-builder';
import { Sentence } from '../domain/sentence';
import { GrammarClass } from '../domain/grammar-class';
import { Pronunciation } from '../domain/pronunciation';
import { Definition } from '../domain/definition';
import { Example } from '../domain/example';

class Anki implements Repository{

	buildBackString(pronunction: Pronunciation, grammarClasses:GrammarClass[]): string{
		let finalString = `<b>${pronunction.pronunciation}</b><br><br>`;

		grammarClasses.forEach(gC => {
			finalString += `<b>${gC.grammarClass}</b><br>`;
			
			const definition: Definition | undefined = gC.children.find(c => c instanceof Definition) as unknown as Definition;
			finalString += `${definition ? definition.definition : 'Definition not found'}<br>`;
			
			const example: Example[] = gC.children.filter(c => c instanceof Example) as unknown as Example[];
			example.forEach((e, i) => {
				finalString += `${e.example}<br>`;
				
				if(i === example.length-1){
					finalString += '<br>';
					finalString += '<br>';
				}
			});
		});

		return finalString;
	}

	async save(card: Card): Promise<any> {
		const sentence: Sentence = card.children.filter(child => child instanceof Sentence)[0] as unknown as Sentence;
		
		const pronunciation: Pronunciation = card.children.filter(child => child instanceof Pronunciation)[0] as unknown as Pronunciation;
		
		const grammarClassesElements = card.children.filter(child => child instanceof GrammarClass);
		const grammarClasses = grammarClassesElements.map(gC => gC as unknown as GrammarClass);

		const noteBuilder = new NoteBuilder();

		noteBuilder.addNote({
			deckName: card.deck,
			modelName: 'Basic'
		}).fields({
			Front: sentence.sentence,
			Back: this.buildBackString(pronunciation, grammarClasses)
		}).options({
			allowDuplicate: true,
		}).audio([
			{
				url: pronunciation.soundUrl,
				filename: `${Date.now()}.mp3`,
				fields: ['Front', 'Back']
			}
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