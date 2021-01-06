import { Card } from './card';
import { Dictionary } from './dictionary';
import Repository from './repository';

export class Sentence {
    private readonly _sentence: string;
    private readonly _word: string;
    private readonly _dictionary: Dictionary
    private readonly _repository: Repository
    
    /**
     * Constructor of the Sentence class
     * @param {string} sentence The main sentence of the card
     * @param {string} word The desired word that the user wants to search the meaning
     * @param {object} dictionary Instance of an implementation of the Dictionary interface
     * @param {object} repository Instance of an implementation of the repository instance
     */
    public constructor(
    	sentence: string,
    	word: string,
    	dictionary: Dictionary,
    	repository: Repository
    ){
    	this._sentence = sentence;
    	this._word = word;
    	this._dictionary = dictionary;
    	this._repository = repository;
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