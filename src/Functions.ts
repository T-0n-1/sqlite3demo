import { Database } from "sqlite3";

function dbConnect(dbFile: string): Database {
  const db = new Database(dbFile, (err) => {
    if (err) {
      console.error(err.message);
      throw err; // Exit the program
    }
    console.log("Connected to the database.");
  });
  return db;
}

function createTables(dataBase: Database): void {
  // Create the tables
  dataBase.serialize(() => {
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
  });
}

export { dbConnect, createTables };
