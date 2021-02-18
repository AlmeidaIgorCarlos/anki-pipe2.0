import { Collins } from '../../dictionaries/collins';
import { Card } from '../../domain/card';
import { DefaultAnkiCardTheme } from '../../domain/default-anki-card-theme';
import { Dictionary } from '../../domain/dictionary';
import { WordNotFoundError } from '../../domain/errors/word-not-found-error';
import Repository from '../../domain/repository';
import { Sentence } from '../../domain/sentence';
import Anki from '../../repositories/anki';
import { HttpRequest } from '../contracts/http-request';
import { HttpResponse } from '../contracts/http-response';
import { BaseController } from './base-controller';

export class SearchController extends BaseController{
	async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		const {word, sentence, deckName} = httpRequest.body;
        
		const collins: Dictionary = new Collins(word);
		const sentenceEntity = new Sentence(sentence, collins);
        
		const anki: Repository = new Anki(deckName, new DefaultAnkiCardTheme());
        
		try {
			const card: Card = await sentenceEntity.searchForWord();
			await card.save(anki);
	
			return this.json().ok(card);
		} catch (err) {
			if (err instanceof WordNotFoundError) {
				return this.json().notFound({ message: err.message });
			}
			return this.json().serverError({
				message: 'an unknown error occurred while searching for the word'
			});
		}
	}
}