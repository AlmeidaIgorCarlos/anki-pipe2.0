import {UndefinedParentError} from './errors/undefined-parent-error';

export class Element{
    private _parent: Element | undefined
    private _children: Element[] | undefined;

    set parent(parent: Element) {
    	this._parent = parent;
    	this.pushChild(this);
    }
	
    get parent(): Element {
    	if(this._parent instanceof Element)
    		return this._parent;
    	else throw new UndefinedParentError();
    }

    get children(): Element[]{
    	return this.children;
    }

    private pushChild(child: Element): void{
    	if(!this._children)
    		this._children = [];
    	this._children.push(child);
    }
}