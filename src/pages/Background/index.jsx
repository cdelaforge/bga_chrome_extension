chrome.runtime.onInstalled.addListener(details => {
  try {
    //const thisVersion = chrome.runtime.getManifest().version;
    if (details.reason === "update") {
      chrome.notifications.create('', {
        title: 'BGA extension has been updated',
        message: 'Don`\'t forget that all the display features are settable by clicking on the icon of the extension.',
        type: 'basic'
      });
    }
  } catch (e) {
    console.error("OnInstall Error", e);
  }
});

