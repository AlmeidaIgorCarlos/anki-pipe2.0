import {Element} from './element';

export class GrammarClass implements Element{
    _parent: Element | undefined
    _children: Element[] | undefined
    _grammarClass: string

    constructor(grammarClass: string){
    	this._grammarClass = grammarClass;
    }

    get grammarClass():string{
    	return this._grammarClass;
    }

    setParent(parent: Element): void {
    	this._parent = parent;
    }

    getParent(): Element {
    	if(this._parent instanceof Element)
    		return this._parent;
    	else throw new Error('NO_PARENT_DEFINED');
    }
	
    getChilldren(): Element[] {
    	if(this._children instanceof Element)
    		return this._children;
    	else throw new Error('NO_CHILDREN_DEFINED');
    }

}