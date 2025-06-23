import { PropUpdateMessage } from "../model/prop-update-message";

export async function sendMessageToServiceWorker(char: string, value: string) {
  // Send a message to the extension to update the UI or perform other actions
  await chrome.runtime.sendMessage({
    type: "propUpdate",
    char,
    value,
  } satisfies PropUpdateMessage);
}

export function initializeServiceWorkerCommunication() {
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
}

export function initializeContentScriptCommunication(
  callback: (request: PropUpdateMessage) => void
) {
  chrome.runtime.onMessage.addListener(function (
    request: PropUpdateMessage,
    sender,
    sendResponse: any
  ) {
    callback(request);

    return false;
  });
}
