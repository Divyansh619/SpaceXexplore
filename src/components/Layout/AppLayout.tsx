import { useState, useEffect } from "react";
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
  MediaQuery,
  ActionIcon,
  Box,
} from "@mantine/core";
import { IconLogout, IconRocket, IconX } from "@tabler/icons-react";
import { useAppStore } from "../../store/app.store";
import { MainNavigation } from "./MainNavigation";

export const AppLayout = () => {
  const [opened, setOpened] = useState(false);
  const { user, logout } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (opened) {
      // Disable scrolling when the sidebar is open
      document.body.style.overflow = 'hidden';
    } else {
      // Enable scrolling when the sidebar is closed
      document.body.style.overflow = '';
    }

    // Cleanup the effect when the component is unmounted
    return () => {
      document.body.style.overflow = '';
    };
  }, [opened]);

  return (
    <AppShell
      padding="md"
      navbarOffsetBreakpoint="sm"
      asideOffsetBreakpoint="sm"
      navbar={
        <>
          {/* Desktop Navbar */}
          <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
            <Navbar
              p="md"
              width={{ base: 200, sm: 200, lg: 300 }}
              hiddenBreakpoint="sm"
              hidden={!opened}
              style={{ zIndex: 200 }}
            >
              <Navbar.Section grow>
                <MainNavigation />
              </Navbar.Section>
            </Navbar>
          </MediaQuery>

          {/* Mobile Sidebar Overlay + Navigation */}
          {opened && (
            <>
              {/* Overlay Background */}
              <Box
                onClick={() => setOpened(false)}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  zIndex: 999,
                }}
              />

              {/* Sidebar */}
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Box
                  style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "100vh",
                    width: "80vw",
                    backgroundColor: "white",
                    zIndex: 1000,
                    boxShadow: "2px 0 12px rgba(0, 0, 0, 0.2)",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Group position="right" mb="sm">
                    <ActionIcon variant="light" color="red" onClick={() => setOpened(false)}>
                      <IconX size={20} />
                    </ActionIcon>
                  </Group>

                  {/* Main Navigation */}
                  <Navbar.Section grow>
                    <MainNavigation />
                  </Navbar.Section>

                  {/* User name at the bottom */}
                  <Navbar.Section style={{ marginTop: "auto" }}>
                    {/* Menu with Logout Option */}
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
                        <Menu.Item
                          color="red"
                          icon={<IconLogout size={14} />}
                          onClick={logout}
                        >
                          Logout
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Navbar.Section>
                </Box>
              </MediaQuery>
            </>
          )}
        </>
      }
      header={
        <Header height={60} style={{ zIndex: 201 }}>
          <Group h="100%" px={{ base: 10, sm: 20 }} position="apart" align="center">
            <Group>
              {/* Hamburger in Header on Mobile */}
              <MediaQuery largerThan="sm" styles={{ display: "none" }}>
                <Burger
                  opened={opened}
                  onClick={() => setOpened((o) => !o)}
                  size="sm"
                  aria-label="Toggle navigation"
                />
              </MediaQuery>

              <UnstyledButton onClick={() => navigate("/")}>
                <Group>
                  <IconRocket size={24} stroke={1.5} />
                  <Title order={3}>SpaceX Explorer</Title>
                </Group>
              </UnstyledButton>
            </Group>

            {/* Profile Menu on Desktop */}
            <MediaQuery smallerThan="sm" styles={{ display: "none" }}>
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
            </MediaQuery>
          </Group>
        </Header>
      }
    >
      <Outlet />
    </AppShell>
  );
};
