# Nottingham

A stock portfolio tracker: the stocks you hold, what they're worth, and how they've done
today or since you bought them.

I first built it in 2016 with Ember 2.7, storing orders in Firebase and getting quotes from
Yahoo's YQL service (that version is in this repo's git history). In 2024 I rebuilt it as a
page of my private react-app repo, with MUI and made-up quotes. This is that 2024 version,
on its own with Vite, React, and MUI: a toolbar with the portfolio's value and its gain or
loss for the day or all time, over a grid of the stocks held. The companies are real (AAPL,
MSFT, NVDA, and so on), but their quotes and the holdings are made up, anew on each load and
refresh (`src/data/sampleData.ts`).

## Development

```powershell
npm install
npm run dev     # http://localhost:5174
npm test        # the portfolio math and sample data
npm run build   # into dist/
```

Stocks, with their orders and quotes, come through `PortfolioStore` (`src/data/portfolioStore.ts`), so a real
quote provider could replace the sample data.

## Demo on chergott.com

`npm run build:demo` builds into `dist-demo/` for chergott.com/demos/nottingham. On each
push to `master`, the `Demo package` workflow (`.github/workflows/demo-package.yml`)
tests, builds, and publishes it to GitHub Packages as `@chergott/nottingham-demo`
(`demo-package/`), versioned `1.0.<run number>`; that version shows in the app bar, and a
local build shows "dev" and the commit. chergott-site depends on the package and picks
up a new version with `npm update @chergott/nottingham-demo`.
