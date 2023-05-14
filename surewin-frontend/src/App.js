// routes
import Router from "./routes";
// theme
import ThemeProvider from "./theme";
// components
import ScrollToTop from "./components/ScrollToTop";
import { BaseOptionChartStyle } from "./components/chart/BaseOptionChart";

// ----------------------------------------------------------------------

export default function App() {
  let pageReloaded = window.performance
    .getEntriesByType("navigation")
    .map((nav) => nav.type)
    .includes("reload");
  window.onbeforeunload = () => {
    if (pageReloaded === false) {
      if (localStorage.getItem("remember") === "false") {
        localStorage.clear();
      }
    }
  };
  window.onload = () => {
    if (pageReloaded === false) {
      window.location.reload();
      if (localStorage.getItem("remember") === "false") {
        localStorage.clear();
      }
    }
  };
  return (
    <ThemeProvider>
      <ScrollToTop />
      <BaseOptionChartStyle />
      <Router />
    </ThemeProvider>
  );
}
