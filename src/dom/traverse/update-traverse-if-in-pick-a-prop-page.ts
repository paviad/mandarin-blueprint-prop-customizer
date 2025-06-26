import {
  isTraversePickAPropPage,
  traversePickAPropCharacter,
} from "./add-ui-to-h2-pick-a-prop";

export function updateTraverseIfInPickAPropPage(char: string, mapped: string) {
  if (isTraversePickAPropPage && traversePickAPropCharacter === char) {
    const fieldDiv = Array.from(
      document.querySelectorAll("div.field-name")
    ).find((div) => div.textContent?.trim() === "PROP");
    if (fieldDiv && fieldDiv.parentElement) {
      const editableDiv = fieldDiv.parentElement.querySelector(
        'div[contenteditable="true"]'
      ) as HTMLDivElement;
      if (editableDiv) {
        const p = editableDiv.querySelector("p");
        if (p && p.textContent !== mapped) {
          p.textContent = mapped;
        }
      }
    }
  }
}
