import { Database, loadDatabase, saveDatabase } from "./database";

export function getProps() {
  addUiToPropsLines();
  addUiToH1PickAProp();
}

function addUiToPropsLines() {
  const h6 = Array.from(document.querySelectorAll("h6")).find(
    (el) => el.textContent?.trim() === "Prop(s):"
  );

  if (h6) {
    getPropLines(h6);
  }
}

function getPropLines(h6: HTMLHeadingElement) {
  const db = loadDatabase();
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
  console.log(result);

  const firstChineseChars = result.map((text) => {
    const match = text.match(/[\u4e00-\u9fff\u20000-\u2A6D6]/);
    return match ? match[0] : "";
  });
  console.log(firstChineseChars);

  paragraphs.forEach((p, i) => {
    const char = firstChineseChars[i];
    if (!char) return;

    addMappingUi(db, char, p);
  });
}

function addMappingUi(db: Database, char: string, p: HTMLElement) {
  const mapped = db.propMap[char] ?? "";
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

  editBtn.onclick = () => {
    const newVal = prompt(`Edit mapping for "${char}"`, mapped);
    if (newVal) {
      db.propMap[char] = newVal;
      saveDatabase(db);
      text.textContent = `Mapped: ${newVal}`;
    } else {
      delete db.propMap[char];
      saveDatabase(db);
      text.textContent = `(Not Mapped)`;
    }
  };

  block.appendChild(text);
  block.appendChild(editBtn);
  p.appendChild(block);
}

export function addUiToH1PickAProp() {
  const db = loadDatabase();

  const h1s = Array.from(document.querySelectorAll("h1"));
  for (const h1 of h1s) {
    const text = h1.textContent?.trim() || "";
    if (text.startsWith("Pick a Prop ") && /[\u4e00-\u9fff\u20000-\u2A6D6]$/.test(text)) {
      const lastChineseChar = text.match(/([\u4e00-\u9fff\u20000-\u2A6D6])$/)?.[1];
      addMappingUi(db, lastChineseChar!, h1);
    }
  }
  return null;
}
