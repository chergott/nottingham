import { Alert } from "@mui/material";

/** Says up front what kind of demo this is. */
export function DemoBanner() {
  return (
    <Alert severity="info" variant="outlined">
      Nottingham is a stock portfolio tracker I built, rebuilt as a demo. The quotes and
      holdings are made up, and the refresh button makes up new ones.
    </Alert>
  );
}
