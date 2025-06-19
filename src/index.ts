import { domUpdate, startMutationObserver } from "./mutation-observer";
import { getProps } from "./props";

window.addEventListener("load", async () => {
  domUpdate.subscribe(() => {
    getProps();
  });

  // await getProps();

  startMutationObserver();
});
