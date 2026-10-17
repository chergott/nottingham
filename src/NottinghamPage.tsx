import { KeyboardArrowDown, KeyboardArrowUp, Refresh } from "@mui/icons-material";
import { Box, IconButton, Paper, Tab, Tabs, Tooltip, Typography } from "@mui/material";
import { DataGrid, type GridColDef, type GridRenderCellParams } from "@mui/x-data-grid";
import { useMemo, useState, type ReactNode } from "react";
import { store, useStocks } from "./data/portfolioStore";
import {
  extendStock,
  gainSign,
  signedDollars,
  signedPercent,
  summarize,
  toNiceNumber,
  type StockExtended,
  type Timeline,
} from "./stocks";

type Cell = GridRenderCellParams<StockExtended>;

/** A cell's content in a row, centered vertically, as data grid cells were in 2024. */
function CellRow({ children }: { children: ReactNode }) {
  return <Box sx={{ alignItems: "center", display: "flex", height: "100%" }}>{children}</Box>;
}

/** Green for a gain, red for a loss, the usual text color for neither. */
function gainColor(amount: number) {
  const sign = gainSign(amount);
  return sign > 0 ? "success.main" : sign < 0 ? "error.main" : "text.primary";
}

/** A signed figure in a grid cell, green or red by its sign. */
function GainCell({ amount, children }: { amount: number; children: ReactNode }) {
  return (
    <CellRow>
      <Typography sx={{ color: gainColor(amount) }}>{children}</Typography>
    </CellRow>
  );
}

/** react-app's Nottingham page (routes/nottingham): the portfolio toolbar over a grid of
 * the stocks held. */
export function NottinghamPage() {
  const stocks = useStocks();
  const [timeline, setTimeline] = useState<Timeline>("day");
  const rows = useMemo(() => stocks.map(extendStock), [stocks]);
  const { totalActiveValue, gainLoss, performance } = summarize(rows, timeline);
  const isAll = timeline === "all";

  const columns: GridColDef<StockExtended>[] = [
    {
      field: "symbol",
      headerName: "Symbol",
      width: 180,
      renderCell: ({ row }: Cell) => (
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: "100%" }}>
          <Box sx={{ alignItems: "baseline", display: "flex" }}>
            <Typography variant="h5" sx={{ lineHeight: 1.2 }}>
              {row.symbol}
            </Typography>
            <Typography sx={{ ml: 1 }} variant="body2">
              {row.activeQuantity} {row.activeQuantity === 1 ? "share" : "shares"}
            </Typography>
          </Box>
          {/* The company's full name, under its symbol. */}
          <Typography variant="caption" noWrap sx={{ color: "text.secondary" }} title={row.name}>
            {row.name}
          </Typography>
        </Box>
      ),
    },
    {
      field: "quote",
      headerName: "Last Trade Price",
      width: 200,
      sortComparator: (a, b) => a.lastTradePrice - b.lastTradePrice,
      renderCell: ({ row }: Cell) => (
        <CellRow>
          <Typography variant="h6">${toNiceNumber(row.quote.lastTradePrice)}</Typography>
          <Typography
            component="span"
            sx={{ alignItems: "center", display: "inline-flex", ml: 1 }}
            variant="body2"
          >
            (
            {row.isDayUp ? (
              <KeyboardArrowUp fontSize="small" color="success" titleAccess="Up" />
            ) : (
              <KeyboardArrowDown fontSize="small" color="error" titleAccess="Down" />
            )}
            ${toNiceNumber(row.dayChange)})
          </Typography>
        </CellRow>
      ),
    },
    {
      field: "dayChange",
      headerName: "Day Change",
      width: 150,
      renderCell: ({ row }: Cell) => (
        <GainCell amount={row.dayChange}>{signedDollars(row.dayChange)}</GainCell>
      ),
    },
    {
      field: isAll ? "activeTotalGainLoss" : "activeDayGainLoss",
      headerName: "Gain / Loss",
      width: 130,
      renderCell: ({ row }: Cell) => {
        const amount = isAll ? row.activeTotalGainLoss : row.activeDayGainLoss;
        return <GainCell amount={amount}>{signedDollars(amount)}</GainCell>;
      },
    },
    {
      field: isAll ? "totalPercentChange" : "dayPercentChange",
      headerName: "Performance",
      width: 160,
      renderCell: ({ row }: Cell) => {
        const percent = isAll ? row.totalPercentChange : row.dayPercentChange;
        return <GainCell amount={percent}>{signedPercent(percent)}</GainCell>;
      },
    },
  ];

  return (
    <Paper variant="outlined">
      {/* The overview: what the portfolio's worth, and how it's done over the timeline. */}
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: 2,
          px: 3,
          pt: 3,
          pb: 1,
        }}
      >
        <Box>
          <Typography variant="overline" sx={{ color: "text.secondary", lineHeight: 1.5 }}>
            Portfolio value
          </Typography>
          <Typography variant="h4" component="p" sx={{ fontWeight: 500 }}>
            ${toNiceNumber(totalActiveValue)}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "flex-end", gap: 1 }}>
          {/* Right-aligned beside the value; left-aligned once it wraps under it. */}
          <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
            <Typography variant="overline" sx={{ color: "text.secondary", lineHeight: 1.5 }}>
              {isAll ? "All time" : "Today"}
            </Typography>
            <Typography
              variant="h5"
              component="p"
              sx={{ color: gainColor(gainLoss), fontWeight: 500 }}
            >
              {signedDollars(gainLoss)}{" "}
              <Typography component="span" sx={{ color: gainColor(performance) }}>
                ({signedPercent(performance)})
              </Typography>
            </Typography>
          </Box>
          <Tooltip title="Refresh">
            <IconButton aria-label="Refresh" onClick={() => store.refresh()}>
              <Refresh />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      <Tabs
        value={timeline}
        onChange={(_event, value: Timeline) => setTimeline(value)}
        aria-label="Timeline"
        sx={{ px: 1 }}
      >
        <Tab label="Day" value="day" />
        <Tab label="All" value="all" />
      </Tabs>
      <DataGrid
        disableColumnMenu
        rowHeight={64}
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel: { page: 0, pageSize: 25 } } }}
        pageSizeOptions={[5, 10, 25]}
        checkboxSelection={false}
      />
    </Paper>
  );
}
