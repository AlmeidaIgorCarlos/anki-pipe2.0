import { Collins } from '../../dictionaries/collins';
import { Card } from '../../domain/card';
import { DefaultAnkiCardTheme } from '../../domain/default-anki-card-theme';
import { Dictionary } from '../../domain/dictionary';
import Repository from '../../domain/repository';
import { Sentence } from '../../domain/sentence';
import Anki from '../../repositories/anki';
import { HttpRequest } from '../contracts/http-request';
import { HttpResponse } from '../contracts/http-response';
import { BaseController } from './base-controller';

export class SearchController extends BaseController{
	async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
		const {word, sentence} = httpRequest.body;
        
		const collins: Dictionary = new Collins(word);
		const sentenceEntity = new Sentence(sentence, collins);
        
		const anki: Repository = new Anki('test', new DefaultAnkiCardTheme());
        
		const card: Card = await sentenceEntity.searchForWord();
		await card.save(anki);
        
		return {
			statusCode: 200,
			body: JSON.stringify(card),
			headers:{
				'Content-Type': 'application/json'
			}
		};

	}

}