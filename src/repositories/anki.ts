import http from 'http';

import {AnkiConnectionError} from './errors/anki-connection-error';
import { Card } from '../domain/card';
import Repository from '../domain/repository';
import {NoteBuilder} from '../builders/note-builder';

class Anki implements Repository{

	private readonly noteBuilder = new NoteBuilder();

	async save(card: Card): Promise<boolean> {
		//TODO -> user card on note
		const note = this.noteBuilder.build();
		
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
				params: {
					note
				}
			});
		});

		if(!response)
			throw new AnkiConnectionError();

		return response;
	}
}

export default Anki;