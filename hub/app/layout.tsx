import "./globals.css"
import { Geist_Mono, Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import { ClerkProvider } from "@clerk/nextjs"
import Header from "@/components/header"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-mono",
        inter.variable
      )}
    >
      <body>
        <ClerkProvider>
          <ThemeProvider forcedTheme="dark">
            <div className="flex min-h-svh flex-col">
              <Header />
              {children}
            </div>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
