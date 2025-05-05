import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import Auth from "./pages/Auth/Auth";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import Dashboard from "./pages/Dashboard/Dashboard";
import { AppLayout } from "./components/Layout/AppLayout";
import { LaunchesPage } from "./pages/launches/LaunchesPage";
import { LaunchDetailPage } from "./pages/launches/LaunchDetailPage";
import { StatisticsPage } from "./pages/statistics/StatisticsPage";
import { RocketsPage } from "./pages/rockets/RocketsPage";
import { RocketDetailPage } from "./pages/rockets/RocketDetailPage";

export const routes = [
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppLayout />,
            children: [
              {
                path: "/",
                element: <Dashboard />,
              },
              {
                path: "/rockets",
                element: <RocketsPage />,
              },
              {
                path: "/rockets/:id",
                element: <RocketDetailPage />,
              },
              {
                path: "/launches",
                element: <LaunchesPage />,
              },
              {
                path: "/launches/:id",
                element: <LaunchDetailPage />,
              },
              {
                path: "/statistics",
                element: <StatisticsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
];

const router = createBrowserRouter(routes);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
      cacheTime: 1000 * 60 * 15,
    },
  },
});
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>
);
