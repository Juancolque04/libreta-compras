// components/delete-compra-dialog.js
"use client"

import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/components/ui/use-toast"

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount || 0)

const formatDate = (dateString) =>
  new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(dateString))

export default function DeleteCompraDialog({ compra, open, onOpenChange, onCompraDeleted }) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/compras/${compra.id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Error al eliminar")
      toast({ title: "Compra eliminada", description: "Eliminada correctamente" })
      onOpenChange(false)
      onCompraDeleted?.()
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  if (!compra) return null

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="m-4 p-6 bg-white rounded-2xl shadow-lg">
        <AlertDialogHeader className="space-y-2">
          <AlertDialogTitle className="text-lg font-semibold text-gray-800">
            ¿Eliminar compra?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-gray-600">
            Se borrará la compra de{" "}
            <span className="font-medium">{formatCurrency(compra.monto)}</span> del{" "}
            <span className="font-medium">{formatDate(compra.fecha)}</span> con{" "}
            <span className="font-medium">{compra.vendedor}</span>. Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col space-y-3 mt-6">
          <AlertDialogCancel
            disabled={isLoading}
            className="w-full py-2 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="w-full py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition"
          >
            {isLoading ? "Eliminando..." : "Eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
