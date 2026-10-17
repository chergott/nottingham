import { createTheme } from "@mui/material";

/** How wide the page gets, as job-hunter's (Radix Themes' Container size 3). */
export const PAGE_MAX_WIDTH = 880;

/** Sage on near-black green. */
const COLORS = {
  primary: "#a3b8a0",
  secondary: "#6f8f72",
  background: { default: "#121714", paper: "#1b221e" },
  text: { primary: "#e2e8e2", secondary: "#a9b5ab" },
  divider: "rgba(163, 184, 160, 0.16)",
  success: "#8fc79a",
  error: "#e8877c",
};

export const nottinghamTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: COLORS.primary },
    secondary: { main: COLORS.secondary },
    // Notes like the demo banner in sage, not MUI's blue.
    info: { main: COLORS.primary },
    background: COLORS.background,
    text: COLORS.text,
    divider: COLORS.divider,
    success: { main: COLORS.success },
    error: { main: COLORS.error },
  },
  shape: { borderRadius: 8 },
  components: {
    // The paper color with sage text, rather than a sage bar.
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: COLORS.background.paper,
          backgroundImage: "none",
          color: COLORS.primary,
          borderBottom: `1px solid ${COLORS.divider}`,
        },
      },
    },
    MuiPaper: { styleOverrides: { root: { backgroundImage: "none" } } },
  },
});
