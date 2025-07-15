import { Subject } from 'rxjs';
import { sendPropUpdateMessageToServiceWorker } from "../chrome/messages";
import { getFromStorage, saveToStorage } from "../chrome/storage";
import { Database } from "../model/database";

const VERSION_KEY = "myVersion";
const DATABASE_KEY = "myDatabase";
const CHUNK_PREFIX_KEY = "chunk_";

let database: Database;
let cacheValid = false;

const databaseChanged = new Subject<Database>();
export const databaseChanged$ = databaseChanged.asObservable();

export function invalidateDbCache() {
  cacheValid = false;
}

export function getCachedDatabase(): Database | null {
  return database;
}

async function loadDatabase(): Promise<Database | null> {
  if (cacheValid && database) {
    return database;
  }
  try {
    const version = await getFromStorage(VERSION_KEY);

    console.log(`MBC Extension: Loading database version ${version}`);

    let rc: Database;
    if (version === "1") {
      rc = await getDatabaseV1();
    } else if (!version) {
      rc = await getDatabaseV0();
    } else {
      console.log("MBC Extension: No version found, failed to load database");
      return null;
    }

    console.log(
      `MBC Extension: Loaded database with ${
        Object.keys(rc.propMap).length
      } props`
    );

    internalSetDatabaseUpdateSubscribers(rc);

    return database;
  } catch (error) {
    console.log("MBC Extension: Failed to load database.", error);
    return null;
  }
}

function internalSetDatabaseUpdateSubscribers(rc: Database) {
  databaseChanged.next(rc);
  database = rc;
  cacheValid = true;
}

async function getDatabaseV1(): Promise<Database> {
  const numberOfChunks = +((await getFromStorage("numberOfChunks")) || 0);

  console.log(`MBC Extension: Loading database in ${numberOfChunks} chunks`);

  let fullString = "";
  for (let i = 0; i < numberOfChunks; i++) {
    const chunk = await getFromStorage(`${CHUNK_PREFIX_KEY}${i}`);
    if (chunk === null) {
      console.log(`MBC Extension: Missing chunk ${i}, failed to load database`);
      throw new Error(`Missing chunk ${i}`);
    }
    fullString += chunk;
    console.log(`MBC Extension: Loaded chunk ${i} of size ${chunk.length}`);
  }

  let db: Partial<Database> = {};
  if (fullString) {
    db = JSON.parse(fullString);
  }

  const rc = {
    propMap: db.propMap ?? {},
    setMap: db.setMap ?? {},
    actorMap: db.actorMap ?? {},
  };
  return rc;
}

async function saveDatabase(db: Database): Promise<void> {
  try {
    await saveDatabaseV1(db);
    internalSetDatabaseUpdateSubscribers(db);
  } catch (error) {
    console.log("MBC Extension: Failed to save database.", error);
  }
}

async function saveDatabaseV1(db: Database): Promise<void> {
  const fullString = JSON.stringify(db);

  console.log(
    `MBC Extension: Saving database of size ${fullString.length} bytes`
  );

  const chunkSize = chrome.storage.sync.QUOTA_BYTES_PER_ITEM;
  const numberOfChunks = Math.ceil(fullString.length / chunkSize);
  console.log(
    `MBC Extension: Saving database in ${numberOfChunks} chunks, each ${chunkSize} bytes`
  );
  await saveToStorage("numberOfChunks", numberOfChunks.toString());
  for (let i = 0; i < numberOfChunks; i++) {
    const start = i * chunkSize;
    const end = start + chunkSize;
    const chunk = fullString.slice(start, end);

    console.log(`MBC Extension: Saving chunk ${i} of size ${chunk.length}`);

    await saveToStorage(`${CHUNK_PREFIX_KEY}${i}`, chunk);
  }
  await saveToStorage(VERSION_KEY, "1");
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

  return db;
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
        throw new Error(
          `All prop values must be strings. Bad value for key ${key}: ${importedProps[key]}`
        );
      }
      if (key.length > 2) {
        throw new Error(
          `All prop keys must be single characters. Bad key: ${key}`
        );
      }
      if (importedProps[key].length > 100) {
        throw new Error(
          `Prop values must be less than 100 characters. Bad value for key ${key}: ${importedProps[key]}`
        );
      }
    }

    // Merge imported props into the database
    db.propMap = { ...db.propMap, ...importedProps };
    await saveDatabase(db);

    alert("Props imported from clipboard successfully!");
  } catch (err) {
    console.error("MBC Extension: Failed to read props from clipboard:", err);
    alert("Failed to read props from clipboard.");
  }
}

// Obsolete functions for backward compatibility

async function getDatabaseV0() {
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
  return rc;
}

async function saveDatabaseV0(db: Database) {
  await saveToStorage(DATABASE_KEY, JSON.stringify(db));
}
