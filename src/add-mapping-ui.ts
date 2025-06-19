import { getProp, updateProp } from './database';
import { suppressUpdates } from './mutation-observer';

export async function addMappingUi(char: string, p: HTMLElement) {
  const mapped = await getProp(char);

  // Remove any existing mapping block
  const existing = p.querySelector(".prop-map-block");
  if (existing) existing.remove();

  const block = document.createElement("span");
  block.className = "prop-map-block";
  block.style.marginLeft = "1em";

  const text = document.createElement("span");
  if (mapped) {
    text.textContent = `Mapped: ${mapped}`;
  } else {
    text.textContent = `Not Mapped`;
  }

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.style.marginLeft = "0.5em";

  editBtn.onclick = async () => {
    const newVal = prompt(`Edit mapping for "${char}"`, mapped);
    if (newVal) {
      await updateProp(char, newVal);
      text.textContent = `Mapped: ${newVal}`;
    } else {
      await updateProp(char, "");
      text.textContent = `(Not Mapped)`;
    }
  };

  suppressUpdates(true);
  block.appendChild(text);
  block.appendChild(editBtn);
  p.appendChild(block);
  suppressUpdates(false);
}
