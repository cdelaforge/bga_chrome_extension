
chrome.runtime.onInstalled.addListener(details => {
  try {
    //console.log(JSON.stringify(details), chrome.runtime.getManifest().version);
    const version = chrome.runtime.getManifest().version;
    if (details.reason === "update" && version !== details.previousVersion) {
      chrome.notifications.create('', {
        title: chrome.i18n.getMessage("notifUpdateTitle"),
        message: chrome.i18n.getMessage("notifUpdate_1_1_5"),
        contextMessage: chrome.i18n.getMessage("notifUpdateSub_1_1_5"),
        type: 'basic',
        iconUrl: 'icon-128.png',
        requireInteraction: true
      });
    }
  } catch (e) {
    console.error("OnInstall Error", e);
  }
});