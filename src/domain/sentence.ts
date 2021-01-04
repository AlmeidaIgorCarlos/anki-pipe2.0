import { Card } from './card';
import { Dictionary } from './dictionary';

export class Sentence {
    private readonly _sentence: string;
    private readonly _word: string;
    private readonly _dictionary: Dictionary
    
    /**
     * Constructor of the Sentence class
     * @param {string} sentence The main sentence of the card
     * @param {string} word The desired word that the user wants to search the meaning
     */
    public constructor(
    	sentence: string,
    	word: string,
    	dictionary: Dictionary
    ){
    	this._sentence = sentence;
    	this._word = word;
    	this._dictionary = dictionary;
    }

    /**
     * Encapsulation of the _sentence property
     */
    get sentence(): string{
    	return this._sentence;
    }

    /**
     * @function searchForWord
     * Method responsible for searching the word on the implemented dictionary
     */
    public searchForWord(): Card{
    	throw new Error('NOT_IMPLEMENTED');
    }

}