import https from 'https';
import {Dictionary} from '../domain/dictionary';
import cheerio from 'cheerio';
import { NotFoundError } from '../server/errors/not-found-error';
import { Pronunciation } from '../domain/pronunciation';
import { Definition } from '../domain/definition';
import { GrammarClass } from '../domain/grammar-class';
import { UninitializedError } from '../server/errors/uninitialized-error';
import { Example } from '../domain/example';

export class Collins implements Dictionary{

    private readonly dictionaryUrl: string = 'https://www.collinsdictionary.com/pt/dictionary/english'
    private readonly _word: string;
    private readonly _getSound: boolean;
    private $: any;

    constructor(word: string, getSound = false){
    	this._word = word;
    	this._getSound = getSound;
    }

    public getDictionaryContent(): Promise<string>{
    	let websiteContent: string;
    	return new Promise((resolve, reject)=>{
    		https.get(`${this.dictionaryUrl}/${this._word}`, (res)=>{
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

    public async searchPronunciation(): Promise<Pronunciation>{
    	if(!this.$)
    		throw new UninitializedError();
			
    	const pronunciationContentText: string = this.$('.pron').text();
    	const pronunciationText = pronunciationContentText.split('\n')[0];

    	const pronunciationDownloadUrl: string = this.$('.sound').attr('data-src-mp3');

    	const soundBuffer: Buffer = this._getSound ? await new Promise((resolve)=>{
    		https.get(pronunciationDownloadUrl, res => {
    			const soundBuffers: Buffer[] = [];
				
    			res.on('data', chunk => {
    				soundBuffers.push(chunk);	
    			});
				
    			res.on('end', ()=>{
    				resolve(Buffer.concat(soundBuffers));
    			});
    		});
    	}) : Buffer.from('');
		
    	return new Pronunciation(pronunciationText, soundBuffer, pronunciationDownloadUrl);
    }
	
    public searchDefinitions(): Promise<Definition[]> {
    	if(!this.$)
    		throw new UninitializedError();
			
    	const definitionsContent = this.$('.def').text().replace(/(\r\n|\r|\n)/g, '').split('.');

    	return definitionsContent.map((definition: string) => new Definition(definition));
    }
	
    public searchGrammarClasses(): GrammarClass[] {
    	if(!this.$)
    		throw new UninitializedError();

    	const cheerioElements = this.$('.hom>.gramGrp>.pos');
		
    	const grammarClasses: GrammarClass[] = [];

    	for(let i=0; i<cheerioElements.length; i++){
    		grammarClasses.push(new GrammarClass(cheerioElements[i].children[0].data));
    	}

    	return grammarClasses;
    }
	
    public async searchExamples(): Promise<Example[]> {
    	if(!this.$)
    		throw new UninitializedError();
			
    	const exampleNodes = this.$('.type-example');
    	const examples: Example[] = [];
		
    	for(let i=0;i<exampleNodes.length;i++){
    		let exampleText: string;
			
    		if(exampleNodes[i].children[0].data){
    			exampleText = exampleNodes[i].children[0].data;
    			examples.push(new Example(exampleText, Buffer.from(''), ''));
    		}
    		else{
    			exampleText = exampleNodes[i].children[0].children[0].data;
			
    			let exampleSoundUrl: any;
    			try {
    				exampleSoundUrl = exampleNodes[i].children[1].children[1].attribs['data-src-mp3'];
    			} catch (error) {
    				exampleSoundUrl = exampleNodes[i].children[3].children[1].attribs['data-src-mp3'];
    			}
				
    		const soundBuffer: Buffer = this._getSound ? await new Promise((resolve)=>{
    			https.get(exampleSoundUrl, res => {
    				const soundBuffers: Buffer[] = [];
					
    				res.on('data', chunk => {
    					soundBuffers.push(chunk);	
    				});
					
    				res.on('end', ()=>{
    					resolve(Buffer.concat(soundBuffers));
    				});
    			});
    		}) : Buffer.from('');
			
    			examples.push(new Example(exampleText, soundBuffer, exampleSoundUrl));
    		}
			
    	}
			
    	return examples;
    }
}