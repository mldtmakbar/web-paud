import type React from "react"
import { Inter, Fredoka } from "next/font/google"
import { AuthProvider } from "@/contexts/auth-context"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
})

const fredoka = Fredoka({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fredoka",
})

export const metadata = {
  title: "TK Ceria - Taman Kanak-Kanak Terbaik",
  description:
    "TK Ceria menyediakan pendidikan berkualitas untuk anak-anak dengan lingkungan yang aman dan menyenangkan.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className={`${inter.variable} ${fredoka.variable} antialiased`}>
      <body className="font-sans bg-background text-foreground">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
