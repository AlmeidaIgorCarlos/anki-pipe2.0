import {Element} from './element';

export class Example implements Element{

    private _example: string
    private _sound: Buffer

    constructor(example: string, sound: Buffer){
    	this._example = example;
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

}