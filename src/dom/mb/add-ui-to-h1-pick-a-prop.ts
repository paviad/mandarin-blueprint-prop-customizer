import { addMappingUi } from "../add-mapping-ui";

export let isMbPickAPropPage = false;
export let mbPickAPropCharacter = "";

export async function addUiToH1PickAProp() {
  const h1s = Array.from(document.querySelectorAll("h1"));
  for (const h1 of h1s) {
    const text = h1.textContent?.trim() || "";
    const lastChineseChar = text.match(
      /(?<= Prop )\s*([\u2e80-\u2eff\u31c0-\u31ef\u3400-\u4db5\u4e00-\u9fff\u{20000}-\u{2a6d6}])/u
    )?.[1];
    if (text.startsWith("Pick a Prop ") && lastChineseChar) {
      isMbPickAPropPage = true;
      mbPickAPropCharacter = lastChineseChar;
      addMappingUi(lastChineseChar, h1);
    }
  }
  return null;
}
