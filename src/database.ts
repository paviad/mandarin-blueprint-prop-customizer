const DATABASE_KEY = "myDatabase";

export interface Database {
  propMap: Record<string, string>;
  setMap: Record<string, string>;
  actorMap: Record<string, string>;
}

export function loadDatabase(): Database {
  const data = localStorage.getItem(DATABASE_KEY);
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

export function saveDatabase(db: Database): void {
  localStorage.setItem(DATABASE_KEY, JSON.stringify(db));
}
