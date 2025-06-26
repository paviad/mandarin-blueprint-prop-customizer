import { addMappingUi } from "../add-mapping-ui";
import { recordPickAPropText } from './record-pick-a-prop-text';

export let isTraversePickAPropPage = false;
export let traversePickAPropCharacter = "";
export let traversePickAPropH2: HTMLHeadingElement | null = null;
export let traversePickAPropText = "";

export function setTraversePickAPropText(text: string) {
  traversePickAPropText = text;
}

export async function addUiToH2PickAProp() {
  const h2s = Array.from(document.querySelectorAll("h2"));
  isTraversePickAPropPage = false;
  for (const h2 of h2s) {
    traversePickAPropH2 = h2 as HTMLHeadingElement;

    const text = h2.textContent?.trim() || "";
    if (
      text.startsWith("Pick a prop for ") &&
      /[\u2e80-\u2eff\u31c0-\u31ef\u3400-\u4db5\u4e00-\u9fff\u{20000}-\u{2a6d6}]/u.test(
        text
      )
    ) {
      const lastChineseChar = text.match(
        /(?<=for )\s*([\u2e80-\u2eff\u31c0-\u31ef\u3400-\u4db5\u4e00-\u9fff\u{20000}-\u{2a6d6}])/u
      )?.[1];
      if (lastChineseChar) {
        isTraversePickAPropPage = true;
        if (traversePickAPropCharacter !== lastChineseChar) {
          traversePickAPropText = "";
        }
        traversePickAPropCharacter = lastChineseChar;
        await recordPickAPropText();
        addMappingUi(lastChineseChar, h2);
      }
    }
  }

  if (!isTraversePickAPropPage) {
    traversePickAPropText = "";
  }
  return null;
}
