import { PropUpdateMessage } from "../model/prop-update-message";
import { SettingsUpdateMessage } from "../model/settings-update-message";

export async function sendPropUpdateMessageToServiceWorker(
  char: string,
  value: string
) {
  // Send a message to the extension to update the UI or perform other actions
  await chrome.runtime.sendMessage({
    type: "propUpdate",
    char,
    value,
  } satisfies PropUpdateMessage);
}

export async function sendSettingsUpdateMessageToServiceWorker() {
  // Send a message to the extension to update the UI or perform other actions
  await chrome.runtime.sendMessage({
    type: "settingsUpdate",
  } satisfies SettingsUpdateMessage);
}

export type UpdateMessage = PropUpdateMessage | SettingsUpdateMessage;

export function initializeServiceWorkerCommunication() {
  chrome.runtime.onMessage.addListener(function (
    request: UpdateMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse
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
  callback: (request: UpdateMessage) => void
) {
  chrome.runtime.onMessage.addListener(function (
    request: UpdateMessage,
    sender,
    sendResponse
  ) {
    callback(request);

    return false;
  });
}
