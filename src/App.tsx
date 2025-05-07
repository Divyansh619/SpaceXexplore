import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import { theme } from "./theme"; // Custom theme if used
import "./App.scss"; // Ensure this is importing the global styles

export default function App() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top on route change
  }, [pathname]);

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <Outlet />
    </MantineProvider>
  );
}
