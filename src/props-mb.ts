import { addMappingUi } from "./add-mapping-ui";

let isMbPickAPropPage = false;
let mbPickAPropCharacter = "";

export function addUiToPropsLines() {
  const h6 = Array.from(document.querySelectorAll("h6")).find(
    (el) => el.textContent?.trim() === "Prop(s):"
  );

  if (h6) {
    getPropLines(h6);
  }
}

export async function getPropLines(h6: HTMLHeadingElement) {
  const result: string[] = [];
  let el = h6.nextElementSibling;
  const paragraphs: HTMLParagraphElement[] = [];
  while (el && !(el.tagName === "H6" || el.tagName === "DIV")) {
    if (el.tagName === "P") {
      result.push(el.textContent?.trim() || "");
      paragraphs.push(el as HTMLParagraphElement);
    }
    el = el.nextElementSibling;
  }

  const firstChineseChars = result.map((text) => {
    const match = text.match(/[\u31c0-\u31ef\u3400-\u4db5\u4e00-\u9fff\u20000-\u2A6D6]/);
    return match ? match[0] : "";
  });

  paragraphs.forEach((p, i) => {
    const char = firstChineseChars[i];
    if (!char) return;

    addMappingUi(char, p);
  });
}
export async function addUiToH1PickAProp() {
  const h1s = Array.from(document.querySelectorAll("h1"));
  for (const h1 of h1s) {
    const text = h1.textContent?.trim() || "";
    if (
      text.startsWith("Pick a Prop ") &&
      /[\u31c0-\u31ef\u3400-\u4db5\u4e00-\u9fff\u20000-\u2A6D6]$/.test(text)
    ) {
      const lastChineseChar = text.match(
        /(?<= Prop )\s*([\u31c0-\u31ef\u3400-\u4db5\u4e00-\u9fff\u20000-\u2A6D6])/
      )?.[1]!;
      isMbPickAPropPage = true;
      mbPickAPropCharacter = lastChineseChar;
      addMappingUi(lastChineseChar!, h1);
    }
  }
  return null;
}
