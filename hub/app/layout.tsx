import "./globals.css"
import { Geist_Mono, Inter } from "next/font/google"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { cn } from "@/lib/utils"
import { ClerkProvider } from "@clerk/nextjs"
import MainHeader from "@/layout/header/main-header"
import ConvexAppProvider from "@/components/providers/convex-provider"
import { Toaster } from "@/components/ui/sonner"
import { ui } from "@clerk/ui"

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
        <ClerkProvider ui={ui}>
          <ConvexAppProvider>
            <ThemeProvider forcedTheme="dark">
              <div className="flex min-h-svh flex-col">
                <MainHeader />
                {children}
              </div>
              <Toaster />
            </ThemeProvider>
          </ConvexAppProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
