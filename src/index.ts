import { domUpdate, startMutationObserver } from "./dom/mutation-observer";
import { modifyDom } from "./dom/modify-dom";
import { initializeContentScriptCommunication } from "./chrome/messages";
import { replaceMappingInUi } from './dom/replace-mapping-in-ui';

window.addEventListener("load", async () => {
  domUpdate.subscribe((info) => {
    modifyDom(info);
  });

  startMutationObserver();
});

initializeContentScriptCommunication((request) =>
  replaceMappingInUi(request.char, request.value)
);
