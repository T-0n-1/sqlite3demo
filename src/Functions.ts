import { Database } from "sqlite3";
import dotenv from "dotenv";

dotenv.config();

const dbFile: string = process.env.DATABASEPATH || "db.sqlite";
let db: Database;

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

function createTables(dataBase: Database): void {
  try {
    dataBase.serialize(() => {
      dataBase.run("DROP TABLE IF EXISTS Hero");
      dataBase.run(`CREATE TABLE IF NOT EXISTS Hero (
                    hero_id INTEGER PRIMARY KEY,
                    hero_name TEXT NOT NULL,
                    is_xman BOOLEAN NOT NULL,
                    was_snapped BOOLEAN NOT NULL)`);
      dataBase.run(`DROP TABLE IF EXISTS Hero_power`);
      dataBase.run(`CREATE TABLE IF NOT EXISTS Hero_power (
                    hero_id INTEGER PRIMARY KEY,
                    hero_power TEXT NOT NULL
                )`);
    });
    console.log("Tables created successfully");
  } catch {
    console.log("Unable to create tables");
    throw new Error(); // Exit the program
  }
}

async function initializeDatabase() {
  try {
    db = await dbConnect(dbFile); // Assign db after the connection is established
    createTables(db); // Create tables
    console.log("Database initialized and returned successfully");
    return db; // Return the database instance
  } catch {
    console.error("Error initializing the database");
    process.exit(1); // Exit on failure
  }
}

export { initializeDatabase };
