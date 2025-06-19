const DATABASE_KEY = "myDatabase";

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

export async function loadDatabase(): Promise<Database> {
  // const data = localStorage.getItem(DATABASE_KEY);
  const data = await getFromStorage(DATABASE_KEY);
  let db: Partial<Database> = {};
  if (data) {
    try {
      db = JSON.parse(data);
    } catch {
      // ignore parse error, will use empty objects
    }
  }
  return {
    propMap: db.propMap ?? {},
    setMap: db.setMap ?? {},
    actorMap: db.actorMap ?? {},
  };
}

export async function saveDatabase(db: Database): Promise<void> {
  // localStorage.setItem(DATABASE_KEY, JSON.stringify(db));
  saveToStorage(DATABASE_KEY, JSON.stringify(db));
}
