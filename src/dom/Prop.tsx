/* eslint-disable @typescript-eslint/no-dynamic-delete */
import * as React from "react";
import { getProp, updateProp } from "../util/database-operations";
import Chip from "@mui/material/Chip";
import Avatar from '@mui/material/Avatar';

export interface PropProps {
  char: string;
  mapped: string;
}

export function Prop(props: PropProps) {
  const [mapped, setMapped] = React.useState(props.mapped);

  async function updateMapping(props: PropProps) {
    const mapped = await getProp(props.char);
    const newVal = prompt(`Edit mapping for "${props.char}"`, mapped);
    if (newVal) {
      await updateProp(props.char, newVal);
      setMapped(newVal);
    } else if (newVal !== null) {
      await updateProp(props.char, "");
      setMapped("");
    }
  }

  React.useEffect(() => {
    const id = registerForUpdates(props.char, setMapped);
    return () => {
      unregisterForUpdates(id);
    };
  });

  const isDarkMode =
    typeof document !== "undefined" &&
    document.documentElement.classList.contains("dark");

  const sxStyle = isDarkMode
    ? {
        color: "white",
        backgroundColor: "#333",
      }
    : {};

  const avatarUrl = chrome.runtime.getURL("/icon32.png");

  return (
    <Chip
      sx={sxStyle}
      avatar={<Avatar alt="" src={avatarUrl} />}
      label={mapped ? `${mapped}` : `Not Mapped`}
      onClick={() => updateMapping(props)}
    />
  );
}

const updateRegistryMap: Record<string, number[]> = {};
const updateRegistry: Record<number, (mapped: string) => void> = {};
const updateRegistryReverse: Record<number, string> = {};

function registerForUpdates(
  char: string,
  callback: (mapped: string) => void
): number {
  if (!updateRegistryMap[char]) {
    updateRegistryMap[char] = [];
  }
  const id = Date.now() + Math.random();
  updateRegistryMap[char].push(id);
  updateRegistry[id] = callback;

  updateRegistryReverse[id] = char;

  return id;
}

function unregisterForUpdates(id: number) {
  const char = updateRegistryReverse[id];

  const index = updateRegistryMap[char].indexOf(id);
  if (index !== -1) {
    updateRegistryMap[char].splice(index, 1);
    delete updateRegistry[id];
    delete updateRegistryReverse[id];
  } else {
    console.warn(`Tried to unregister non-existing id: ${id}`);
  }
}

export async function replaceMappingInUi(char: string, mapped: string) {
  if (updateRegistryMap[char]) {
    for (const id of updateRegistryMap[char]) {
      updateRegistry[id](mapped);
    }
  }
}
