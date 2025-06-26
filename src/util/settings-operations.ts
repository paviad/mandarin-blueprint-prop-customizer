import { Subject } from "rxjs";
import { getFromStorage, saveToStorage } from "../chrome/storage";
import { Settings } from "../model/settings";
import { sendSettingsUpdateMessageToServiceWorker } from '../chrome/messages';

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
  const oldSettings = await loadSettings();
  if (!oldSettings) {
    console.log("MBC Extension: Failed to load settings.");
    return;
  }

  settings = {
    ...oldSettings,
    ...newSettings,
  };

  await saveSettings(settings);
}

export async function exportSettings(): Promise<Settings | null> {
  const oldSettings = await loadSettings();
  if (!oldSettings) {
    return null;
  }

  return { ...oldSettings };
}

const settingsSubject = new Subject<Settings>();
export const settings$ = settingsSubject.asObservable();

export async function setHideDefault(hide: boolean) {
  await updateSettings({ hideDefault: hide } satisfies Partial<Settings>);
  settingsSubject.next(settings);
  await sendSettingsUpdateMessageToServiceWorker();
}

export async function disseminateSettings() {
  const currentSettings = await loadSettings();
  if (currentSettings) {
    settings = currentSettings;
    settingsSubject.next(settings);
  } else {
    console.log("MBC Extension: Failed to disseminate settings.");
  }
}
