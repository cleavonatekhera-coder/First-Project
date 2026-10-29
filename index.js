
const form = document.getElementById("search-form");
const input = document.getElementById("word-input");
const status = document.getElementById("status");
const results = document.getElementById("results");

const wordElement = document.getElementById("word");
const phoneticElement = document.getElementById("phonetic");
const definitionsElement = document.getElementById("definitions");
const synonymsElement = document.getElementById("synonyms");
const audioButton = document.getElementById("audio-button");

let audio = null;

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const word = input.value.trim();

  if (!word) {
    showStatus("Please enter a word.");
    return;
  }

  if (!/^[a-zA-Z]+(?:['-][a-zA-Z]+)*$/.test(word)) {
    showStatus("Please enter a valid English word.");
    return;
  }

  status.textContent = "Searching...";
  results.hidden = true;

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("Word not found. Please check the spelling.");
      }

      throw new Error("Unable to retrieve data. Please try again.");
    }

    const data = await response.json();

    displayWord(data[0]);
    status.textContent = "";
    results.hidden = false;
  } catch (error) {
    showStatus(error.message || "A network error occurred.");
  }
});

function displayWord(data) {
  wordElement.textContent = data.word || "Unknown word";
  phoneticElement.textContent =
    data.phonetic || getPhonetic(data) || "Pronunciation unavailable.";

  definitionsElement.replaceChildren();
  synonymsElement.replaceChildren();

  // Find audio pronunciation.
  const audioUrl = getAudio(data);

  audioButton.hidden = !audioUrl;
  audioButton.textContent = "🔊 Play pronunciation";

  audio = audioUrl ? new Audio(audioUrl) : null;

  // Display definitions and synonyms.
  const meanings = data.meanings || [];
  const allSynonyms = new Set();

  meanings.forEach(function (meaning) {
    const heading = document.createElement("h4");
    heading.textContent = meaning.partOfSpeech || "Meaning";
    definitionsElement.appendChild(heading);

    (meaning.definitions || []).forEach(function (item) {
      const definition = document.createElement("div");
      definition.className = "definition";

      const text = document.createElement("p");
      text.textContent = item.definition || "Definition unavailable.";
      definition.appendChild(text);

      if (item.example) {
        const example = document.createElement("p");
        example.className = "example";
        example.textContent = `Example: "${item.example}"`;
        definition.appendChild(example);
      }

      definitionsElement.appendChild(definition);

      (item.synonyms || []).forEach(function (synonym) {
        allSynonyms.add(synonym);
      });
    });

    (meaning.synonyms || []).forEach(function (synonym) {
      allSynonyms.add(synonym);
    });
  });

  if (meanings.length === 0) {
    definitionsElement.textContent = "No definitions available.";
  }

  if (allSynonyms.size > 0) {
    allSynonyms.forEach(function (synonym) {
      const tag = document.createElement("span");
      tag.className = "synonym";
      tag.textContent = synonym;
      synonymsElement.appendChild(tag);
    });
  } else {
    synonymsElement.textContent = "No synonyms available.";
  }
}

function getPhonetic(data) {
  const phonetics = data.phonetics || [];
  const item = phonetics.find((p) => p.text);
  return item ? item.text : "";
}

function getAudio(data) {
  const phonetics = data.phonetics || [];
  const item = phonetics.find(
    (p) => p.audio && /^https?:\/\//i.test(p.audio)
  );

  return item ? item.audio : "";
}

audioButton.addEventListener("click", async function () {
  if (!audio) return;

  try {
    await audio.play();
    audioButton.textContent = "♫ Playing...";
  } catch {
    showStatus("Unable to play audio. Please try again.");
  }
});

audioButton.addEventListener("click", function () {
  if (!audio) return;

  audio.onended = function () {
    audioButton.textContent = "🔊 Play pronunciation";
  };
});

function showStatus(message) {
  status.textContent = message;
  results.hidden = true;
}
