// based on https://github.com/mdn/webextensions-examples/tree/master/context-menu-copy-link-with-types

var globalUrl = { text: "", html: "" };

chrome.contextMenus.create({
    id: "extract-sub-link-to-clipboard",
    title: "Unwrap URL",
    contexts: ["link"],
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        sendResponse({ response: request.greeting, globalUrl: globalUrl });
    }
);

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "extract-sub-link-to-clipboard") {
        const pattern = /(\?|\&)url=(.+)$/g;
        const arr = pattern.exec(info.linkUrl);
        const safeUrl = decodeURIComponent((arr && arr.length > 2) ? arr[2] : info.linkUrl);
        globalUrl.text = safeUrl;
        globalUrl.html = `<a href="${safeUrl}">${safeUrl}</a>`;
        chrome.tabs.executeScript(tab.id, {
            file: 'clipboard-helper.js',
        });
    }
});
