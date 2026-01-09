import { ChartColorKey } from "../view-models/chartColorKey"

export type ChartColors = Record<ChartColorKey, string>
export const chartColors: Record<ChartColorKey, string> = {
  realEstate: "#6CA6FF",
  stocks: "#52D6A3",
  bank: "#4FC3F7",
  gold: "#F7C948",
  other: "#B39DDB",
  liability: "#FF6B6B",
}

export interface ThemeTokens {
  colors: {
    background: string
    surface: string
    card: string
    primary: string
    secondary: string

    textPrimary: string
    textSecondary: string
    textMuted: string

    divider: string

    positive: string
    negative: string
    warning: string

    chart: Record<ChartColorKey, string>
    // chart: {
    //   realEstate: string
    //   stocks: string
    //   bank: string
    //   gold: string
    //   other: string
    //   liability: string
    // }
  }

  spacing: {
    xs: number
    sm: number
    md: number
    lg: number
    xl: number
  }

  radius: {
    sm: number
    md: number
    lg: number
    xl: number
  }

  typography: {
    fontFamily: string

    size: {
      xs: number
      sm: number
      md: number
      lg: number
      xl: number
      xxl: number
    }

    weight: {
      regular: number
      medium: number
      semibold: number
      bold: number
    }
  }

  shadow: {
    sm: string
    md: string
  }
}
// -------------------------------------------------
// Light default /white theme
// ------------------------------------------------

export const LightTheme: ThemeTokens = {
  colors: {
    background: "#FFFFFF",
    surface: "#F7F9FC",
    card: "#FFFFFF",

    primary: "#3B6EF6",
    secondary: "#6B8CFF",

    textPrimary: "#1F2937",
    textSecondary: "#6B7280",
    textMuted: "#9CA3AF",

    divider: "#E6EAF0",

    positive: "#2DBE7E",
    negative: "#E86A6A",
    warning: "#F5A25D",

    chart: chartColors,
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },

  radius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },

  typography: {
    fontFamily: "Inter",

    size: {
      xs: 11,
      sm: 13,
      md: 15,
      lg: 17,
      xl: 20,
      xxl: 24,
    },

    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  shadow: {
    sm: "0px 2px 8px rgba(0,0,0,0.05)",
    md: "0px 6px 20px rgba(0,0,0,0.08)",
  },
}
// -------------------------------------------------
// Light default /white theme
// ------------------------------------------------
export const BlueTheme: ThemeTokens = {
  ...LightTheme,

  colors: {
    ...LightTheme.colors,

    background: "#F2F6FF",
    surface: "#FFFFFF",
    card: "#FFFFFF",

    primary: "#1E40AF",
    secondary: "#3B82F6",
    chart: chartColors,

  },
}
// -------------------------------------------------
// Pinkish  soft preiumtheme 
// ------------------------------------------------
export const PinkTheme: ThemeTokens = {
  ...LightTheme,

  colors: {
    ...LightTheme.colors,

    background: "#FFF7FB",
    surface: "#FFFFFF",
    card: "#FFFFFF",

    primary: "#E75480",
    secondary: "#F472B6",
    chart: chartColors,
    // chart: {
    //   ...LightTheme.colors.chart,
    //   realEstate: "#EC4899",
    //   stocks: "#F472B6",
    // },
  },
}
