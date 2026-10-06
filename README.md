# Nottingham

A stock portfolio tracker: add your stock orders (symbol, buy or sell, order type, price,
quantity, date) and see each one's asking price, today's return, and total return.

I built it in 2016 with Ember 2.7, storing orders in Firebase and getting quotes from
Yahoo's YQL service. That service was shut down in 2019 and the Ember toolchain no longer
builds, so it's rebuilt here with Vite, React, and Radix Themes as a demo: the companies
and quotes are made up (`src/data/sampleData.ts`), and changes reset when you reload. The
Ember version is in the git history.

## Development

```powershell
npm install
npm run dev     # http://localhost:5174
npm test        # the return calculations
npm run build   # into dist/
```

Quotes and orders come through `PortfolioStore` (`src/data/portfolioStore.ts`), so a real
quote provider could replace the sample data.

## Demo on chergott.com

`npm run build:demo` builds into `dist-demo/` for chergott.com/demos/nottingham. On each
push to `master`, the `Demo package` workflow (`.github/workflows/demo-package.yml`)
tests, builds, and publishes it to GitHub Packages as `@chergott/nottingham-demo`
(`demo-package/`), versioned `1.0.<run number>`; that version shows in the nav, and a
local build shows "dev" and the commit. chergott-site depends on the package and picks
up a new version with `npm update @chergott/nottingham-demo`.
