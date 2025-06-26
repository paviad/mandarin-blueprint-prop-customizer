import {
  modifyDom,
  domUpdate,
  startMutationObserver,
  updateTraverseIfInPickAPropPage,
} from "./dom";
import { initializeContentScriptCommunication } from "./chrome/messages";
import { replaceMappingInUi } from "./dom/Prop";
import { disseminateSettings, settings$ } from "./util/settings-operations";
import { distinctUntilChanged, map } from "rxjs";
import { updateDefaultMappingVisibility } from './dom/mb/update-default-mapping-visibility';

window.addEventListener("load", async () => {
  domUpdate.subscribe((info) => {
    modifyDom(info);
  });

  startMutationObserver();

  settings$
    .pipe(
      map((settings) => !!settings.hideDefault),
      distinctUntilChanged()
    )
    .subscribe((hideDefault) => updateDefaultMappingVisibility(!!hideDefault));
});

initializeContentScriptCommunication((request) => {
  switch (request.type) {
    case "settingsUpdate":
      disseminateSettings();
      break;
    case "propUpdate":
      replaceMappingInUi(request.char, request.value);
      updateTraverseIfInPickAPropPage(request.char, request.value);
      break;
    default:
      request satisfies never; // Ensure all cases are handled
  }
});
