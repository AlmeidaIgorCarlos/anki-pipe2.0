import {Element} from './element';

export class Definition implements Element{

    private _definition: string

    constructor(definition: string){
    	this._definition = definition;
    }
    
    get definition(): string{
    	return this._definition;
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