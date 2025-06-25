import * as React from "react";
import { TabPanelProps } from "./TabPanelProps";
import Switch from "@mui/material/Switch";

function Settings() {
  return (
    <div>
      <Switch /> Hide Default
    </div>
  );
}

export function SettingsTab(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Settings />}
    </div>
  );
}
