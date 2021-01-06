import { Definition } from './definition';
import { Example } from './example';
import { GrammarClass } from './grammar-class';
import { Pronunciation } from './pronunciation';

export interface Dictionary{
    getDictionaryContent(): Promise<string>
    searchPronunciation(): Pronunciation
    searchDefinitions(): Definition[]
    searchExamples(): Example[]
    searchGrammarClasses(): GrammarClass[]
}