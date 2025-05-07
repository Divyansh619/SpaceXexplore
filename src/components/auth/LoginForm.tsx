import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextInput,
  Button,
  Group,
  Box,
  Divider,
  Text,
  Anchor,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconAlertCircle } from "@tabler/icons-react";
import { useAppStore } from "../../store/app.store";

interface LoginFormProps {
  onToggleForm: () => void;
}

export default function LoginForm({ onToggleForm }: LoginFormProps) {
  const { login, isLoading, error, clearError } = useAppStore();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 6 ? null : "Password should be at least 6 characters",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    await login(values);
    navigate("/");
  };

  return (
    <Box mx="auto">
      <Text size="lg" fw={500} ta="center" mb="md">
      Starlink Station
      </Text>

      {error && (
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Error"
          color="error.6"
          mb="md"
          onClose={clearError}
        >
          {error}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps("email")}
          mb="md"
          styles={{
            label: {
              color: "black",
            },
          }}
        />

        <TextInput
          withAsterisk
          type="password"
          label="Password"
          placeholder="Your password"
          {...form.getInputProps("password")}
          mb="xl"
          styles={{
            label: {
              color: "black",
            },
          }}
        />

        <Button type="submit" fullWidth loading={isLoading}>
          Sign in
        </Button>
      </form>

      <Divider label="Or" labelPosition="center" my="md" />

      <Text ta="center" mt="md">
        Don't have an account?{" "}
        <Anchor size="sm" component="button" onClick={onToggleForm}>
          Register
        </Anchor>
      </Text>
    </Box>
  );
}
