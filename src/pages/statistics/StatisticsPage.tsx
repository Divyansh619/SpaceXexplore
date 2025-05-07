import { useState } from "react";
import {
  Stack,
  Title,
  Paper,
  SimpleGrid,
  Select,
  RingProgress,
  Text,
  Center,
  Group,
  Card,
  Divider,
  Badge,
  Tooltip,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getRockets, getLaunches } from "../../api/spacex";
import {
  IconArrowUp,
  IconArrowDown,
  IconCircleCheck,
  IconCircleX,
  IconClock,
} from "@tabler/icons-react";

export function StatisticsPage() {
  const [yearFilter, setYearFilter] = useState<string>("all");

  const { data: rockets } = useQuery(["rockets-stats"], () => getRockets());
  const { data: launches } = useQuery(["launches-stats"], () => getLaunches());

  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: "all", label: "All Years" },
    ...Array.from({ length: currentYear - 2005 }, (_, i) => ({
      value: (2006 + i).toString(),
      label: (2006 + i).toString(),
    })),
  ];

  const filteredLaunches = launches?.data.filter((launch) => {
    if (yearFilter === "all") return true;
    const launchYear = new Date(launch.date_utc).getFullYear().toString();
    return launchYear === yearFilter;
  });

  const totalLaunches = filteredLaunches?.length || 0;
  const successfulLaunches =
    filteredLaunches?.filter((l) => l.success === true).length || 0;
  const failedLaunches =
    filteredLaunches?.filter((l) => l.success === false).length || 0;
  const upcomingLaunches =
    filteredLaunches?.filter((l) => l.upcoming).length || 0;

  const successRate =
    successfulLaunches + failedLaunches > 0
      ? (
          (successfulLaunches / (successfulLaunches + failedLaunches)) *
          100
        ).toFixed(1)
      : "0";

  const launchesByRocket = rockets?.data
    .map((rocket) => {
      const rocketLaunches =
        filteredLaunches?.filter((l) => l.rocket === rocket.id) || [];
      return {
        rocketId: rocket.id,
        rocketName: rocket.name,
        totalLaunches: rocketLaunches.length,
        successful: rocketLaunches.filter((l) => l.success === true).length,
        failed: rocketLaunches.filter((l) => l.success === false).length,
        upcoming: rocketLaunches.filter((l) => l.upcoming).length,
      };
    })
    .sort((a, b) => b.totalLaunches - a.totalLaunches);

  return (
    <Stack spacing="lg">
      <Group position="apart">
        <Title order={2}>🚀 Launch Statistics</Title>
        <Select
          placeholder="Filter by year"
          value={yearFilter}
          onChange={(value) => setYearFilter(value || "all")}
          data={yearOptions}
          w={160}
        />
      </Group>

      <SimpleGrid
        cols={4}
        spacing="lg"
        breakpoints={[
          { maxWidth: "md", cols: 2 },
          { maxWidth: "xs", cols: 1 },
        ]}
      >
        <StatCard
          label="Total Launches"
          value={totalLaunches}
          subLabel={yearFilter === "all" ? "All time" : `in ${yearFilter}`}
        />
        <StatCard
          label="Success Rate"
          value={`${successRate}%`}
          subLabel={`${successfulLaunches} successful`}
          icon={<IconCircleCheck size={20} color="green" />}
        />
        <StatCard
          label="Failed Launches"
          value={failedLaunches}
          subLabel={`${(
            (failedLaunches / (successfulLaunches + failedLaunches)) *
            100
          ).toFixed(1)}% failure rate`}
          icon={<IconCircleX size={20} color="red" />}
        />
        <StatCard
          label="Upcoming"
          value={upcomingLaunches}
          subLabel="Scheduled launches"
          icon={<IconClock size={20} color="blue" />}
        />
      </SimpleGrid>

      <Divider label="Rocket-wise Performance" labelPosition="center" my="md" />

      <SimpleGrid
        cols={3}
        spacing="lg"
        breakpoints={[
          { maxWidth: "md", cols: 2 },
          { maxWidth: "xs", cols: 1 },
        ]}
      >
        {launchesByRocket?.slice(0, 6).map((rocket) => (
          <Paper
            key={rocket.rocketId}
            withBorder
            shadow="sm"
            radius="md"
            p="md"
          >
            <Group position="apart" mb="xs">
              <Title order={4}>{rocket.rocketName}</Title>
              <Badge variant="light" color="gray">
                {rocket.totalLaunches} launches
              </Badge>
            </Group>
            <Group position="center" mt="md">
              <RingProgress
                size={120}
                thickness={12}
                roundCaps
                sections={[
                  {
                    value:
                      (rocket.successful / rocket.totalLaunches) * 100 || 0,
                    color: "green",
                  },
                  {
                    value: (rocket.failed / rocket.totalLaunches) * 100 || 0,
                    color: "red",
                  },
                  {
                    value: (rocket.upcoming / rocket.totalLaunches) * 100 || 0,
                    color: "blue",
                  },
                ]}
                label={
                  <Center>
                    <Text fw={700} ta="center" size="lg">
                      {rocket.totalLaunches}
                    </Text>
                  </Center>
                }
              />
            </Group>
            <Stack mt="md" spacing={6}>
              <StatItem
                label="Successful"
                value={rocket.successful}
                color="green"
              />
              <StatItem label="Failed" value={rocket.failed} color="red" />
              <StatItem label="Upcoming" value={rocket.upcoming} color="blue" />
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    </Stack>
  );
}

function StatCard({
  label,
  value,
  subLabel,
  icon,
}: {
  label: string;
  value: string | number;
  subLabel?: string;
  icon?: React.ReactNode;
}) {
  return (
    <Card withBorder radius="md" shadow="sm" p="md">
      <Group position="apart" mb="xs">
        <Text size="sm" weight={500}>
          {label}
        </Text>
        {icon}
      </Group>
      <Text size="xl" weight={700}>
        {value}
      </Text>
      <Text size="sm" color="dimmed">
        {subLabel}
      </Text>
    </Card>
  );
}

function StatItem({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Group spacing="xs">
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: color,
        }}
      />
      <Text size="sm">
        {label}: {value}
      </Text>
    </Group>
  );
}
