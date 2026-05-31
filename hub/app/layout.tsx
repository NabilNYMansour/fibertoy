import "./globals.css"
import type { Metadata } from "next"
import { Geist_Mono, Inter } from "next/font/google"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { cn } from "@/lib/utils"
import { ClerkProvider } from "@clerk/nextjs"
import MainHeader from "@/components/layout/header/main-header"
import ConvexAppProvider from "@/components/providers/convex-provider"
import { Toaster } from "@/components/ui/sonner"
import { ui } from "@clerk/ui"
import { SITE_URL } from "@/lib/consts"
import { Analytics } from "@vercel/analytics/next"

const siteDescription =
  "Build and share React Three Fiber scenes with the world. Create, browse, and publish interactive 3D experiences in the browser."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FiberToy",
    template: "%s | FiberToy",
  },
  description: siteDescription,
  applicationName: "FiberToy",
  keywords: [
    "FiberToy",
    "React Three Fiber",
    "Three.js",
    "WebGL",
    "3D scenes",
    "creative coding",
    "interactive 3D",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "FiberToy",
    title: "FiberToy",
    description: siteDescription,
    images: [
      {
        url: "/fibertoy.png",
        alt: "FiberToy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FiberToy",
    description: siteDescription,
    images: ["/fibertoy.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
}

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
        <Analytics />
      </body>
    </html>
  )
}
