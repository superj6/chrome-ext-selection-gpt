function openPanel(text, tabId){
  chrome.sidePanel.setOptions({
    tabId: tabId,
    path: '/views/panel.html?' + new URLSearchParams({selectionText: text}),
    enabled: true,
  });
  chrome.sidePanel.open({tabId: tabId});
}

chrome.contextMenus.removeAll(() => {
  chrome.contextMenus.create({
     id: "selectionGpt",
     title: "Selection GPT",
     contexts:["selection"],  // ContextType
  });
})

chrome.contextMenus.onClicked.addListener((info, tab) => {
  switch(info.menuItemId){
    case 'selectionGpt':
      openPanel(info.selectionText, tab.id);
      break;
  }
});
