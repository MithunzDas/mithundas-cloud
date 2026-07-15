export const colors = {
  background: {
    app: "#070A0F",
    surface: "#0D1118",
    elevated: "#121824",
    inset: "#090D14"
  },
  border: {
    subtle: "#202938",
    default: "#2C3648",
    strong: "#3E4B63"
  },
  text: {
    primary: "#F4F7FB",
    secondary: "#AAB6C8",
    muted: "#728096",
    inverse: "#071018"
  },
  accent: {
    cyan: "#45D9FF",
    green: "#64E6A2",
    amber: "#F6C76B",
    red: "#FF6B7A",
    blue: "#6EA8FF"
  },
  status: {
    success: "#64E6A2",
    warning: "#F6C76B",
    error: "#FF6B7A",
    info: "#45D9FF"
  }
} as const;

export const spacing = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  5: "20px",
  6: "24px",
  8: "32px",
  10: "40px",
  12: "48px",
  16: "64px",
  20: "80px",
  24: "96px"
} as const;

export const typography = {
  fonts: {
    sans: "Inter, Geist Sans, sans-serif",
    mono: "Geist Mono, IBM Plex Mono, monospace"
  },
  sizes: {
    display: {
      fontSize: "3.5rem", // 56px
      lineHeight: "4rem"  // 64px
    },
    h1: {
      fontSize: "3rem", // 48px
      lineHeight: "3.5rem" // 56px
    },
    h2: {
      fontSize: "2rem", // 32px
      lineHeight: "2.5rem" // 40px
    },
    h3: {
      fontSize: "1.375rem", // 22px
      lineHeight: "1.875rem" // 30px
    },
    body: {
      fontSize: "1rem", // 16px
      lineHeight: "1.625rem" // 26px
    },
    small: {
      fontSize: "0.875rem", // 14px
      lineHeight: "1.375rem" // 22px
    },
    label: {
      fontSize: "0.75rem", // 12px
      lineHeight: "1.125rem" // 18px
    }
  }
} as const;

export const radius = {
  sm: "4px",
  md: "6px",
  lg: "8px",
  xl: "12px"
} as const;

export const shadows = {
  panel: "0 12px 40px rgba(0,0,0,.28)",
  focus: "0 0 0 3px rgba(69,217,255,.18)",
  status: "inset 0 0 0 1px rgba(255,255,255,.06)"
} as const;

export const motion = {
  fast: "120ms",
  base: "200ms",
  slow: "420ms",
  easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  easeInOut: "cubic-bezier(0.65, 0, 0.35, 1)"
} as const;
