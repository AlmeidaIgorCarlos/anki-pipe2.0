import { DefaultAnkiCardTheme } from '../../domain/default-anki-card-theme';
import Repository from '../../domain/repository';
import Anki from '../../repositories/anki';
import { HttpRequest } from '../contracts/http-request';
import { HttpResponse } from '../contracts/http-response';
import { BaseController } from './base-controller';

export class DeckController extends BaseController{
	async handle(httpRequest: HttpRequest): Promise<HttpResponse>{
		try {
			
			const anki: Repository = new Anki('', new DefaultAnkiCardTheme());
			const decks: string[] = await anki.getAvailableDecks();
			
			return {
				statusCode: 200,
				body: JSON.stringify({
					decks
				}),
				headers:{
					'Content-Type': 'application/json'
				}
			} as HttpResponse;
		} catch (error) {
			return {
				statusCode: 500,
				body: JSON.stringify({
					message: 'It was not possible to list the available decks'
				}),
				headers:{
					'Content-Type': 'application/json'
				}
			} as HttpResponse;
		}
	}
}