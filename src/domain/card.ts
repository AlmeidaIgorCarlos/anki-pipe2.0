import {Element} from './element';
import Repository from './repository';

export class Card extends Element {
	
	private _deck: string;

	constructor(deck: string){
		super();
		this._deck = deck;
	}

	get deck(): string{
		return this._deck;
	}

	save(repository: Repository){
		repository.save(this);
	}	
}