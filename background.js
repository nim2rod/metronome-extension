let popupWindowId;
console.log('background page - metronome!')

chrome.action.onClicked.addListener((tab) => {
    console.log('tab: ', tab)
    console.log('add event (: ) ')
    if (!popupWindowId) {
        chrome.windows.create({
            url: chrome.runtime.getURL("popup.html"),
            type: "popup",
            width: 320,
            height: 400,
            left: 900,
        }, (window) => {
            popupWindowId = window.id;
        });
    } else {
        chrome.windows.update(popupWindowId, { focused: true });
    }
});

chrome.windows.onRemoved.addListener((windowId) => {
    if (windowId === popupWindowId) {
        popupWindowId = null;
    }
});

