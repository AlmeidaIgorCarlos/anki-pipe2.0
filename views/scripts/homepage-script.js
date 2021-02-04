// eslint-disable-next-line no-undef
const dialogControl = new DialogControl();

function showMissingWordMessage() {
	dialogControl.setTitle('Warning');
	dialogControl.setMessage('Please, select a word!');
	dialogControl.setButton1('', () => {});
	dialogControl.setButton2('Ok', () => dialogControl.hide());
	dialogControl.setWidth(350);
	dialogControl.show();
}

function analyzeSentence(sentence){
	this.sentence = sentence;
	this.selectedWord = undefined;
	const words = sentence.split(' ').filter(word => word != '');
    
	// eslint-disable-next-line no-undef
	const typedWordsElement = document.getElementById('typed-words');
	typedWordsElement.textContent = '';
    
	words.forEach(word => {
		// eslint-disable-next-line no-undef
		const newElement = document.createElement('input');
		newElement.setAttribute('type', 'button');
		newElement.setAttribute('value', word);
		newElement.setAttribute('class', 'lead word paragraph-weight');
		newElement.setAttribute('onclick', 'selectWord(this)');
        
		typedWordsElement.appendChild(newElement);
	});
}

function selectWord(wordElement){
	// eslint-disable-next-line no-undef
	const typedWordsElement = document.getElementById('typed-words');
	Array.from(typedWordsElement.children).forEach(child => {
		child.setAttribute('class', 'lead word paragraph-weight paragraph-font-size');
	});
    
	this.selectedWord = wordElement.value;
	wordElement.setAttribute('class', 'lead word selected paragraph-weight paragraph-font-size white-font-color');
}

async function searchWord(){
	if(!this.selectedWord){
		showMissingWordMessage();
		return;
	}else{
		// eslint-disable-next-line no-undef
		let response = await fetch('https://localhost:3000/search', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				sentence: this.sentence,
				word: this.selectedWord
			})
		});

		delete this.selectedWord;

		response = await response.json();

		const fatherElement = document.createElement('section');
		fatherElement.setAttribute('id', 'result-element');

		const fatherElementSentence = document.createElement('h3');
		fatherElementSentence.innerText = response._children.find(c => c._sentence)._sentence;
		fatherElement.appendChild(fatherElementSentence);
		
		const fatherElementPronunciation = document.createElement('h4');
		fatherElementPronunciation.innerText = response._children.find(c => c._pronunciation)._pronunciation;
		fatherElement.appendChild(fatherElementPronunciation);
		
		const grammarClasses = response._children.filter(c => c._grammarClass);
		
		grammarClasses.forEach(gC => {
			const fatherElementGrammarClassArticle = document.createElement('article');
			fatherElementGrammarClassArticle.setAttribute('class', 'grammar-class-container');

			const fatherElementGrammarClass = document.createElement('h5');
			fatherElementGrammarClass.innerText = gC._grammarClass;

			fatherElementGrammarClassArticle.appendChild(fatherElementGrammarClass);

			const definitions = gC._children.filter(gCc => gCc._definition);
			definitions.forEach(d => {
				const grammarClassDefinitionsElement = document.createElement('p');
				grammarClassDefinitionsElement.setAttribute('class', 'definition');
				grammarClassDefinitionsElement.innerText = d._definition;
				fatherElementGrammarClassArticle.appendChild(grammarClassDefinitionsElement);
			});

			const examples = gC._children.filter(gCc => gCc._example);
			examples.forEach(e => {
				const grammarClassExampleElement = document.createElement('p');
				grammarClassExampleElement.setAttribute('class', 'example');
				grammarClassExampleElement.innerText = `- ${e._example}`;
				fatherElementGrammarClassArticle.appendChild(grammarClassExampleElement);
			});

			fatherElement.appendChild(fatherElementGrammarClassArticle);
		});

		const resultElement = document.getElementById('result-element');
		if(resultElement)
			document.body.replaceChild(fatherElement, resultElement);
		else
			document.body.appendChild(fatherElement);
		
		location.href = '#result-element';
	}
}