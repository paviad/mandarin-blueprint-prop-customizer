import { getFromStorage, saveToStorage } from "../chrome/storage";
import { Settings } from "../model/settings";

const SETTINGS_KEY = "mySettings";

let settings: Settings;

export async function loadSettings(): Promise<Settings | null> {
  try {
    const data = await getFromStorage(SETTINGS_KEY);
    let settings: Partial<Settings> = {};
    if (data) {
      try {
        settings = JSON.parse(data);
      } catch {
        // ignore parse error, will use empty objects
      }
    }

    return settings;
  } catch (error) {
    console.log("MBC Extension: Failed to load settings.");
    return null;
  }
}

async function saveSettings(db: Settings): Promise<void> {
  try {
    await saveToStorage(SETTINGS_KEY, JSON.stringify(db));
  } catch (error) {
    console.log("MBC Extension: Failed to save settings.", error);
  }
}

async function updateSettings(newSettings: Settings) {
  const db = await loadSettings();
  if (!db) {
    console.log("MBC Extension: Failed to load settings.");
    return;
  }

  await saveSettings({
    ...db,
    ...newSettings,
  });
}

export async function exportSettings(): Promise<Settings | null> {
  const db = await loadSettings();
  if (!db) {
    return null;
  }

  return {};
}

export async function setHideDefault(hide: boolean) {
  await updateSettings({ hideDefault: hide } satisfies Partial<Settings>);
}
