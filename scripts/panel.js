const inputApi = document.getElementById('input-api');
const buttonApi = document.getElementById('button-api');

const spanSelection = document.getElementById('span-selection');

const buttonSummary = document.getElementById('button-summary');
const buttonQuiz = document.getElementById('button-quiz');

let storage = {
  apiKey: null,
  selectionText: null
};

function getStorage(){
  return chrome.storage.local.get(storage);
}

function displayApi(key){
  inputApi.placeholder = key;
}

function updateApi(key){
  storage.apiKey = key
  chrome.storage.local.set({apiKey: key});
  displayApi(key);
}

function displaySelection(text){
  spanSelection.textContent = text;
}

async function init(){
  storage = await getStorage();
  displayApi(storage.apiKey);
  displaySelection(storage.selectionText);
}

init();

buttonApi.addEventListener('click', () => {
  if(inputApi.value){
    updateApi(inputApi.value);
    inputApi.value = '';
  }
});
