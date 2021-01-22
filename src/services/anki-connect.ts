import axios, { AxiosInstance } from 'axios';

export class AnkiConnectionError extends Error {
	constructor () {
	  super('Anki Connect did not respond. Please make sure the plugin is installed');
	  this.name = 'ConnectionError';
	}
}

export class AnkiConnect {

	constructor(private readonly axios: AxiosInstance) {}

	async addNote(note: any): Promise<any> {
		const response = await this.axios.post('http://127.0.0.1:8765', {
			action: 'addNote',
			version: 6,
			params: {
				note
			}
		}, {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache'
			}
		});
		
		if (!response) throw new AnkiConnectionError();

		return response.data;
	}
}
