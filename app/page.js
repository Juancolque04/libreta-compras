"use client"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { ShoppingBag, ClipboardList } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="h-screen overflow-hidden flex flex-col items-center justify-center bg-neutral-800 text-pink-500 px-4 py-10 -mt-8">
      <div className="w-full max-w-md space-y-8">
        <h1 className="text-center text-4xl font-extrabold tracking-tight">Libreta de Compras</h1>

        <div className="grid gap-6">
          {/* Registrar Compra */}
          <Link href="/registrar" className="w-full">
            <Card className="w-full rounded-2xl border bg-gray-100 border-pink-500 hover:shadow-xl transition-shadow duration-300">
              <CardContent className="flex items-center p-6 space-x-4">
                <div className="bg-pink-100 p-4 rounded-full">
                  <ShoppingBag className="h-7 w-7 text-pink-500" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">Registrar Compra</CardTitle>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Ver Historial */}
          <Link href="/historial" className="w-full">
            <Card className="w-full rounded-2xl border bg-gray-100 border-pink-500 hover:shadow-xl transition-shadow duration-300">
              <CardContent className="flex items-center p-6 space-x-4">
                <div className="bg-pink-100 p-4 rounded-full">
                  <ClipboardList className="h-7 w-7 text-pink-500" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">Ver Historial</CardTitle>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}
