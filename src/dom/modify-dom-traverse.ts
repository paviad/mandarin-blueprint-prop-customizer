import { addMappingUi } from "./add-mapping-ui";
import { getProp, updateProp } from "../util/database-operations";

let isTraversePickAPropPage = false;
let traversePickAPropCharacter = "";
let traversePickAPropText = "";
let traversePickAPropH2: HTMLHeadingElement | null = null;

export async function addUiToMovieReviewProps() {
  const spans = Array.from(document.querySelectorAll("span"));

  const propSpans = spans
    .map((span) => {
      const a = span.querySelector("a");
      if (!a || a.parentElement !== span) return [null, ""] as const;
      const textContent = a.textContent?.trim() || "";

      const match = textContent.match(
        /^([\u2e80-\u2eff\u31c0-\u31ef\u3400-\u4db5\u4e00-\u9fff\u{20000}-\u{2a6d6}]).*?PROP/u
      );

      if (!match) return [null, ""] as const;

      const r = [span, match?.[1] || ""] as const;
      return r;
    })
    .filter(([span]) => Boolean(span)) as [HTMLSpanElement, string][];

  for (const [span, chineseChar] of propSpans) {
    addMappingUi(chineseChar, span);
  }
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
  return null;
}

async function recordPickAPropText() {
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
      }
      traversePickAPropText = editableDiv.innerText;
    }
  }
}
