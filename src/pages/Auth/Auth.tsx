import { useState } from "react";
import { Navigate } from "react-router-dom";
import {
  Container,
  Paper,
  Title,
  Flex,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconRocket } from "@tabler/icons-react";

import { useAppStore } from "../../store/app.store";
import RegistrationForm from "../../components/auth/RegistrationForm";
import LoginForm from "../../components/auth/LoginForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAppStore();
  const theme = useMantineTheme();

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <div
      style={{
        backgroundImage:
          'url("https://wallpapercat.com/w/full/7/3/6/1278091-3840x2160-desktop-4k-starship-wallpaper.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center top",
        minHeight: "100vh",
        width: "100%",
        position: "relative",
      }}
    >
      <div
        style={{
          backdropFilter: "blur(8px)",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
          width: "100%",
          minHeight: "100vh",
          paddingTop: "2rem",
          paddingBottom: "2rem",
        }}
      >
        <Container size="lg" style={{ height: "100%" }}>
          <Flex
            direction={{ base: "column", md: "row" }}
            gap="lg"
            align="center"
            justify="center"
            style={{ minHeight: "calc(100vh - 4rem)" }} 
          >
            <Stack
              style={{ flex: 1, maxWidth: "400px", textAlign: "center" }}
              justify="center"
              spacing="lg"
              align="center"
            >
              <IconRocket size={64} color={theme.colors.blue[6]} stroke={1.5} />
              <Title align="center" c="white">SpaceX Explorer</Title>
              <Text size="md" align="center" c="gray.3">
                Discover the fascinating world of SpaceX rockets and launches.
                Sign in to access detailed information, track launches, and
                explore the SpaceX mission archive.
              </Text>
            </Stack>

            <Paper
              style={{ flex: 1, maxWidth: "400px", width: "100%" }}
              shadow="md"
              p={30}
              radius="md"
              withBorder
              bg="white"
            >
              {isLogin ? (
                <LoginForm onToggleForm={toggleForm} />
              ) : (
                <RegistrationForm onToggleForm={toggleForm} />
              )}
            </Paper>
          </Flex>
        </Container>
      </div>
    </div>
  );
};

export default AuthPage;
