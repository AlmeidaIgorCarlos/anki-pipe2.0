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

		response = await response.json();
	}
}