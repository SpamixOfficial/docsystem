import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

const connection = await mysql.createConnection({
  host: Bun.env.dbhost,
  user: Bun.env.dbuser,
  password: Bun.env.dbpass,
  database: Bun.env.dbname,
});

const db = drizzle(connection);

export {db};