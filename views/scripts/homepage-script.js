function analyzeSentence(sentence){
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
		console.log(child);
		child.setAttribute('class', 'lead word paragraph-weight paragraph-font-size');
	});
    
	this.selectedWord = wordElement.value;
	wordElement.setAttribute('class', 'lead word selected paragraph-weight paragraph-font-size white-font-color');
}

function searchWord(){
	if(!this.selectedWord){
		return;
	}else{
	}
}