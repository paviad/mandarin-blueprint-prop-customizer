import { loadDatabase, saveDatabase } from "./database";

export function getProps() {
  console.log("getProps called");
  const h6 = Array.from(document.querySelectorAll("h6")).find(
    (el) => el.textContent?.trim() === "Prop(s):"
  );

  console.log(h6);

  if (h6) {
    getProps2(h6);
  }
}

function getProps2(h6: HTMLHeadingElement) {
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
    const match = text.match(/[\u4e00-\u9fff]/);
    return match ? match[0] : "";
  });
  console.log(firstChineseChars);

  paragraphs.forEach((p, i) => {
    const char = firstChineseChars[i];
    if (!char) return;

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
  });
}
