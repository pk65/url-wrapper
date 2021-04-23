// based on https://github.com/mdn/webextensions-examples/tree/master/context-menu-copy-link-with-types

browser.contextMenus.create({
    id: "extract-sub-link-to-clipboard",
    title: "Unwrap URL",
    contexts: ["link"],
});
browser.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "extract-sub-link-to-clipboard") {
        const pattern = /(\?|\&)url=(.+)$/g;
        const arr = pattern.exec(info.linkUrl);
        const safeUrl = decodeURIComponent((arr && arr.length > 2) ? arr[2] : info.linkUrl);
        const text = safeUrl;
        const html = `<a href="${safeUrl}">${safeUrl}</a>`;

        // The example will show how data can be copied, but since background
        // pages cannot directly write to the clipboard, we will run a content
        // script that copies the actual content.

        // clipboard-helper.js defines function copyToClipboard.
        const code = "copyToClipboard(" +
            JSON.stringify(text) + "," +
            JSON.stringify(html) + ");";

        browser.tabs.executeScript({
            code: "typeof copyToClipboard === 'function';",
        }).then((results) => {
            // The content script's last expression will be true if the function
            // has been defined. If this is not the case, then we need to run
            // clipboard-helper.js to define function copyToClipboard.
            if (!results || results[0] !== true) {
                return browser.tabs.executeScript(tab.id, {
                    file: "clipboard-helper.js",
                });
            }
        }).then(() => {
            return browser.tabs.executeScript(tab.id, {
                code,
            });
        }).catch((error) => {
            // This could happen if the extension is not allowed to run code in
            // the page, for example if the tab is a privileged page.
            console.error("Failed to copy text: " + error);
        });
    }
});
