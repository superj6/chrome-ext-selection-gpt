function openPanel(text, tabId){
  let url = '/views/panel.html?' + new URLSearchParams({selectionText: text});
  try{
    chrome.sidePanel.setOptions({
      tabId: tabId,
      path: url,
      enabled: true,
    });
    chrome.sidePanel.open({tabId: tabId});
  }catch{
    try{
      browser.sidebarAction.setPanel({
	tabId: tabId,
	panel: url
      });
    }catch{
      chrome.windows.create({url: url});
    }
  }
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
      try{
        browser.sidebarAction.open();
      }catch{

      }
      break;
  }
});
