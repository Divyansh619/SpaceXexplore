import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  AppShell,
  Burger,
  Group,
  Avatar,
  Menu,
  Title,
  Text,
  UnstyledButton,
  Navbar,
  Header,
} from "@mantine/core";
import {
  IconLogout,
  IconUser,
  IconSettings,
  IconRocket,
} from "@tabler/icons-react";
import { useAppStore } from "../../store/app.store";
import { MainNavigation } from "./MainNavigation";

export const AppLayout = () => {
  const [opened, setOpened] = useState(false);
  const { user, logout } = useAppStore();
  const navigate = useNavigate();

  return (
    <AppShell
      padding="md"
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <Navbar
          p="md"
          hiddenBreakpoint="sm"
          hidden={!opened}
          width={{ sm: 200, lg: 300 }}
        >
          <MainNavigation />
        </Navbar>
      }
      header={
        <Header height={60}>
          <Group h="100%" px="md" position="apart">
            <Group>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
              />
              <UnstyledButton onClick={() => navigate("/")}>
                <Group>
                  <IconRocket size={24} stroke={1.5} />
                  <Title order={3}>SpaceX Explorer</Title>
                </Group>
              </UnstyledButton>
            </Group>

            <Group>
              <Menu position="bottom-end" shadow="md" width={200}>
                <Menu.Target>
                  <UnstyledButton>
                    <Group>
                      <Avatar color="blue" radius="xl">
                        {user?.name.charAt(0) || "U"}
                      </Avatar>
                      <div style={{ flex: 1 }}>
                        <Text size="sm" fw={500}>
                          {user?.name || "User"}
                        </Text>
                        <Text c="dimmed" size="xs">
                          {user?.email || ""}
                        </Text>
                      </div>
                    </Group>
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label>Account</Menu.Label>
                  <Menu.Item icon={<IconUser size={14} />}>Profile</Menu.Item>
                  <Menu.Item icon={<IconSettings size={14} />}>
                    Settings
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    color="red"
                    icon={<IconLogout size={14} />}
                    onClick={logout}
                  >
                    Logout
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Header>
      }
    >
      <Outlet />
    </AppShell>
  );
};