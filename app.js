let userPoints = 50; // Initialize points for user
document.getElementById('points').innerHTML = userPoints;

// Pronunciation check function
function checkPronunciation() {
    const word = document.getElementById('pronunciationInput').value.trim();
    const feedback = document.getElementById('pronunciationFeedback');
    
    const correctPronunciation = "hello"; // Example of correct pronunciation

    if (word === "") {
        feedback.innerHTML = "Please enter a word.";
        return;
    }

    // Simulating correct pronunciation check
    if (word.toLowerCase() === correctPronunciation) {
        feedback.innerHTML = `You typed: ${word}. Pronunciation is correct!`;
        updatePoints(10); // Award points for correct pronunciation
    } else {
        feedback.innerHTML = `You typed: ${word}. Pronunciation is incorrect.`;
        updatePoints(-5); // Deduct points for incorrect pronunciation
    }
}

// Start dictation for voice input
function startDictation() {
    if (window.SpeechRecognition || window.webkitSpeechRecognition) {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = document.getElementById('inputLanguage').value || 'en-US'; // Set recognition language
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.start();

        recognition.onresult = function (event) {
            const spokenText = event.results[0][0].transcript;
            document.getElementById('pronunciationInput').value = spokenText;
            checkPronunciation(); // Check pronunciation of spoken text
        };

        recognition.onerror = function (event) {
            alert("Error occurred in speech recognition: " + event.error);
        };
    } else {
        alert("Sorry, your browser does not support speech recognition.");
    }
}

// Function to update points and display badges
function updatePoints(change) {
    userPoints += change;
    document.getElementById('points').innerHTML = userPoints;
    
    // Update badges based on points
    const badges = document.getElementById('badges');
    if (userPoints >= 100) {
        badges.innerHTML = "Gold Badge";
    } else if (userPoints >= 75) {
        badges.innerHTML = "Silver Badge";
    } else if (userPoints >= 50) {
        badges.innerHTML = "Bronze Badge";
    } else {
        badges.innerHTML = "None";
    }
}

// Function to start lessons based on level
function startLesson(level) {
    const outputLanguage = document.getElementById('outputLanguage').value;
    
    if (level === 'beginner') {
        fetchAlphabets(outputLanguage);
    } else if (level === 'intermediate') {
        const word = prompt("Enter a word to find its synonyms and antonyms:");
        if (word) {
            fetchSynonymsAntonyms(word, outputLanguage);
        }
    } else if (level === 'advanced') {
        fetchCommonWords(outputLanguage);
    }
}

// Fetch alphabets for Beginner Lesson
function fetchAlphabets(language) {
    let alphabets = ''; // Mock alphabet data, can expand to fetch actual language-specific alphabets
    
    if (language === 'en') {
        alphabets = "A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z";
    } else if (language === 'hi') {
        alphabets = "अ, आ, इ, ई, उ, ऊ, ए, ऐ, ओ, औ, क, ख, ग, घ, च, छ, ज, झ, ट, ठ, ड, ढ, त, थ, द, ध, न, प, फ, ब, भ, म, य, र, ल, व, श, ष, स, ह";
    } else if (language === 'bn') {
        alphabets = "অ, আ, ই, ঈ, উ, ঊ, এ, ঐ, ও, ঔ, ক, খ, গ, ঘ, চ, ছ, জ, ঝ, ট, ঠ, ড, ঢ, ত, থ, দ, ধ, ন, প, ফ, ব, ভ, ম, য, র, ল, শ, ষ, স, হ";
    }
    
    alert(`Alphabets in ${language.toUpperCase()}: ${alphabets}`);
}

// Fetch synonyms and antonyms for Intermediate Lesson
function fetchSynonymsAntonyms(word, language) {
    const apiKey = 'your-api-key'; // Replace with actual API key if using Oxford API
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data && data[0].meanings) {
                const synonyms = data[0].meanings[0].definitions[0].synonyms.slice(0, 3);
                const antonyms = data[0].meanings[0].definitions[0].antonyms.slice(0, 3);

                // Now translate these synonyms and antonyms to the selected language
                translateWords(synonyms, antonyms, language, word);
            } else {
                alert('No synonyms or antonyms found for the entered word.');
            }
        })
        .catch(error => {
            console.error('Error fetching word details:', error);
            alert('Error fetching word details. Please try again.');
        });
}

