import { DefaultAnkiCardTheme } from '../../domain/default-anki-card-theme';
import Repository from '../../domain/repository';
import Anki from '../../repositories/anki';
import { AnkiConnectionError } from '../../repositories/errors/anki-connection-error';
import { HttpResponse } from '../contracts/http-response';
import { BaseController } from './base-controller';

export class DeckController extends BaseController{
	async handle(): Promise<HttpResponse>{
		try {
			
			const anki: Repository = new Anki('', new DefaultAnkiCardTheme());
			const decks: string[] = await anki.getAvailableDecks();

			return this.json().ok({ decks });
			
		} catch (error) {

			if (error instanceof AnkiConnectionError) {
				return this.json().badGateway({
					message: error.message
				});
			}

			return this.json().serverError({
				message: 'It was not possible to list the available decks'
			});
		}
	}
}