// Get references to the HTML elements we need to interact with
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const inputLanguage = document.getElementById('inputLanguage'); // New reference for the input language dropdown
const outputLanguage = document.getElementById('outputLanguage');
const translateButton = document.getElementById('translateButton');

// New button references for copy and speak functionality
const copyInputBtn = document.getElementById('copyInputBtn');
const speakInputBtn = document.getElementById('speakInputBtn');
const copyOutputBtn = document.getElementById('copyOutputBtn');
const speakOutputBtn = document.getElementById('speakOutputBtn');

// Function to handle text-to-speech
const speakText = (text, lang) => {
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Text-to-speech is not supported in your browser.");
    }
};

// Event listener for the translate button click
translateButton.addEventListener('click', async () => {
    const textToTranslate = inputText.value;
    const sourceLanguage = inputLanguage.value; // Get the selected source language
    const targetLanguage = outputLanguage.value;

    if (textToTranslate.trim() === '') {
        outputText.value = 'Please enter text to translate.';
        return;
    }

    translateButton.textContent = 'Translating...';
    translateButton.disabled = true;
    outputText.value = '';

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURI(textToTranslate)}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        let translatedText = '';
        if (data && data.length > 0 && data[0].length > 0) {
            data[0].forEach(part => {
                translatedText += part[0];
            });
        }
        outputText.value = translatedText || 'Translation failed. Please try again.';

    } catch (error) {
        console.error('Translation failed:', error);
        outputText.value = 'An error occurred during translation. Please check your network connection and try again.';
    } finally {
        translateButton.textContent = 'Translate';
        translateButton.disabled = false;
    }
});

// Event listeners for the new features

// Copy input text
copyInputBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(inputText.value).then(() => {
        alert('Input text copied to clipboard!');
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
});

// Speak input text
speakInputBtn.addEventListener('click', () => {
    // Pass the selected input language to the speak function
    speakText(inputText.value, inputLanguage.value === 'auto' ? 'en' : inputLanguage.value);
});

// Copy output text
copyOutputBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(outputText.value).then(() => {
        alert('Translated text copied to clipboard!');
    }).catch(err => {
        console.error('Could not copy text: ', err);
    });
});

// Speak output text
speakOutputBtn.addEventListener('click', () => {
    const lang = outputLanguage.value;
    speakText(outputText.value, lang);
});
