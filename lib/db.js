// lib/db.js
import mysql from "mysql2/promise"

export async function connectToDatabase() {
  try {
    let config

    if (process.env.DATABASE_URL) {
      // Parsear URL de conexión
      const url = new URL(process.env.DATABASE_URL)
      config = {
        host: url.hostname,
        port: url.port ? Number(url.port) : 3306,
        user: url.username,
        password: url.password,
        database: url.pathname.replace(/^\//, ""),
        // opcional: si tu host requiere SSL:
        // ssl: { rejectUnauthorized: true },
      }
    } else {
      // Fallback a variables separadas (tu entorno local)
      config = {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "libreta_compras",
      }
    }

    const connection = await mysql.createConnection(config)
    return connection
  } catch (error) {
    console.error("Error connecting to database:", error)
    throw new Error("Could not connect to database")
  }
}
