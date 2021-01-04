import {Dictionary} from '../domain/dictionary';
import https from 'https';
import cheerio from 'cheerio';
import { NotFoundError } from '../server/errors/not-found-error';
import { Pronunciation } from '../domain/pronunciation';
import { Definition } from '../domain/definition';
import { Example } from '../domain/example';
import { GrammarClass } from '../domain/grammar-class';
import { UninitializedError } from '../server/errors/uninitialized-error';

export class Collins implements Dictionary{

    private readonly dictionaryUrl: string = 'https://www.collinsdictionary.com/pt/dictionary/english'
    private readonly _word: string;
    private $: any;

    constructor(word: string){
    	this._word = word;
    }

    public getDictionaryContent(word: string): Promise<string>{
    	let websiteContent: string;
    	return new Promise((resolve, reject)=>{
    		https.get(`${this.dictionaryUrl}/${word}`, (res)=>{
    			res.on('data', data => {
    				websiteContent += String(data);
    			});
                
    			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    			if(res.statusCode && res.statusCode.toString()[0] !== '2')
    				reject(new NotFoundError);
                
    			res.on('end', ()=>{
    				this.$ = cheerio.load(websiteContent);
    			    resolve(websiteContent);
    			});
    		}).on('error', (err)=>reject(err));
    	});
    }

    public searchPronunciation(): Pronunciation{
    	if(!this.$)
    		throw new UninitializedError();
			
    	let pronunciation:string = this.$('.pron').text();
    	pronunciation = pronunciation.split('\n')[0];
    	return new Pronunciation(pronunciation, Buffer.from(''));
    }
	
    public searchDefinitions(): Definition[] {
    	throw new Error('Method not implemented.');
    }
	
    public searchExamples(): Example[] {
    	throw new Error('Method not implemented.');
    }
	
    public searchGrammarClasses(): GrammarClass[] {
    	throw new Error('Method not implemented.');
    }

}