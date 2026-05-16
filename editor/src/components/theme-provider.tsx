/* eslint-disable react-refresh/only-export-components */
import * as React from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  disableTransitionOnChange?: boolean
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeProviderContext = React.createContext<
  ThemeProviderState | undefined
>(undefined)

function disableTransitionsTemporarily() {
  const style = document.createElement("style")

  style.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;transition:none!important}"
    )
  )

  document.head.appendChild(style)

  return () => {
    window.getComputedStyle(document.body)

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        style.remove()
      })
    })
  }
}

export function ThemeProvider({
  children,
  disableTransitionOnChange = true,
  ...props
}: ThemeProviderProps) {
  const theme: Theme = "dark"

  const setTheme = React.useCallback((_theme: Theme) => {
    // Intentionally noop.
    // This sandboxed app is always dark mode and does not use localStorage.
  }, [])

  React.useEffect(() => {
    const root = document.documentElement
    const restoreTransitions = disableTransitionOnChange
      ? disableTransitionsTemporarily()
      : null

    root.classList.remove("light", "system")
    root.classList.add("dark")
    root.style.colorScheme = "dark"

    if (restoreTransitions) {
      restoreTransitions()
    }
  }, [disableTransitionOnChange])

  const value = React.useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [setTheme]
  )

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }

  return context
}
