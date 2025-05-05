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
import { IconRocket } from '@tabler/icons-react';

import { useAppStore } from "../../store/app.store";
import RegistrationForm from "../../components/auth/RegistrationForm";
import LoginForm from "../../components/auth/LoginForm";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAppStore();
  const theme = useMantineTheme();

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const toggleForm = () => setIsLogin(!isLogin);

  return (
    <Container size="lg" py="xl">
      <Flex
        direction={{ base: "column", md: "row" }}
        gap="lg"
        align={{ md: "center" }}
      >
        <Stack style={{ flex: 1 }} h="100%" justify="center" spacing="xl">
          <IconRocket size={64} color={theme.colors.blue[6]} stroke={1.5} />
          <Title>SpaceX Explorer</Title>
          <Text size="lg">
            Discover the fascinating world of SpaceX rockets and launches. Sign
            in to access detailed information, track launches, and explore the
            SpaceX mission archive.
          </Text>
        </Stack>

        <Paper style={{ flex: 1 }} shadow="md" p={30} radius="md" withBorder>
          {isLogin ? (
            <LoginForm onToggleForm={toggleForm} />
          ) : (
            <RegistrationForm onToggleForm={toggleForm} />
          )}
        </Paper>
      </Flex>
    </Container>
  );
};

export default AuthPage;
