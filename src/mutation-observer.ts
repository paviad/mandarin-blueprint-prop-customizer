import {
  Subject,
  debounceTime,
  delay,
  distinctUntilChanged,
  of,
  switchMap,
} from "rxjs";
import { MutationInfo } from "./mutation-info";

const DELAY = 200;

const domUpdateSubject = new Subject<MutationInfo>();

export const domUpdate = domUpdateSubject.pipe(debounceTime(DELAY));

const suppressUpdatesSubject = new Subject<boolean>();
const suppressUpdates$ = suppressUpdatesSubject.pipe(
  distinctUntilChanged(),
  switchMap((suppress) => {
    if (suppress) {
      return of(true);
    } else {
      return of(false).pipe(delay(DELAY));
    }
  })
);

suppressUpdates$.subscribe((suppress) => {
  if (suppress) {
    stopMutationObserver();
  } else {
    startMutationObserver();
  }
});

const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    // Code to execute when DOM changes are detected
    const savedSpan = Array.from(document.querySelectorAll("span")).find(
      (el) => el.textContent?.trim().toLowerCase() === "saved"
    );
    const hasSavedSpan = !!savedSpan;
    domUpdateSubject.next({ propSaved: hasSavedSpan });
  }
});

export function suppressUpdates(suppress: boolean) {
  suppressUpdatesSubject.next(suppress);
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
