import {Element} from './element';
import Repository from './repository';

export class Card extends Element {

	async save(repository: Repository){
		await repository.save(this);
	}	
}