const inputApi = document.getElementById('input-api');
const buttonApi = document.getElementById('button-api');

const spanSelection = document.getElementById('span-selection');

const buttonSummary = document.getElementById('button-summary');
const buttonQuiz = document.getElementById('button-quiz');
const gptOutput = document.getElementById('gpt-output');
const outputPlain = document.getElementById('output-plain');
const outputMultiChoice = document.getElementById('output-multi-choice');

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

function gptQuery(query, text){
  return fetch("https://api.openai.com/v1/chat/completions", {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${storage.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
	content: `Respond to triple quoted query """${query}""" in regards to the following triple quoted text: """${text}"""`
      }],
      temperature: 0.8
    }) 
  })
  .then((response) => response.json())
  .then((response) => {
    console.log(response);
    return response['choices'][0]['message']['content'];
  })
  .catch((e) => {
    console.log(e);
  });
}

function clearOutput(){
  for(const child of gptOutput.children){
    child.classList.add('hidden');
  }
}

function displayPlain(title, text){
  outputPlain.getElementsByTagName('h3')[0].textContent = title;
  outputPlain.getElementsByTagName('p')[0].textContent = text;

  outputPlain.classList.remove('hidden');
}

function displayMultiChoice(title, quiz){
  outputMultiChoice.getElementsByTagName('h3')[0].textContent = title;
  outputMultiChoice.getElementsByTagName('p')[0].textContent = quiz['question'];
  
  ul = outputMultiChoice.getElementsByTagName('ul')[0];
  ul.innerHTML = '';
  for(const [key, value] of Object.entries(quiz['choices'])){
    const input = document.createElement('input');
    input.type="radio";
    const label = document.createElement('label');
    label.textContent = key;
    const p = document.createElement('p');
    p.textContent = value;

    const li = document.createElement('li');
    li.replaceChildren(input, label, p);

    ul.appendChild(li);
  }

  outputMultiChoice.classList.remove('hidden');
}

async function processSummary(text){
  const summary = await gptQuery('Give an easy to read summary, highlighting the most important aspects and themes.', text);

  displayPlain('Summary Result', summary);
}

async function processQuiz(text){
  clearOutput();

  const quizRaw = await gptQuery('Give a unique multiple choice question that tests understanding and is not a direct quote. Only return the question in json format with no explanation, having parameters {"question": "", "choices": {"A": "", "B": "", "C": "", "D": ""}, "correct": ""}', text);
  const quiz = JSON.parse(quizRaw);

  displayMultiChoice('Review Quiz', quiz);
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

buttonQuiz.addEventListener('click', () => {
  processQuiz(storage.selectionText);
});
