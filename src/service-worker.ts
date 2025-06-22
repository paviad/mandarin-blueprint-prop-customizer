// This is not used in the manifest, it's just a placeholder for the service worker should we need it in the future.

import { PropUpdateMessage } from "./prop-update-message";

console.log("MBC Extension: Service Worker Loaded");

chrome.runtime.onMessage.addListener(function (
  request: PropUpdateMessage,
  sender: chrome.runtime.MessageSender,
  sendResponse: any
) {
  const url = chrome.runtime.getManifest().content_scripts[0].matches;

  chrome.tabs.query({ url }, function (tabs) {
    tabs.forEach((tab) => {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, request);
      }
    });
  });
  return false;
});
