export class Pronunciation{
    private readonly _pronunciation: string;
    private readonly _sound: Buffer;
    
    constructor(pronunciation: string, sound: Buffer){
    	this._pronunciation = pronunciation;
    	this._sound = sound;
    }

    get pronunciation(){
    	return this._pronunciation;
    }

    get sound(){
    	return this._sound;
    }
}