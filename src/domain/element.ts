import {UndefinedParentError} from './errors/undefined-parent-error';

export class Element{
    private _parent: Element | undefined
    
    set parent(parent: Element) {
    	this._parent = parent;
    }
	
    get parent(): Element {
    	if(this._parent instanceof Element)
    		return this._parent;
    	else throw new UndefinedParentError();
    }
}