// Translate words for Intermediate Lesson
function translateWords(synonyms, antonyms, language, word) {
    let synonymTranslation = '', antonymTranslation = '';
    
    // Use translation API to translate synonyms and antonyms to the selected language
    const translationApiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|${language}`;
    
    fetch(translationApiUrl)
        .then(response => response.json())
        .then(data => {
            synonymTranslation = data.responseData.translatedText;
            antonymTranslation = data.responseData.translatedText;

            alert(`Synonyms for "${word}": ${synonyms.join(', ')} (Translated: ${synonymTranslation})\nAntonyms for "${word}": ${antonyms.join(', ')} (Translated: ${antonymTranslation})`);
        })
        .catch(error => {
            console.error('Error translating words:', error);
            alert('Error translating words. Please try again.');
        });
}

// Fetch commonly used words for Advanced Lesson
function fetchCommonWords(language) {
    let words = ['hello', 'world', 'apple', 'banana', 'computer', 'science', 'friend', 'school', 'book', 'car']; // List of 100 commonly used words

    let translationPromises = words.map(word => {
        return fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|${language}`)
            .then(response => response.json())
            .then(data => {
                return { word: word, translation: data.responseData.translatedText };
            });
    });

    Promise.all(translationPromises)
        .then(translations => {
            let translationList = translations.map(item => `${item.word} => ${item.translation}`).join('\n');
            alert(`Commonly used words:\n${translationList}`);
        })
        .catch(error => {
            console.error('Error fetching translations:', error);
            alert('Error fetching translations. Please try again.');
        });
}

// Translation functionality for general purpose translation
function translateText() {
    const inputLanguage = document.getElementById('inputLanguage').value;
    const outputLanguage = document.getElementById('outputLanguage').value;
    const text = document.getElementById('translationInput').value;

    if (text === "") {
        alert("Please enter text to translate.");
        return;
    }

    fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${inputLanguage}|${outputLanguage}`)
        .then(response => response.json())
        .then(data => {
            const translatedText = data.responseData.translatedText;
            document.getElementById('translationOutput').innerHTML = `Translated Text: ${translatedText}`;
            speakText(translatedText, outputLanguage); // Call speakText to narrate the translation
        })
        .catch(error => {
            document.getElementById('translationOutput').innerHTML = "Translation failed. Please try again.";
        });
}

// Text-to-Speech function to narrate the translated text
function speakText(text, language) {
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    
    // Map output language codes to SpeechSynthesis language codes
    switch (language) {
        case 'en':
            speech.lang = 'en-US';
            break;
        case 'hi':
            speech.lang = 'hi-IN';
            break;
        case 'bn':
            speech.lang = 'bn-BD';
            break;
        case 'ru':
            speech.lang = 'ru-RU';
            break;
        case 'zh':
            speech.lang = 'zh-CN';
            break;
        case 'ja':
            speech.lang = 'ja-JP';
            break;
        case 'fr':
            speech.lang = 'fr-FR';
            break;
        case 'de':
            speech.lang = 'de-DE';
            break;
        default:
            speech.lang = 'en-US'; // Default to English if language not supported
    }

    window.speechSynthesis.speak(speech);
}

// Fetch country flags for better representation
function fetchCountryFlags(language) {
    const flagElement = document.getElementById('flagImage');
    let flagUrl = '';

    switch (language) {
        case 'en':
            flagUrl = 'https://upload.wikimedia.org/wikipedia/en/a/a4/Flag_of_the_United_States.svg';
            break;
        case 'hi':
            flagUrl = 'https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg';
            break;
        case 'bn':
            flagUrl = 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Flag_of_Bangladesh.svg';
            break;
        case 'ru':
            flagUrl = 'https://upload.wikimedia.org/wikipedia/en/f/f3/Flag_of_Russia.svg';
            break;
        case 'zh':
            flagUrl = 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Flag_of_the_People%27s_Republic_of_China.svg';
            break;
        case 'ja':
            flagUrl = 'https://upload.wikimedia.org/wikipedia/en/9/9e/Flag_of_Japan.svg';
            break;
        case 'fr':
            flagUrl = 'https://upload.wikimedia.org/wikipedia/en/c/c3/Flag_of_France.svg';
            break;
        case 'de':
            flagUrl = 'https://upload.wikimedia.org/wikipedia/en/b/ba/Flag_of_Germany.svg';
            break;
        default:
            flagUrl = '';
    }

    if (flagUrl) {
        flagElement.src = flagUrl;
        flagElement.alt = `${language} flag`;
    } else {
        flagElement.src = '';
        flagElement.alt = '';
    }
}

// Event listeners for language change to update flags
document.getElementById('inputLanguage').addEventListener('change', function () {
    fetchCountryFlags(this.value);
});
document.getElementById('outputLanguage').addEventListener('change', function () {
    fetchCountryFlags(this.value);
});
