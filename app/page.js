"use client"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { ShoppingBag, ClipboardList } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900 mb-8">Libreta de Compras</h1>

        <div className="grid gap-4">
          <Link href="/registrar" className="w-full">
            <Card className="w-full hover:shadow-md transition-shadow">
              <CardContent className="flex items-center p-6">
                <div className="bg-pink-100 p-3 rounded-full mr-4">
                  <ShoppingBag className="h-6 w-6 text-pink-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">Registrar Compra</CardTitle>
                  <CardDescription>Añadir una nueva compra al sistema</CardDescription>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/historial" className="w-full">
            <Card className="w-full hover:shadow-md transition-shadow">
              <CardContent className="flex items-center p-6">
                <div className="bg-pink-100 p-3 rounded-full mr-4">
                  <ClipboardList className="h-6 w-6 text-pink-500" />
                </div>
                <div>
                  <CardTitle className="text-xl">Ver Historial</CardTitle>
                  <CardDescription>Consultar y filtrar compras realizadas</CardDescription>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
