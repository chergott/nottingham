import { Tooltip } from "@radix-ui/themes";
import { Link, pageUrl, type Route } from "./router";
import { APP_VERSION, displayVersion } from "./version";

/** The app's name and version on the left, then its two pages. */
export function NavBar({ current }: { current: Route["page"] }) {
  return (
    <nav className="nav" aria-label="Main">
      <Link to="/stocks" className="nav-brand">
        <img src={pageUrl("/favicon.svg")} alt="" className="nav-logo" />
        Nottingham
      </Link>
      {/* Which build is rendering, e.g. the demo package's version on chergott.com. */}
      <Tooltip content={`Version ${APP_VERSION}`}>
        <span className="nav-version">{displayVersion()}</span>
      </Tooltip>
      <div className="nav-links">
        <Link
          to="/stocks"
          className="nav-link"
          aria-current={current === "stocks" ? "page" : undefined}
        >
          Stocks
        </Link>
        <Link
          to="/stocks/new"
          className="nav-link"
          aria-current={current === "new" ? "page" : undefined}
        >
          Add
        </Link>
      </div>
    </nav>
  );
}
