import { AppBar as MuiAppBar, Box, Container, Link, Toolbar, Tooltip, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { PAGE_MAX_WIDTH } from "./theme";
import { APP_VERSION, displayVersion } from "./version";

/** react-app's app bar (components/organisms/AppBar): the app's name and version. */
export function AppBar() {
  return (
    <MuiAppBar color="primary" position="sticky">
      {/* The bar spans the window; what's on it lines up with the page below. */}
      <Container maxWidth={false} disableGutters sx={{ maxWidth: PAGE_MAX_WIDTH, px: 2 }}>
        <Toolbar disableGutters sx={{ alignItems: "center", columnGap: 1 }} variant="dense">
          <Box sx={{ alignItems: "center", display: "flex", flexGrow: 1, columnGap: 1 }}>
            <Link
              color="inherit"
              href={import.meta.env.BASE_URL}
              underline="none"
              variant="h5"
              sx={(theme) => ({
                borderRadius: `${theme.shape.borderRadius}px`,
                padding: theme.spacing(1),
                "&:hover": { backgroundColor: alpha(theme.palette.primary.dark, 0.5) },
              })}
            >
              Nottingham
            </Link>
            {/* Which build is rendering, e.g. the demo package's version on chergott.com. */}
            <Tooltip title={`Version ${APP_VERSION}`}>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {displayVersion()}
              </Typography>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
}
