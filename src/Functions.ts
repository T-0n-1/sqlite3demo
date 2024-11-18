import { Database } from "sqlite3";

function dbConnect(dbFile: string): Promise<Database> {
  return new Promise((resolve, reject) => {
    const db = new Database(dbFile, (err) => {
      if (err) {
        console.error(err.message);
        reject(err); // Reject the Promise on error
        return;
      }
      console.log(`Connected to the ${dbFile} database.`);
      resolve(db); // Resolve the Promise with the Database instance
    });
  });
}

function createTables(dataBase: Database): Promise<void> {
  return new Promise((resolve, reject) => {
    dataBase.serialize(() => {
      try {
        dataBase.run(`DROP TABLE IF EXISTS Hero`);
        dataBase.run(`CREATE TABLE IF NOT EXISTS Hero (
                      hero_id INTEGER PRIMARY KEY,
                      hero_name TEXT NOT NULL,
                      is_xman BOOLEAN NOT NULL,
                      was_snapped BOOLEAN NOT NULL
                  )`);
        dataBase.run(`DROP TABLE IF EXISTS Hero_power`);
        dataBase.run(`CREATE TABLE IF NOT EXISTS Hero_power (
                      hero_id INTEGER PRIMARY KEY,
                      hero_power TEXT NOT NULL
                  )`);
        console.log("Tables created successfully");
        resolve(); // Resolve the Promise when tables are created
      } catch (err) {
        console.error("Unable to create tables", err);
        reject(err); // Reject the Promise on error
      }
    });
  });
}

async function connectAndCreate(dbFile: string): Promise<void> {
  try {
    const db = await dbConnect(dbFile);
    await createTables(db);
  } catch (err) {
    console.error("Error:", err);
  }
}

export { connectAndCreate };
