import { initializeDatabase, insertTestData, runQueries } from "./Functions";

(async () => {
  const db = await initializeDatabase();
  console.log(`Database is initialized: ${db !== undefined}`); // Making sure db is up before proceeding
  insertTestData(db);
  runQueries(db);
})();
