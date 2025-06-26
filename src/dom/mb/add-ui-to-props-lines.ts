import { getPropLines } from './get-prop-lines';


export async function addUiToPropsLines(hideDefault: boolean) {
  const h6 = Array.from(document.querySelectorAll("h6")).find(
    (el) => el.textContent?.trim() === "Prop(s):"
  );

  if (h6) {
    getPropLines(h6, hideDefault);
  }
}
