import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function GET() {
  try {
    const connection = await connectToDatabase()
    // Incluimos usuario, vendedor, monto y fecha
    const [rows] = await connection.execute(
      "SELECT id, usuario, vendedor, monto, fecha FROM compras ORDER BY fecha DESC"
    )
    await connection.end()
    return NextResponse.json(rows)
  } catch (error) {
    console.error("Error fetching compras:", error)
    return NextResponse.json(
      { message: "Error al obtener las compras" },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const { usuario, vendedor, monto, fecha } = await request.json()

    // Validaciones básicas
    if (!usuario || !vendedor || monto == null || !fecha) {
      return NextResponse.json(
        { message: "Todos los campos son requeridos" },
        { status: 400 }
      )
    }

    const connection = await connectToDatabase()

    // La columna `fecha` en MySQL es DATETIME, así que enviamos el string "YYYY-MM-DD HH:mm:00"
    const [result] = await connection.execute(
      `INSERT INTO compras (usuario, vendedor, monto, fecha)
       VALUES (?, ?, ?, ?)`,
      [usuario, vendedor, monto, fecha]
    )

    await connection.end()

    return NextResponse.json(
      {
        id: result.insertId,
        usuario,
        vendedor,
        monto,
        fecha,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error creating compra:", error)
    return NextResponse.json(
      { message: "Error al registrar la compra" },
      { status: 500 }
    )
  }
}
