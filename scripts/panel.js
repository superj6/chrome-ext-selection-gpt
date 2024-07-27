const inputApi = document.getElementById('input-api');
const buttonApi = document.getElementById('button-api');

const spanSelection = document.getElementById('span-selection');

const buttonSummary = document.getElementById('button-summary');
const buttonQuiz = document.getElementById('button-quiz');
const inputCustom = document.getElementById('input-custom');
const buttonCustom = document.getElementById('button-custom');

const gptOutput = document.getElementById('gpt-output');
const outputLoading = document.getElementById('output-loading');
const outputPlain = document.getElementById('output-plain');
const outputMultiChoice = document.getElementById('output-multi-choice');

let selectionText;
let storage = {
  apiKey: null
};

function getSelectionText(){
  let url = new URL(document.location.toString());
  return url.searchParams.get('selectionText');
}

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
      temperature: 1
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

function displayLoading(){
  clearOutput();

  outputLoading.classList.remove('hidden');
}

function displayPlain(title, text){
  clearOutput();

  outputPlain.getElementsByTagName('h3')[0].textContent = title;
  outputPlain.getElementsByTagName('p')[0].textContent = text;

  outputPlain.classList.remove('hidden');
}

function displayMultiChoice(title, quiz){
  clearOutput();

  outputMultiChoice.getElementsByTagName('h3')[0].textContent = title;
  outputMultiChoice.getElementsByTagName('p')[0].textContent = quiz['question'];
  
  ul = outputMultiChoice.getElementsByTagName('ul')[0];
  ul.innerHTML = '';
  for(const [key, value] of Object.entries(quiz['choices'])){
    const input = document.createElement('input');
    input.name="multi-choice"
    input.type="radio";
    input.value = key;
    const label = document.createElement('label');
    label.textContent = `${key}. ${value}`;

    const li = document.createElement('li');
    li.replaceChildren(input, label);

    ul.appendChild(li);
  }

  output = outputMultiChoice.getElementsByTagName('output')[0];
  output.textContent = '';

  outputMultiChoice.getElementsByTagName('button')[0].onclick = () => {
    selected = document.querySelector('input[name="multi-choice"]:checked');
    if(selected){
      if(selected.value === quiz['correct']){
        output.textContent = `${selected.value} is correct!`;
      }else{
        output.textContent = `${selected.value} is incorrect, try again.`
      }
    }
  };

  outputMultiChoice.classList.remove('hidden');
}

function processSummary(text){
  displayLoading();

  gptQuery('Give an easy to read summary, highlighting the most important aspects and themes.', text)
  .then((summary) => {
    displayPlain('Summary Result', summary);
  });
}

function processQuiz(text){
  displayLoading();

  gptQuery('Give a unique multiple choice question that tests deep understanding and is not a direct quote. Only return the question in json format with no explanation, having parameters {"question": "", "choices": {"A": "", "B": "", "C": "", "D": ""}, "correct": ""}', text)
  .then((quiz) => JSON.parse(quiz))
  .then((quiz) => {
    displayMultiChoice('Review Quiz', quiz);
  });
}

function processCustom(query, text){
  displayLoading();
  
  gptQuery(query, text)
  .then((result) => {
    displayPlain('Query Result', result);
  });
}

function init(){
  selectionText = getSelectionText();
  displaySelection(selectionText);

  getStorage().then((s) => {
    storage = s;
    displayApi(storage.apiKey);
  });
}

init();

buttonApi.addEventListener('click', () => {
  if(inputApi.value){
    updateApi(inputApi.value);
    inputApi.value = '';
  }
});

buttonSummary.addEventListener('click', () => {
  processSummary(selectionText);
});

buttonQuiz.addEventListener('click', () => {
  processQuiz(selectionText);
});

buttonCustom.addEventListener('click', () => {
  if(inputCustom.value){
    processCustom(inputCustom.value, selectionText);
  }
});
