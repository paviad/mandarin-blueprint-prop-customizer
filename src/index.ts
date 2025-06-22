import { replaceMappingInUi } from "./add-mapping-ui";
import { domUpdate, startMutationObserver } from "./mutation-observer";
import { PropUpdateMessage } from "./prop-update-message";
import { getProps } from "./props";

window.addEventListener("load", async () => {
  domUpdate.subscribe((info) => {
    getProps(info);
  });

  startMutationObserver();
});

chrome.runtime.onMessage.addListener(function (
  request: PropUpdateMessage,
  sender,
  sendResponse: any
) {
  replaceMappingInUi(request.char, request.value);

  return false;
});
