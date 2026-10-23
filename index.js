const form = document.getElementById("searchForm");
const input = document.getElementById("word");
const result = document.getElementById("result");
const message = document.getElementById("message");
const favorites = document.getElementById("favorites");

let savedWords = JSON.parse(localStorage.getItem("favorites") || "[]");

// Search for a word
form.addEventListener("submit", async function(event) {
  event.preventDefault();

  const word = input.value.trim();

  if (word === "") {
    message.textContent = "Please enter a word.";
    return;
  }

  message.textContent = "Searching...";

  try {
    const response = await fetch(
      "https://api.dictionaryapi.dev/api/v2/entries/en/hello" 
    );

    if (!response.ok) {
      throw new Error("Word not found");
    }

    const data = await response.json();
    const entry = data[0];
    const meaning = entry.meanings[0];
    const definition = meaning.definitions[0];

    result.innerHTML = `
      <h2>${entry.word}</h2>
      <p>Pronunciation: ${entry.phonetic || "Not available"}</p>
      <p>Meaning: ${definition.definition}</p>
      <p>Part of speech: ${meaning.partOfSpeech}</p>
      <p>Example: ${definition.example || "No example available"}</p>
      <p>Synonyms: ${meaning.synonyms?.join(", ") || "None available"}</p>
      <button id="save">Save Favorite</button>
    `;

    message.textContent = "";

    // Save the word
    document.getElementById("save").onclick = function() {
      if (!savedWords.includes(entry.word)) {
        savedWords.push(entry.word);
        localStorage.setItem("favorites", JSON.stringify(savedWords));
        showFavorites();
      }
    };

  } catch {
    result.innerHTML = "";
    message.textContent = "Word not found. Try another word.";
  }
});

// Display favorite words
function showFavorites() {
  favorites.innerHTML = "";

  savedWords.forEach(function(word) {
    favorites.innerHTML += `<li>${word}</li>`;
  });
}

// Change the theme
document.getElementById("theme").onclick = function() {
  document.body.classList.toggle("dark");
};

showFavorites();
