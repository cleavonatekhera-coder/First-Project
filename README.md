# First-Project
Wordly Dictionary

A simple web app to look up English words and save your favorites.

Features
Search a word to see its pronunciation, meaning, example, and synonyms
Save favorite words (kept in your browser)
Switch between light and dark themes
Files
index.html – the page
style.css – the styling
script.js – the search, favorites, and theme logic
How to Run

Open index.html in your browser. You need an internet connection to look up words.

How to Use
Type a word and click Search.
Click Save Favorite to add it to your list.
Click Change Theme to toggle dark mode.
Note

Word data comes from the free Dictionary API. In script.js, the fetch URL is fixed to the word hello. Replace hello with ${encodeURIComponent(word)} (inside backticks) so it searches the word you type.
