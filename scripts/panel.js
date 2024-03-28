const inputApi = document.getElementById('input-api');
const buttonApi = document.getElementById('button-api');

const spanSelection = document.getElementById('span-selection');

const buttonSummary = document.getElementById('button-summary');
const buttonQuiz = document.getElementById('button-quiz');
const gptOutput = document.getElementById('gpt-output');

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

function gptQuery(text){
  return "test summary";
}

function displayQuery(displayHtml){
  gptOutput.replaceChildren(displayHtml);
}

async function processSummary(text){
  const summary = await gptQuery(text);
  
  
  const h3 = document.createElement('h3');
  h3.textContent = 'Summary Result:';
  const p = document.createElement('p');
  p.textContent = summary;

  const div = document.createElement('div');
  div.replaceChildren(h3, p);

  displayQuery(div);
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

buttonSummary.addEventListener('click', () => {
  processSummary(storage.selectionText);
});
