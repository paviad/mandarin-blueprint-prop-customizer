import { Subject, debounceTime } from "rxjs";

const domUpdateSubject = new Subject<void>();
const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList" || mutation.type === "attributes") {
      // Code to execute when DOM changes are detected
      domUpdateSubject.next();
    }
  }
});

const DELAY = 200;

export const domUpdate = domUpdateSubject.pipe(debounceTime(DELAY));

export function suppressUpdates(suppress: boolean) {
  if (suppress) {
    stopMutationObserver();
  } else {
    setTimeout(() => startMutationObserver(), DELAY);
  }
}

export function stopMutationObserver() {
  // Stop observing the body
  observer.disconnect();
}

export function startMutationObserver() {
  // Start observing the body for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
  });
}
