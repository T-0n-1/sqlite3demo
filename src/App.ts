import dotenv from "dotenv";
// import sqlite3, { Database } from "sqlite3";
import { dbConnect, createTables } from "./Functions";
// import type { Hero, Hero_power } from "./Interfaces";

dotenv.config();

const dbFile = process.env.DATABASEPATH || "db.sqlite";

const db = dbConnect(dbFile);
createTables(db);
