import { useState, useCallback, useEffect } from "react"

const STORAGE_KEY = "theme"

function getInitialTheme(): "dark" | "light" {
  if (typeof window === "undefined") return "light"
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === "dark" || stored === "light") return stored
  } catch { /* noop */ }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
}

function applyTheme(theme: "dark" | "light") {
  document.documentElement.classList.toggle("dark", theme === "dark")
}

applyTheme(getInitialTheme())

export function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme)

  const setTheme = useCallback((next: "dark" | "light") => {
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch { /* noop */ }
    applyTheme(next)
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark"
      try {
        localStorage.setItem(STORAGE_KEY, next)
      } catch { /* noop */ }
      applyTheme(next)
      return next
    })
  }, [])

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && (e.newValue === "dark" || e.newValue === "light")) {
        applyTheme(e.newValue)
        setThemeState(e.newValue)
      }
    }
    window.addEventListener("storage", handler)
    return () => window.removeEventListener("storage", handler)
  }, [])

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return
      } catch { /* noop */ }
      const next = mql.matches ? "dark" : "light"
      applyTheme(next)
      setThemeState(next)
    }
    mql.addEventListener("change", handler)
    return () => mql.removeEventListener("change", handler)
  }, [])

  return { theme, setTheme, toggleTheme } as const
}
