import http from 'http';

import {AnkiConnectionError} from './errors/anki-connection-error';
import Repository from '../domain/repository';
import { NoteBuilder } from '../builders/note-builder';
import { AnkiCardTheme } from '../domain/anki-card-theme';
import { Card } from '../domain/card';

class Anki implements Repository{

	private _deck: string
	private _theme: AnkiCardTheme

	constructor(deck: string, theme: AnkiCardTheme) {
		this._theme = theme;
		this._deck = deck;
	}

	async getAvailableDecks(): Promise<string[]> {

		const response: string[] = await new Promise((resolve, reject) => {
			let result = '';
		
			const request = http.request({
				host: 'localhost',
				method: 'POST',
				port: 8765,
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					'Content-Length': Buffer.byteLength(JSON.stringify({
						'action': 'deckNames',
						'version': 6
					}))
				}
			}, res=>{
				res.setEncoding('utf8');
				if(res.statusCode === 200 || res.statusCode === 201){
					res.on('data', chunk => {
						result+=chunk;
					});
					
					res.on('end', ()=>{
						const ankiResult = JSON.parse(result);
						resolve(ankiResult.result as string[]);
					});
				}
				else reject([]);
			});	

			request.on('error', ()=>{
				reject();
			});
			
			request.write(JSON.stringify({
				'action': 'deckNames',
				'version': 6
			}));

			request.end();

		});

		if(!response)
			throw new AnkiConnectionError();
	
		return response;
	}

	async save(card: Card): Promise<any> {
		
		const noteBuilder: NoteBuilder = this._theme.getTemplate(this._deck, card);

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