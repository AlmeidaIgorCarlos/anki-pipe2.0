fetch('https://localhost:3000/decks', {
	method: 'GET'
}).then(response => {
	const {status} = response;
	response.json()
		.then(content => {
			if(String(status).substring(0, 1) !== '2'){
				showDialog(content.message);
				return;
			}

			this.decks = content.decks;

			const deckList = document.getElementById('deck-list');
			this.decks.forEach(deckName => {
				const optionElement = document.createElement('option');
				optionElement.setAttribute('value', deckName);
				optionElement.setAttribute('class', 'deck-item');
				optionElement.innerText = deckName;
				deckList.appendChild(optionElement);
			});
		});
});

// eslint-disable-next-line no-undef
const dialogControl = new DialogControl();

function showDialog(message) {
	dialogControl.setTitle('Warning');
	dialogControl.setMessage(message);
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
		showDialog('Please, select a word!');
		return;
	}else{
		const deckList = document.getElementById('deck-list');

		// eslint-disable-next-line no-undef
		let response = await fetch('https://localhost:3000/search', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				sentence: this.sentence,
				word: this.selectedWord,
				deckName: deckList.value
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