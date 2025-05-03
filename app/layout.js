import { Inter } from "next/font/google"
import "./app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Libreta de Compras",
  description: "Sistema para registrar y consultar compras",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${inter.className} overflow-hidden touch-none`}>{children}</body>
    </html>
  )
}
