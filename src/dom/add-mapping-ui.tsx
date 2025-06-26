import { createRoot } from "react-dom/client";
import { getProp } from "../util/database-operations";
import { Prop } from "./Prop";
import * as React from "react";

export async function addMappingUi(char: string, p: HTMLElement) {
  const mapped = await getProp(char);

  const existing = p.querySelector(".prop-map-block");
  if (existing) return false;

  const block = document.createElement("span");
  block.className = "prop-map-block";

  p.appendChild(block);

  const root = createRoot(block);
  root.render(<Prop char={char} mapped={mapped} />);

  return true;
}
