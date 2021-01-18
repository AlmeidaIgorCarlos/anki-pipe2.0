import {Element} from './element';

export class Pronunciation implements Element{
    private readonly _pronunciation: string;
    private readonly _sound: Buffer;
    
    constructor(pronunciation: string, sound: Buffer){
    	this._pronunciation = pronunciation;
    	this._sound = sound;
    }
    
    setParent(parent: Element): void {
    	throw new Error('Method not implemented.');
    }
    getParent(): Element {
    	throw new Error('Method not implemented.');
    }
    getChilldren(): Element[] {
    	throw new Error('Method not implemented.');
    }

    get pronunciation(){
    	return this._pronunciation;
    }

    get sound(){
    	return this._sound;
    }
}