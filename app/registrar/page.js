"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { NumericFormat } from "react-number-format"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export default function RegistrarCompra() {
  const [vendedor, setVendedor] = useState("")
  const [monto, setMonto] = useState("")      // valor crudo para NumericFormat
  const [fecha, setFecha] = useState("")      // local datetime-local string
  const [isLoading, setIsLoading] = useState(false)
  const [openUserDialog, setOpenUserDialog] = useState(false)

  const router = useRouter()

  // Helper: formato YYYY-MM-DDThh:mm basado en local
  const getLocalDateTimeString = (date = new Date()) => {
    const pad = (n) => String(n).padStart(2, "0")
    const yyyy = date.getFullYear()
    const MM = pad(date.getMonth() + 1)
    const dd = pad(date.getDate())
    const hh = pad(date.getHours())
    const mm = pad(date.getMinutes())
    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`
  }

  // Inicializar fecha con la hora local
  useEffect(() => {
    setFecha(getLocalDateTimeString())
  }, [])

  const handleOpenDialog = (e) => {
    e.preventDefault()
    if (!vendedor || !monto) {
      toast.warning("Por favor completa todos los campos.")
      return
    }
    if (isNaN(parseFloat(monto)) || parseFloat(monto) <= 0) {
      toast.error("El monto debe ser un número positivo.")
      return
    }
    if (!fecha) {
      toast.warning("Fecha inválida.")
      return
    }
    setOpenUserDialog(true)
  }

  const handleRegisterWithUser = async (usuario) => {
    setOpenUserDialog(false)
    setIsLoading(true)

    try {
      // Convertimos el "YYYY-MM-DDThh:mm" a "YYYY-MM-DD hh:mm:00"
      const fechaParaMySQL = fecha.replace("T", " ") + ":00"

      const payload = {
        usuario,
        vendedor,
        monto: parseFloat(monto),
        fecha: fechaParaMySQL,
      }

      const res = await fetch("/api/compras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success(`Compra registrada como ${usuario}`)
        // reset form: vendedor, monto y fecha (local ahora)
        setVendedor("")
        setMonto("")
        setFecha(getLocalDateTimeString())
        setTimeout(() => router.push("/"), 1500)
      } else if (res.status === 400) {
        const { message } = await res.json()
        toast.warning(message || "Faltan datos obligatorios.")
      } else {
        throw new Error("Error en el servidor")
      }
    } catch (error) {
      toast.error(`No se pudo registrar: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-800 p-4">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />

      <Link
        href="/"
        className="flex items-center text-pink-600 hover:text-pink-700 mb-6 text-sm font-medium"
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        Volver
      </Link>

      <Card className="bg-white rounded-2xl shadow-lg mt-36">
        <CardHeader className="px-6 pt-6">
          <CardTitle className="text-center text-2xl font-semibold text-gray-800">
            Registrar Compra
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <form className="space-y-4">
            {/* Vendedor */}
            <div className="space-y-1">
              <Label htmlFor="vendedor" className="text-sm font-medium text-gray-700">
                Vendedor
              </Label>
              <Select value={vendedor} onValueChange={setVendedor}>
                <SelectTrigger
                  id="vendedor"
                  className="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-400"
                >
                  <SelectValue placeholder="Seleccione vendedor" />
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

            {/* Monto con formato ARS */}
            <div className="space-y-1">
              <Label htmlFor="monto" className="text-sm font-medium text-gray-700">
                Monto (ARS)
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                <NumericFormat
                  id="monto"
                  className="pl-8 p-1 w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-400"
                  value={monto}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  placeholder="0,00"
                  onValueChange={(values) => setMonto(values.value)}
                  inputMode="decimal"
                  pattern="[0-9]*"
                />
              </div>
            </div>

            {/* Fecha editable */}
            <div className="space-y-1">
              <Label htmlFor="fecha" className="text-sm font-medium text-gray-700">
                Fecha y Hora
              </Label>
              <Input
                id="fecha"
                type="datetime-local"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                className="w-full rounded-md border border-gray-300 focus:ring-2 focus:ring-pink-400 p-1"
              />
            </div>

            {/* Botón que abre el diálogo */}
            <Button
              onClick={handleOpenDialog}
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-pink-500 text-white font-medium hover:bg-pink-600 transition"
            >
              {isLoading ? "Procesando..." : "Registrar Compra"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Diálogo para elegir usuario */}
      <Dialog open={openUserDialog} onOpenChange={setOpenUserDialog}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle>¿Quién realiza la compra?</DialogTitle>
          </DialogHeader>
          <div className="flex justify-around py-4">
            <Button
              onClick={() => handleRegisterWithUser("Natalia")}
              disabled={isLoading}
              className="px-6 py-2 rounded-xl bg-pink-500 text-white hover:bg-pink-600"
            >
              Natalia
            </Button>
            <Button
              onClick={() => handleRegisterWithUser("Juan")}
              disabled={isLoading}
              className="px-6 py-2 rounded-xl bg-pink-500 text-white hover:bg-pink-600"
            >
              Juan
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
