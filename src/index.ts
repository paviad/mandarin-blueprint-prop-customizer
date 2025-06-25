import { modifyDom, domUpdate, startMutationObserver } from "./dom";
import { initializeContentScriptCommunication } from "./chrome/messages";
import { replaceMappingInUi } from './dom/Prop';

window.addEventListener("load", async () => {
  domUpdate.subscribe((info) => {
    modifyDom(info);
  });

  startMutationObserver();
});

initializeContentScriptCommunication((request) =>
  replaceMappingInUi(request.char, request.value)
);
