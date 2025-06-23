import { sendMessageToServiceWorker } from "../chrome/messages";
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
    saveToStorage(DATABASE_KEY, JSON.stringify(db));
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

  sendMessageToServiceWorker(char, value);

  saveDatabase(db);
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
