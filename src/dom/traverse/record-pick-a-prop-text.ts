import { getProp, updateProp } from "../../util/database-operations";
import {
  traversePickAPropCharacter,
  traversePickAPropText,
  setTraversePickAPropText,
} from "./add-ui-to-h2-pick-a-prop";

export async function recordPickAPropText() {
  const fieldDiv = Array.from(document.querySelectorAll("div.field-name")).find(
    (div) => div.textContent?.trim() === "PROP"
  );
  if (fieldDiv && fieldDiv.parentElement) {
    const editableDiv = fieldDiv.parentElement.querySelector(
      'div[contenteditable="true"]'
    ) as HTMLDivElement;
    if (editableDiv) {
      const mapped = await getProp(traversePickAPropCharacter);
      if (!mapped && editableDiv.innerText) {
        await updateProp(traversePickAPropCharacter, editableDiv.innerText);
        return;
      }
      if (traversePickAPropText === editableDiv.innerText) return;
      if (traversePickAPropText) {
        await updateProp(traversePickAPropCharacter, editableDiv.innerText);
      } else {
        const p = editableDiv.querySelector("p");
        if (p && p.textContent !== mapped) {
          p.textContent = mapped;
        }
      }
      setTraversePickAPropText(editableDiv.innerText);
    }
  }
}
