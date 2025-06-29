import { sendPropUpdateMessageToServiceWorker } from "../chrome/messages";
import { getFromStorage, saveToStorage } from "../chrome/storage";
import { Database } from "../model/database";

const DATABASE_KEY = "myDatabase";

let database: Database;

async function loadDatabase(): Promise<Database | null> {
  try {
    const data = await getFromStorage(DATABASE_KEY);
    let db: Partial<Database> = {};
    if (data) {
      try {
        db = JSON.parse(data);
      } catch {
        // ignore parse error, will use empty objects
      }
    }
    const rc = {
      propMap: db.propMap ?? {},
      setMap: db.setMap ?? {},
      actorMap: db.actorMap ?? {},
    };

    database = rc;

    return database;
  } catch (error) {
    console.log("MBC Extension: Failed to load database.");
    return null;
  }
}

async function saveDatabase(db: Database): Promise<void> {
  try {
    await saveToStorage(DATABASE_KEY, JSON.stringify(db));
  } catch (error) {
    console.log("MBC Extension: Failed to save database.", error);
  }
}

export async function updateProp(char: string, value: string) {
  if (!char) return;

  console.log(
    `MBC Extension: Updating prop for character '${char}' to '${value}'`
  );

  const db = await loadDatabase();
  if (!db) {
    console.log("MBC Extension: Failed to load database.");
    return;
  }

  if (value) {
    if (db.propMap[char] === value) return; // No change
    db.propMap[char] = value;
  } else {
    if (!db.propMap[char]) return; // No change
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete db.propMap[char];
  }

  sendPropUpdateMessageToServiceWorker(char, value);

  await saveDatabase(db);
}

export async function getProp(char: string): Promise<string> {
  if (!char) return "";

  const db = await loadDatabase();
  if (!db) {
    return "";
  }

  return db.propMap[char] ?? "";
}

export async function exportDatabase(): Promise<Database | null> {
  const db = await loadDatabase();
  if (!db) {
    return null;
  }

  return {
    propMap: { ...db.propMap },
    setMap: { ...db.setMap },
    actorMap: { ...db.actorMap },
  };
}

export async function exportToClipboard() {
  const db = await loadDatabase();
  if (!db) {
    return null;
  }
  const propMap = db.propMap;
  const text = JSON.stringify(propMap, null, 2);
  try {
    await navigator.clipboard.writeText(text);
    alert("Props exported to clipboard successfully!");
  } catch (err) {
    console.log("MBC Extension: Failed to copy props to clipboard:", err);
    alert("Failed to copy props to clipboard.");
  }
}

export async function importFromClipboard() {
  const db = await loadDatabase();
  if (!db) {
    return null;
  }
  try {
    const text = await navigator.clipboard.readText();
    const importedProps = JSON.parse(text);

    // Ensure importedProps is of type Record<string, string>
    if (
      typeof importedProps !== "object" ||
      importedProps === null ||
      Array.isArray(importedProps)
    ) {
      throw new Error("Clipboard data is not a valid props object.");
    }
    if (Object.entries(importedProps).length > 10000) {
      throw new Error("Too many props imported. Limit is 10,000.");
    }
    for (const key in importedProps) {
      if (typeof importedProps[key] !== "string") {
        throw new Error("All prop values must be strings.");
      }
      if (key.length !== 1) {
        throw new Error("All prop keys must be single characters.");
      }
      if (importedProps[key].length > 100) {
        throw new Error("Prop values must be less than 100 characters.");
      }
    }

    // Merge imported props into the database
    db.propMap = { ...db.propMap, ...importedProps };
    await saveDatabase(db);

    alert("Props imported from clipboard successfully!");
  } catch (err) {
    console.log("MBC Extension: Failed to read props from clipboard:", err);
    alert("Failed to read props from clipboard.");
  }
}
