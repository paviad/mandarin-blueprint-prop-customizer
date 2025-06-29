import * as React from "react";
import { useState } from "react";
import {
  exportDatabase,
  exportToClipboard,
  importFromClipboard,
} from "../util/database-operations";
import { TabPanelProps } from "./TabPanelProps";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

function SavedProps(p: { propMap: Record<string, string> }) {
  return (
    <>
      <div>
        <Stack
          direction="row"
          spacing={2}
          justifyContent="center"
          alignItems="center"
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => exportToClipboard()}
          >
            Export to Clipboard
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => importFromClipboard()}
          >
            Import from Clipboard
          </Button>
        </Stack>
      </div>
      <div style={{ whiteSpace: "pre" }}>
        {Object.entries(p.propMap).map(([key, value]) => (
          <div key={key}>
            <strong>{key}:</strong> {value}
          </div>
        ))}
      </div>
    </>
  );
}

export function SavedPropsTab(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  const [propMap, setProps] = useState({});
  React.useEffect(() => {
    async function fetchProps() {
      const db = await exportDatabase();
      if (!db) return;
      setProps(db.propMap);
    }
    fetchProps();
  });

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <SavedProps propMap={propMap} />}
    </div>
  );
}
