import { Database } from "sqlite3";
import dotenv from "dotenv";
import type { HeroWithPowers } from "./Interfaces";

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

// async function for initializing connecction and creating tables
export async function initializeDatabase() {
  try {
    db = await dbConnect(dbFile); // Assign db after the connection is established
    createTables(db); // Create tables
    return db; // Return the database instance
  } catch {
    console.error("Error initializing the database");
    process.exit(1); // Exit on failure
  }
}

export function insertTestData(db: Database) {
  db.exec(
    `INSERT INTO Hero (hero_id, hero_name, is_xman, was_snapped)
      VALUES
      (1, 'Wolverine', true, true),
      (2, 'Cyclops', true, false),
      (3, 'Jean Grey', true, true),
      (4, 'Storm', true, false),
      (5, 'Beast', true, true),
      (6, 'Professor X', true, false);
      INSERT INTO Hero_power (hero_id, hero_power)
      VALUES
      (1, 'Regeneration'),
      (2, 'Optic Blast'),
      (3, 'Telekinesis'),
      (4, 'Weather Control'),
      (5, 'Super Strength'),
      (6, 'Telepathy');`,
    (err) => {
      if (err) console.error(err.message);
    },
  );
}

export function runQueries(db: Database) {
  // Query 1 with left join
  const query = `SELECT 
      he.hero_id AS hero_id,
      he.hero_name AS hero_name,
      hp.hero_power AS hero_power,
      he.is_xman AS is_xman,
      he.was_snapped AS was_snapped
    FROM Hero he
    LEFT JOIN Hero_power hp ON he.hero_id = hp.hero_id`;
  console.log("db.each() result (with LEFT JOIN): ");
  db.serialize(() => {
    db.each(query, (err: Error | null, row: HeroWithPowers) => {
      if (err) {
        console.error(err.message);
        throw err;
      }
      console.log(
        `ID: ${row.hero_id}, Name: ${row.hero_name}, Heropower: ${row.hero_power}, Is Xman: ${row.is_xman}, Was Snapped: ${row.was_snapped}`,
      );
    });
  });

  // Query 2 with inner join and where clause
  const query2 = `SELECT 
      he.hero_name AS hero_name,
      hp.hero_power AS hero_power,
      he.is_xman AS is_xman,
      he.was_snapped AS was_snapped
      FROM Hero he
      INNER JOIN Hero_power hp ON he.hero_id = hp.hero_id
      WHERE he.was_snapped = ?`;
  const queryCondition: boolean = true;
  console.log("db.each() result (with INNER JOIN and WHERE clause): ");
  db.serialize(() => {
    db.each(
      query2,
      [queryCondition],
      (err: Error | null, row: HeroWithPowers) => {
        if (err) {
          console.error(err.message);
          throw err;
        }
        console.log(
          `Name: ${row.hero_name}, Heropower: ${row.hero_power}, Is Xman: ${row.is_xman}, Was Snapped: ${row.was_snapped}`,
        );
      },
    );
  });
}
