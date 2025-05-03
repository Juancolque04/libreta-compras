// components/edit-compra-dialog.js
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

export default function EditCompraDialog({ compra, open, onOpenChange, onCompraUpdated }) {
  const [vendedor, setVendedor] = useState("")
  const [monto, setMonto] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (compra) {
      setVendedor(compra.vendedor)
      setMonto(compra.monto.toString())
    }
  }, [compra])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!vendedor || !monto || isNaN(parseFloat(monto))) {
      toast({ title: "Error", description: "Complete los campos", variant: "destructive" })
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch(`/api/compras/${compra.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendedor, monto: parseFloat(monto) }),
      })
      if (!res.ok) throw new Error("Error al guardar")
      toast({ title: "Actualizado", description: "Compra modificada" })
      onOpenChange(false)
      onCompraUpdated?.()
    } catch (e) {
      toast({ title: "Error", description: e.message, variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="m-4 p-6 bg-white rounded-2xl shadow-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold text-gray-800">Editar Compra</DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Modifica los datos y guarda los cambios.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-vendedor" className="text-sm font-medium text-gray-700">
              Vendedor
            </Label>
            <Select value={vendedor} onValueChange={setVendedor} required>
              <SelectTrigger
                id="edit-vendedor"
                className="w-full rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500"
              >
                <SelectValue placeholder="Seleccionar vendedor" />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-xl">
                {["Mirian", "Cecilia", "Mari", "Otro"].map((n) => (
                  <SelectItem key={n} value={n}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-monto" className="text-sm font-medium text-gray-700">
              Monto (ARS)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
              <Input
                id="edit-monto"
                type="number"
                placeholder="0.00"
                className="pl-8 rounded-xl border border-gray-300 focus:ring-2 focus:ring-pink-500"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                required
                min="0"
                step="0.01"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Fecha y Hora</Label>
            <Input
              type="text"
              value={compra ? new Date(compra.fecha).toLocaleString("es-AR") : ""}
              disabled
              className="w-full rounded-xl bg-gray-100 text-gray-600"
            />
            <p className="text-xs text-gray-400">La fecha original se mantendrá</p>
          </div>
          <DialogFooter className="flex flex-col space-y-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="w-full py-2 rounded-xl border-gray-300 hover:bg-gray-100"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 rounded-xl bg-pink-500 text-white hover:bg-pink-600 transition"
            >
              {isLoading ? "Guardando..." : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
