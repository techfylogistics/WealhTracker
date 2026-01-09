import React, { createContext, useContext, useMemo, useState } from "react"
import type { ThemeTokens } from "./theme.tokens"
import { LightTheme, BlueTheme, PinkTheme } from "./theme.tokens"

export type ThemeName = "light" | "blue" | "pink"

const THEMES = {
  light: LightTheme,
  blue: BlueTheme,
  pink: PinkTheme,
} satisfies Record<ThemeName, ThemeTokens>

type ThemeContextValue = {
  themeName: ThemeName
  theme: ThemeTokens
  setTheme: (name: ThemeName) => void
}

const ThemeContext = createContext<ThemeContextValue>({
  themeName: "light",
  theme: LightTheme,
  setTheme: () => { },
})

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [themeName, setThemeName] = useState<ThemeName>("light")

  const value = useMemo(
    () => ({
      themeName,
      theme: THEMES[themeName],
      setTheme: setThemeName,
    }),
    [themeName]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
