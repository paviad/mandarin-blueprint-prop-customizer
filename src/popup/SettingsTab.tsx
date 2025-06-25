import * as React from "react";
import { TabPanelProps } from "./TabPanelProps";
import Switch from "@mui/material/Switch";
import { loadSettings, setHideDefault } from "../util/settings-operations";

function Settings() {
  const [hideDefaultUi, setHideDefaultUi] = React.useState(false);
  React.useEffect(() => {
    async function loadSettingsEffect() {
      const settings = await loadSettings();
      if (settings) {
        setHideDefaultUi(settings.hideDefault || false);
      }
    }
    loadSettingsEffect();
  });

  async function setHideDefaultAndSave(hide: boolean) {
    setHideDefaultUi(hide);
    await setHideDefault(hide);
  }

  return (
    <div>
      <Switch
        checked={hideDefaultUi}
        onChange={(f) => setHideDefaultAndSave(f.target.checked)}
      />
      {"Hide Default"}
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
