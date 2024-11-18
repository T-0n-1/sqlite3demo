import { initializeDatabase, insertTestData } from "./Functions";

(async () => {
  const db = await initializeDatabase();
  console.log(db); // Making sure db is up before proceeding
  insertTestData(db);
})();
