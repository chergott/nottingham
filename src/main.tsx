import "@radix-ui/themes/styles.css";
import "./styles.css";

import { Theme } from "@radix-ui/themes";
import { StrictMode, useSyncExternalStore } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

/** Follows the operating system's light/dark setting, updating live. */
function useSystemAppearance(): "light" | "dark" {
  const dark = useSyncExternalStore(
    (onChange) => {
      darkQuery.addEventListener("change", onChange);
      return () => darkQuery.removeEventListener("change", onChange);
    },
    () => darkQuery.matches,
  );
  return dark ? "dark" : "light";
}

function Root() {
  // Teal, as in the 2016 app's palette.
  return (
    <Theme appearance={useSystemAppearance()} accentColor="teal" grayColor="sage">
      <App />
    </Theme>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
