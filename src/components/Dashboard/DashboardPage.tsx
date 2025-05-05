import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Text,
  Card,
  Group,
  SimpleGrid,
  RingProgress,
  Title,
  Stack,
  Button,
  Paper,
  Grid,
  List,
  ThemeIcon,
} from "@mantine/core";
import {
  IconRocket,
  IconAccessPoint,
  IconChartPie,
  IconCircleCheck,
  IconCircleX,
  IconClockHour4,
  IconArrowRight,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { getRockets, getLaunches } from "../../api/spacex";
import RocketCard from "../rockets/RocketCard";
import { LaunchCard } from "../launches/LaunchCard";

// import { LaunchCard } from '../launches/LaunchCard';

export function DashboardPage() {
  const navigate = useNavigate();

  const { data: rocketData } = useQuery(["dashboard-rockets"], () =>
    getRockets()
  );

  const { data: launchData } = useQuery(["dashboard-launches"], () =>
    getLaunches()
  );

  // Calculate some statistics for the dashboard
  const stats = {
    activeRockets: rocketData?.data.filter((r: any) => r.active).length || 0,
    totalRockets: rocketData?.data.length || 0,
    upcomingLaunches:
      launchData?.data.filter((l: any) => l.upcoming).length || 0,
    successfulLaunches:
      launchData?.data.filter((l) => l.success === true).length || 0,
    failedLaunches:
      launchData?.data.filter((l) => l.success === false).length || 0,
    totalLaunches: launchData?.totalCount || 0,
  };

  // Calculate success rate
  const completedLaunches = stats.successfulLaunches + stats.failedLaunches;
  const successRate =
    completedLaunches > 0
      ? Math.round((stats.successfulLaunches / completedLaunches) * 100)
      : 0;

  return (
    <Stack spacing="lg">
      <Title>Dashboard</Title>

      <SimpleGrid cols={3} breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
        <Card withBorder p="md">
          <Group position="apart">
            <Text weight={500}>Rockets</Text>
            <IconRocket size={20} />
          </Group>

          <Group position="apart" mt="md">
            <div>
              <Text size="xl" weight={700}>
                {stats.totalRockets}
              </Text>
              <Text size="xs" color="dimmed">
                Total rockets
              </Text>
            </div>

            <RingProgress
              size={80}
              thickness={8}
              sections={[
                {
                  value: (stats.activeRockets / stats.totalRockets) * 100,
                  color: "blue",
                },
              ]}
              label={
                <Text size="xs" ta="center" fw={700}>
                  {Math.round((stats.activeRockets / stats.totalRockets) * 100)}
                  %
                </Text>
              }
            />
          </Group>

          <Text size="sm" mt="md">
            {stats.activeRockets} active rockets out of {stats.totalRockets}{" "}
            total
          </Text>

          <Button
            variant="light"
            fullWidth
            mt="md"
            onClick={() => navigate("/rockets")}
            rightIcon={<IconArrowRight size={16} />}
          >
            View All Rockets
          </Button>
        </Card>

        <Card withBorder p="md">
          <Group position="apart">
            <Text weight={500}>Launches</Text>
            <IconAccessPoint size={20} />
          </Group>

          <Group position="apart" mt="md">
            <div>
              <Text size="xl" weight={700}>
                {stats.totalLaunches}
              </Text>
              <Text size="xs" color="dimmed">
                Total launches
              </Text>
            </div>

            <RingProgress
              size={80}
              thickness={8}
              sections={[
                { value: successRate, color: "green" },
                { value: 100 - successRate, color: "red" },
              ]}
              label={
                <Text size="xs" ta="center" fw={700}>
                  {successRate}%
                </Text>
              }
            />
          </Group>

          <Text size="sm" mt="md">
            {stats.successfulLaunches} successful, {stats.failedLaunches} failed
          </Text>

          <Button
            variant="light"
            fullWidth
            mt="md"
            onClick={() => navigate("/launches")}
            rightIcon={<IconArrowRight size={16} />}
          >
            View All Launches
          </Button>
        </Card>

        <Card withBorder p="md">
          <Group position="apart">
            <Text weight={500}>Upcoming</Text>
            <IconClockHour4 size={20} />
          </Group>

          <Text size="xl" weight={700} mt="md">
            {stats.upcomingLaunches}
          </Text>
          <Text size="xs" color="dimmed">
            Scheduled launches
          </Text>

          <List spacing="sm" mt="md">
            {launchData?.data
              .filter((l: any) => l.upcoming)
              .slice(0, 3)
              .map((launch: any) => (
                <List.Item key={launch.id}>
                  {launch.name} (
                  {new Date(launch.date_utc).toLocaleDateString()})
                </List.Item>
              ))}
          </List>

          <Button
            variant="light"
            fullWidth
            mt="md"
            onClick={() => navigate("/launches?status=upcoming")}
            rightIcon={<IconArrowRight size={16} />}
          >
            View Upcoming Launches
          </Button>
        </Card>
      </SimpleGrid>

      <Grid>
        <Grid.Col span={6}>
          <Paper withBorder p="md">
            <Group position="apart" mb="md">
              <Title order={3}>Latest Rockets</Title>
              <Button
                variant="subtle"
                onClick={() => navigate("/launches")}
                rightIcon={<IconArrowRight size={16} />}
              >
                View All
              </Button>
            </Group>

            <SimpleGrid
              cols={2}
              spacing="md"
              breakpoints={[{ maxWidth: "sm", cols: 1 }]}
            >
              {rocketData?.data.slice(0, 2).map((rocket: any) => (
                <RocketCard key={rocket.id} rocket={rocket} />
              ))}
            </SimpleGrid>
          </Paper>
        </Grid.Col>

        <Grid.Col span={6}>
          <Paper withBorder p="md">
            <Group position="apart" mb="md">
              <Title order={3}>Recent Launches</Title>
              <Button
                variant="subtle"
                onClick={() => navigate("/launches")}
                rightIcon={<IconArrowRight size={16} />}
              >
                View All
              </Button>
            </Group>

            <SimpleGrid
              cols={2}
              spacing="md"
              breakpoints={[{ maxWidth: "sm", cols: 1 }]}
            >
              {launchData?.data.slice(0, 2).map((launch) => (
                <LaunchCard key={launch.id} launch={launch} />
              ))}
            </SimpleGrid>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
