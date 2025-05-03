import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/db"

export async function GET(request, { params }) {
  const { id } = params
  try {
    const connection = await connectToDatabase()
    const [rows] = await connection.execute(
      "SELECT id, usuario, vendedor, monto, fecha FROM compras WHERE id = ?",
      [id]
    )
    await connection.end()
    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Compra no encontrada" },
        { status: 404 }
      )
    }
    return NextResponse.json(rows[0])
  } catch (error) {
    console.error("Error fetching compra:", error)
    return NextResponse.json(
      { message: "Error al obtener la compra" },
      { status: 500 }
    )
  }
}

export async function PUT(request, { params }) {
  const { id } = params
  try {
    const { vendedor, monto } = await request.json()
    if (!vendedor || monto == null) {
      return NextResponse.json(
        { message: "Vendedor y monto son requeridos" },
        { status: 400 }
      )
    }
    const connection = await connectToDatabase()
    // Verificar existencia
    const [check] = await connection.execute(
      "SELECT id FROM compras WHERE id = ?",
      [id]
    )
    if (check.length === 0) {
      await connection.end()
      return NextResponse.json(
        { message: "Compra no encontrada" },
        { status: 404 }
      )
    }
    // Actualizar
    await connection.execute(
      "UPDATE compras SET vendedor = ?, monto = ? WHERE id = ?",
      [vendedor, monto, id]
    )
    // Traer registro actualizado
    const [updated] = await connection.execute(
      "SELECT id, usuario, vendedor, monto, fecha FROM compras WHERE id = ?",
      [id]
    )
    await connection.end()
    return NextResponse.json(updated[0])
  } catch (error) {
    console.error("Error updating compra:", error)
    return NextResponse.json(
      { message: "Error al actualizar la compra" },
      { status: 500 }
    )
  }
}

export async function DELETE(request, { params }) {
  const { id } = params
  try {
    const connection = await connectToDatabase()
    // Verificar existencia
    const [check] = await connection.execute(
      "SELECT id FROM compras WHERE id = ?",
      [id]
    )
    if (check.length === 0) {
      await connection.end()
      return NextResponse.json(
        { message: "Compra no encontrada" },
        { status: 404 }
      )
    }
    // Eliminar
    await connection.execute(
      "DELETE FROM compras WHERE id = ?",
      [id]
    )
    await connection.end()
    return NextResponse.json(
      { message: "Compra eliminada correctamente" }
    )
  } catch (error) {
    console.error("Error deleting compra:", error)
    return NextResponse.json(
      { message: "Error al eliminar la compra" },
      { status: 500 }
    )
  }
}
