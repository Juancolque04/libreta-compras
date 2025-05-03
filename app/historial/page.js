"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"

import ComprasTable from "@/components/compras-table"
import EditCompraDialog from "@/components/edit-compra-dialog"
import DeleteCompraDialog from "@/components/delete-compra-dialog"

const formatCurrency = (amount) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(amount || 0)

export default function HistorialCompras() {
  const [compras, setCompras] = useState([])
  const [filteredCompras, setFilteredCompras] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [vendedor, setVendedor] = useState("todos")
  const [usuarioFiltro, setUsuarioFiltro] = useState("todos")
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [selectedCompra, setSelectedCompra] = useState(null)
  const [editOpen, setEditOpen] = useState(false)
  const [delOpen, setDelOpen] = useState(false)

  // Aplicar la clase para permitir scroll en esta página
  useEffect(() => {
    document.body.classList.add("allow-scroll")

    return () => {
      document.body.classList.remove("allow-scroll")
    }
  }, [])

  useEffect(() => {
    fetchCompras()
  }, [])

  const fetchCompras = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/compras")
      if (!res.ok) throw new Error("Error al obtener compras")
      const data = await res.json()
      setCompras(data)
      aplicarTodosFiltros(data)
    } catch (e) {
      toast.error(e.message)
    } finally {
      setIsLoading(false)
    }
  }

  const aplicarFiltrosVendedorUsuario = (data) => {
    return data.filter((c) => {
      const okVend = vendedor === "todos" || c.vendedor === vendedor
      const okUser = usuarioFiltro === "todos" || c.usuario === usuarioFiltro
      return okVend && okUser
    })
  }

  const aplicarFiltroFechas = (data) => {
    // Si no hay fechas seleccionadas devolvemos todo
    if (!fechaInicio && !fechaFin) return data

    // Parseo manual de YYYY-MM-DD para evitar offset de zona horaria
    let start, end

    if (fechaInicio) {
      const [y1, m1, d1] = fechaInicio.split("-").map(Number)
      start = new Date(y1, m1 - 1, d1, 0, 0, 0, 0)
    } else {
      start = new Date(1970, 0, 1, 0, 0, 0, 0)
    }

    if (fechaFin) {
      const [y2, m2, d2] = fechaFin.split("-").map(Number)
      end = new Date(y2, m2 - 1, d2, 23, 59, 59, 999)
    } else {
      const now = new Date()
      end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999)
    }

    return data.filter((compra) => {
      // Convertimos "YYYY-MM-DD HH:MM:SS" → [YYYY,MM,DD,HH,MM,SS]
      const [datePart, timePart] = compra.fecha.split(" ")
      const [yy, mm, dd] = datePart.split("-").map(Number)
      const [hh = 0, mi = 0, ss = 0] = timePart ? timePart.split(":").map(Number) : [0, 0, 0]
      const compDate = new Date(yy, mm - 1, dd, hh, mi, ss)

      return compDate >= start && compDate <= end
    })
  }

  const aplicarTodosFiltros = (data = compras) => {
    const porVendUser = aplicarFiltrosVendedorUsuario(data)
    const porFechas = aplicarFiltroFechas(porVendUser)
    setFilteredCompras(porFechas)
  }

  const limpiarFiltros = () => {
    setVendedor("todos")
    setUsuarioFiltro("todos")
    setFechaInicio("")
    setFechaFin("")
    aplicarTodosFiltros(compras)
  }

  const calcularTotal = () => filteredCompras.reduce((acc, c) => acc + Number(c.monto), 0)

  const handleEdit = (c) => {
    setSelectedCompra(c)
    setEditOpen(true)
  }
  const handleDelete = (c) => {
    setSelectedCompra(c)
    setDelOpen(true)
  }
  const onUpdate = () => {
    fetchCompras()
    setEditOpen(false)
    setDelOpen(false)
  }

  return (
    <div className="min-h-screen bg-neutral-800 p-4 pb-20">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />

      <Link href="/" className="flex items-center text-pink-600 hover:text-pink-700 mb-4">
        <ArrowLeft className="mr-1 h-5 w-5" /> Volver
      </Link>

      <Card className="rounded-2xl shadow-lg border border-gray-200 bg-white mb-6">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-semibold">Historial de Compras</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filtros de Vendedor y Usuario */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vendedor" className="text-sm font-medium text-gray-700">
                Filtrar por Vendedor
              </Label>
              <Select value={vendedor} onValueChange={setVendedor}>
                <SelectTrigger
                  id="vendedor"
                  className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-pink-500"
                >
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-xl">
                  <SelectItem value="todos">Todos</SelectItem>
                  {["Mirian", "Cecilia", "Mari", "Otro"].map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="usuario" className="text-sm font-medium text-gray-700">
                Filtrar por Usuario
              </Label>
              <Select value={usuarioFiltro} onValueChange={setUsuarioFiltro}>
                <SelectTrigger
                  id="usuario"
                  className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-pink-500"
                >
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-xl">
                  <SelectItem value="todos">Todos</SelectItem>
                  {["Natalia", "Juan"].map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Rango de Fechas */}
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaInicio" className="text-sm font-medium text-gray-700">
                  Desde
                </Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-pink-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaFin" className="text-sm font-medium text-gray-700">
                  Hasta
                </Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="w-full rounded-xl border-gray-300 focus:ring-2 focus:ring-pink-500"
                />
              </div>
            </div>
            <Button
              onClick={() => aplicarTodosFiltros()}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white rounded-xl py-2"
            >
              Aplicar
            </Button>
          </div>

          <Button
            variant="outline"
            onClick={limpiarFiltros}
            className="w-full border-gray-300 hover:bg-gray-100 rounded-xl py-2 font-medium"
          >
            Limpiar
          </Button>
        </CardContent>
      </Card>

      {/* Resultados */}
      <Card className="rounded-2xl shadow-lg border border-gray-200 bg-white">
        <CardHeader>
          <CardTitle className="flex justify-between items-center text-sm font-medium">
            <span>Resultados</span>
            <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-xs">
              Total: {formatCurrency(calcularTotal())}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="text-center py-6 text-gray-500">Cargando...</div>
          ) : (
            <ComprasTable compras={filteredCompras} onEdit={handleEdit} onDelete={handleDelete} />
          )}
        </CardContent>
      </Card>

      {/* Diálogos Editar / Eliminar */}
      {selectedCompra && (
        <>
          <EditCompraDialog
            compra={selectedCompra}
            open={editOpen}
            onOpenChange={setEditOpen}
            onCompraUpdated={onUpdate}
          />
          <DeleteCompraDialog
            compra={selectedCompra}
            open={delOpen}
            onOpenChange={setDelOpen}
            onCompraDeleted={onUpdate}
          />
        </>
      )}
    </div>
  )
}
