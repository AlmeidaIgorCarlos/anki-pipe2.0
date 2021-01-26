import { Card } from './card';
import { Dictionary } from './dictionary';
import {Element} from './element';

export class Sentence extends Element{
    private readonly _sentence: string;
    private readonly _dictionary: Dictionary
    
    /**
     * Constructor of the Sentence class
     * @param {string} sentence The main sentence of the card
     * @param {object} dictionary Instance of an implementation of the Dictionary interface
     */
    public constructor(
    	sentence: string,
    	dictionary: Dictionary,
    ){
    	super();
    	this._sentence = sentence;
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
    public async searchForWord(): Promise<Card>{
    	const card = new Card('english');
        
    	await this._dictionary.getDictionaryContent();
        
    	const examples = await this._dictionary.searchExamples();
    	const definitions = await this._dictionary.searchDefinitions();
    	const grammarClasses = await this._dictionary.searchGrammarClasses();
    	const pronunciation = await this._dictionary.searchPronunciation();
        
    	pronunciation.parent = card;
    	grammarClasses[0].parent = card;
    	examples[0].parent = grammarClasses[0];
    	definitions[0].parent = grammarClasses[0];
    	// grammarClasses.forEach((gC, index) => {
    	// 	gC.parent=card;
    	// 	examples[index].parent = gC;
    	// 	definitions[index].parent = gC;
    	// });
        
    	return card;
    }
}