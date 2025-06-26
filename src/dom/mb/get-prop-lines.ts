import { addMappingUi } from '../add-mapping-ui';

export async function getPropLines(h6: HTMLHeadingElement, hideDefault: boolean) {
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
    const match = text.match(
      /[\u2e80-\u2eff\u31c0-\u31ef\u3400-\u4db5\u4e00-\u9fff\u{20000}-\u{2a6d6}]/u
    );
    return match ? match[0] : "";
  });

  paragraphs.forEach(async (p, i) => {
    const char = firstChineseChars[i];
    if (!char) return;

    if (!(await addMappingUi(char, p))) return;

    console.log("Added mapping UI for character:", char);

    const span = p.querySelector("span");
    if (span) {
      const defaultText = span.innerText;
      span.setAttribute("data-mbc-default", defaultText);
      span.setAttribute("data-mbc-char", char);
      if (hideDefault) {
        span.title = `Default: ${defaultText}`;
        span.innerText = char;
      }
    }
  });
}
