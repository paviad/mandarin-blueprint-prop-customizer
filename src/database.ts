const DATABASE_KEY = "myDatabase";

let database: Database;

export interface Database {
  propMap: Record<string, string>;
  setMap: Record<string, string>;
  actorMap: Record<string, string>;
}

async function getFromStorage(key: string): Promise<string | null> {
  const result = await chrome.storage.sync.get(key);
  return result[key] as string | null;
}

async function saveToStorage(key: string, value: string): Promise<void> {
  await chrome.storage.sync.set({ [key]: value });
}

async function loadDatabase(): Promise<Database> {
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
}

async function saveDatabase(db: Database): Promise<void> {
  saveToStorage(DATABASE_KEY, JSON.stringify(db));
}

export async function updateProp(char: string, value: string) {
  if (!char) return;

  const db = await loadDatabase();
  if (value) {
    if (db.propMap[char] === value) return; // No change
    db.propMap[char] = value;
  } else {
    if (!db.propMap[char]) return; // No change
    delete db.propMap[char];
  }

  saveDatabase(db);
}

export async function getProp(char: string): Promise<string> {
  if (!char) return "";

  const db = await loadDatabase();
  return db.propMap[char] ?? "";
}
