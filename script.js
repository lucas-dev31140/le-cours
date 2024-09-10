// Script pour gérer le dictionnaire avec localStorage et la modification des mots
const wordInput = document.getElementById('wordInput');
const translationInput = document.getElementById('translationInput');
const addWordButton = document.getElementById('addWordButton');
const wordList = document.getElementById('wordList');
const frenchTextInput = document.getElementById('frenchTextInput');
const translateButton = document.getElementById('translateButton');
const translationModal = document.getElementById('translationModal');
const closeModal = document.getElementById('closeModal');
const translatedText = document.getElementById('translatedText');

let dictionary = JSON.parse(localStorage.getItem('dictionary')) || {};
let editingWord = null;

// Charger les mots depuis localStorage
function loadWords() {
    wordList.innerHTML = '';
    for (const word in dictionary) {
        addWordToList(word, dictionary[word]);
    }
}

// Ajouter un mot à la liste
function addWordToList(word, translation) {
    const li = document.createElement('li');
    li.textContent = `${word} - ${translation}`;
    
    // Bouton pour modifier un mot
    const editButton = document.createElement('button');
    editButton.textContent = 'Modifier';
    editButton.classList.add('edit-button');
    editButton.addEventListener('click', () => editWord(word));

    // Bouton pour supprimer un mot
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Supprimer';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => deleteWord(word));

    li.appendChild(editButton);
    li.appendChild(deleteButton);
    wordList.appendChild(li);
}

// Ajouter ou modifier un mot dans le dictionnaire
addWordButton.addEventListener('click', () => {
    const word = wordInput.value.trim();
    const translation = translationInput.value.trim();
    
    if (word && translation) {
        if (editingWord) {
            delete dictionary[editingWord];
            editingWord = null;
        }
        dictionary[word] = translation;
        localStorage.setItem('dictionary', JSON.stringify(dictionary));
        wordInput.value = '';
        translationInput.value = '';
        loadWords();
    }
});

// Charger la liste des mots au démarrage
loadWords();

// Modifier un mot existant
function editWord(word) {
    wordInput.value = word;
    translationInput.value = dictionary[word];
    editingWord = word;
}

// Supprimer un mot du dictionnaire
function deleteWord(word) {
    delete dictionary[word];
    localStorage.setItem('dictionary', JSON.stringify(dictionary));
    loadWords();
}

// Traduire le texte en français en respectant les règles de ponctuation
translateButton.addEventListener('click', () => {
    let text = frenchTextInput.value.trim();
    if (text) {
        let translated = text;

        // Remplacement des mots en fonction du dictionnaire
        for (const word in dictionary) {
            const regex = new RegExp(`\\b${dictionary[word]}\\b`, 'gi');
            translated = translated.replace(regex, word);
        }

        // Ajouter la ponctuation spécifique en fonction du type de phrase
        translated = translated.replace(/([.!?])\s*(\w+)/g, function(match, punctuation, firstWord) {
            // Si la phrase est exclamative
            if (punctuation === '!') {
                return `!${firstWord.charAt(0).toUpperCase() + firstWord.slice(1)}!`;
            }
            // Si la phrase est interrogative
            if (punctuation === '?') {
                return `?${firstWord.charAt(0).toUpperCase() + firstWord.slice(1)}?`;
            }
            // Si la phrase est déclarative ou autre
            return `${punctuation} ${firstWord.charAt(0).toUpperCase() + firstWord.slice(1)}`;
        });

        // Traitement de la première lettre si le texte commence sans ponctuation
        translated = translated.charAt(0).toUpperCase() + translated.slice(1);

        // Afficher la traduction dans la modale
        translatedText.textContent = translated;
        translationModal.style.display = 'block';
    }
});

// Fermer la modale de traduction
closeModal.addEventListener('click', () => {
    translationModal.style.display = 'none';
});

// Fermer la modale si l'utilisateur clique en dehors
window.onclick = function(event) {
    if (event.target === translationModal) {
        translationModal.style.display = 'none';
    }
}
