function saveSelection(selectionText){
  chrome.storage.local.set({selectionText: selectionText});
}

function openPanel(tabId){
  chrome.sidePanel.setOptions({
    tabId: tabId,
    path: '/views/panel.html',
    enabled: true,
  });
  chrome.sidePanel.open({tabId: tabId});
}

function initPanel(selectionText, tabId){
  saveSelection(selectionText);
  openPanel(tabId);
}

chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
     id: "selectoinGpt",
     title: "GPT Quiz Me!",
     contexts:["selection"],  // ContextType
  });
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch(info.menuItemId){
    case 'selectoinGpt':
      initPanel(info.selectionText, tab.id);
      break;
  }
});
