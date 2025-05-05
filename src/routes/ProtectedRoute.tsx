import { Navigate, Outlet } from "react-router-dom";
import { useAppStore } from "../store/app.store";
import { Center, Loader } from "@mantine/core";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAppStore();

  if (isLoading) {
    return (
      <Center style={{ height: "100vh" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return <Outlet />;
}
