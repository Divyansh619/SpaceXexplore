import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
  Button,
  Group,
  Box,
  Divider,
  Text,
  Anchor,
  Alert,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useAppStore } from "../../store/app.store";

interface RegisterFormProps {
  onToggleForm: () => void;
}

export default function RegistrationForm({ onToggleForm }: RegisterFormProps) {
  const { register, isLoading, error, clearError } = useAppStore();
  const navigate = useNavigate();

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 6 ? null : "Password should be at least 6 characters",
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    const { name, email, password } = values;
    await register({ name, email, password });
    navigate("/");
  };

  return (
    <Box mx="auto">
      <Text size="lg" fw={500} ta="center" mb="md">
        Create a new account
      </Text>

      {error && (
        <Alert
          //  icon={<IconAlertCircle size={16} />}
          title="Error"
          color="red"
          mb="md"
          onClose={clearError}
        >
          {error}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          withAsterisk
          label="Name"
          placeholder="John Doe"
          {...form.getInputProps("name")}
          mb="md"
        />

        <TextInput
          withAsterisk
          label="Email"
          placeholder="your@email.com"
          {...form.getInputProps("email")}
          mb="md"
        />

        <PasswordInput
          withAsterisk
          label="Password"
          placeholder="Your password"
          {...form.getInputProps("password")}
          mb="md"
        />

        <PasswordInput
          withAsterisk
          label="Confirm Password"
          placeholder="Confirm your password"
          {...form.getInputProps("confirmPassword")}
          mb="xl"
        />

        <Button type="submit" fullWidth loading={isLoading}>
          Register
        </Button>
      </form>

      <Divider label="Or" labelPosition="center" my="md" />

      <Text ta="center" mt="md">
        Already have an account?{" "}
        <Anchor size="sm" component="button" onClick={onToggleForm}>
          Sign in
        </Anchor>
      </Text>
    </Box>
  );
}
