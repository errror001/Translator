// Get references to the HTML elements we need to interact with
const inputText = document.getElementById('inputText');
const outputText = document.getElementById('outputText');
const outputLanguage = document.getElementById('outputLanguage');
const translateButton = document.getElementById('translateButton');

// Event listener for the translate button click
translateButton.addEventListener('click', async () => {
    // Get the text to be translated and the target language
    const textToTranslate = inputText.value;
    const targetLanguage = outputLanguage.value;

    // Check if there is any text to translate
    if (textToTranslate.trim() === '') {
        outputText.value = 'Please enter text to translate.';
        return;
    }

    // Show a loading state to the user
    translateButton.textContent = 'Translating...';
    translateButton.disabled = true;
    outputText.value = ''; // Clear previous output

    // Using the Google Translate API for simplicity.
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURI(textToTranslate)}`;
    
    try {
        // Fetch the translation from the API
        const response = await fetch(url);
        const data = await response.json();

        // The translated text is nested within the JSON response
        // The structure is typically [ [ [ "Translated Text" ] ] ]
        let translatedText = '';
        if (data && data.length > 0 && data[0].length > 0) {
            data[0].forEach(part => {
                translatedText += part[0];
            });
        }

        // Display the translated text
        outputText.value = translatedText || 'Translation failed. Please try again.';

    } catch (error) {
        // Handle any network or API errors
        console.error('Translation failed:', error);
        outputText.value = 'An error occurred during translation. Please check your network connection and try again.';
    } finally {
        // Reset the button state regardless of success or failure
        translateButton.textContent = 'Translate';
        translateButton.disabled = false;
    }
});
