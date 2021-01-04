import {Definition} from './definition';
import {Example} from './example';
import {GrammarClass} from './grammar-class';
import {Sentence} from './sentence';
import {Pronunciation} from './pronunciation';

export class Card{
    private readonly _pronunciation: Pronunciation;
    private readonly _sentence: Sentence
    private readonly _definitions: Definition[];
    private readonly _examples: Example[];
    private readonly _grammarClasses: GrammarClass[];

    constructor(
    	pronunciation: Pronunciation,
    	sentence: Sentence,
    	definitions: Definition[],
    	examples: Example[],
    	grammarClasses: GrammarClass[],
    ){
    	this._pronunciation = pronunciation;
    	this._sentence = sentence;
    	this._definitions = definitions;
    	this._examples = examples;
    	this._grammarClasses = grammarClasses;
    }

    save(){
    	throw new Error('NOT_IMPLEMENTED');
    }
}