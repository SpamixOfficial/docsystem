import { defineConfig } from "drizzle-kit";

if (
    !process.env.dbhost ||
    !process.env.dbuser ||
    !process.env.dbpass ||
    !process.env.dbname
) {
    throw new Error("Missing database credentials");
}


export default defineConfig({
    schema: "./src/lib/schema.server.ts",
    dialect: "mysql",
    dbCredentials: {
        host: process.env.dbhost,
        user: process.env.dbuser,
        password: process.env.dbpass,
        database: process.env.dbname,
    },
});
