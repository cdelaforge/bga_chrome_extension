
chrome.runtime.onInstalled.addListener(details => {
  try {
    console.log(JSON.stringify(details), chrome.runtime.getManifest().version);
    const version = chrome.runtime.getManifest().version;
    if (details.reason === "update" && version !== details.previousVersion) {
      chrome.notifications.create('', {
        title: 'BGA extension has been updated',
        message: 'Don\'t forget that all the display features are settable by clicking on the icon of the extension.',
        type: 'basic',
        iconUrl: 'icon-128.png',
        requireInteraction: true
      });
    }
  } catch (e) {
    console.error("OnInstall Error", e);
  }
});




