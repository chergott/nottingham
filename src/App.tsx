import { Box, Container, ThemeProvider } from "@mui/material";
import { AppBar } from "./AppBar";
import { DemoBanner } from "./DemoBanner";
import { NottinghamPage } from "./NottinghamPage";
import { nottinghamTheme, PAGE_MAX_WIDTH } from "./theme";

export function App() {
  return (
    <ThemeProvider theme={nottinghamTheme}>
      <Box
        sx={(theme) => ({
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        })}
      >
        <AppBar />
        {/* As wide as job-hunter's page at most, with its padding. */}
        <Container
          maxWidth={false}
          sx={{
            maxWidth: PAGE_MAX_WIDTH,
            px: 2,
            py: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <DemoBanner />
          <NottinghamPage />
        </Container>
      </Box>
    </ThemeProvider>
  );
}
