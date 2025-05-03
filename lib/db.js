import mysql from "mysql2/promise"

export async function connectToDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASSWORD || "",
      database: process.env.DB_NAME || "libreta_compras",
    })

    return connection
  } catch (error) {
    console.error("Error connecting to database:", error)
    throw new Error("Could not connect to database")
  }
}
