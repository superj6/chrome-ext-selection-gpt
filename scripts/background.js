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
      chrome.tabs.query({active: true}, ([activeTab]) => {
	let tabId = tab.id != -1 ? tab.id : activeTab.id;
        openPanel(info.selectionText, tabId);
      });
      break;
  }
});
