import {Element} from './element';

export class Card extends Element {
	
	private _deck: string;

	constructor(deck: string){
		super();
		this._deck = deck;
	}

	save(){
    	throw new Error('NOT_IMPLEMENTED');
	}
}