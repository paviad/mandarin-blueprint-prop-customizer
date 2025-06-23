import { exportDatabase } from "./util/database-operations";

document.addEventListener("DOMContentLoaded", () => {
  exportDatabase().then((db) => {
    if (!db) return;

    const props = db.propMap;

    const div = document.createElement("div");
    div.style.whiteSpace = "pre";
    div.textContent = Object.entries(props)
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    document.body.appendChild(div);
  });
});
