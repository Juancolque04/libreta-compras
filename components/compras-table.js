"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(amount || 0)

const formatDate = (dateString) => {
  // dateString: "YYYY-MM-DD HH:MM:SS"
  const [datePart, timePart] = dateString.split(" ")
  const [year, month, day] = datePart.split("-").map(Number)
  const [hour, minute, second] = timePart.split(":").map(Number)

  // Construyo un Date en local con esos componentes:
  const date = new Date(year, month - 1, day, hour, minute, second)

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

export default function ComprasTable({ compras, onEdit, onDelete }) {
  if (compras.length === 0) {
    return <div className="text-center py-8 text-gray-500">No se encontraron compras</div>
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Vendedor</TableHead>
            <TableHead className="text-right">Monto</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {compras.map((c) => (
            <TableRow key={c.id}>
              <TableCell className="font-medium">{formatDate(c.fecha)}</TableCell>
              <TableCell>{c.usuario}</TableCell>
              <TableCell>{c.vendedor}</TableCell>
              <TableCell className="text-right">{formatCurrency(c.monto)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(c)}
                    className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(c)}
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Eliminar</span>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
