import { useState } from 'react';
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
  Divider
} from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import { getRockets, getLaunches } from '../../api/spacex';
import { 
  IconArrowUp, 
  IconArrowDown, 
  IconCircleCheck, 
  IconCircleX, 
  IconClock 
} from '@tabler/icons-react';

export function StatisticsPage() {
  const [yearFilter, setYearFilter] = useState<string>('all');

  const { data: rockets } = useQuery(['rockets-stats'], () => getRockets());
  
  const { data: launches } = useQuery(['launches-stats'], () => getLaunches());

  // Generate year options from 2006 (first SpaceX launch) to current year
  const currentYear = new Date().getFullYear();
  const yearOptions = [
    { value: 'all', label: 'All Years' },
    ...Array.from({ length: currentYear - 2005 }, (_, i) => ({
      value: (2006 + i).toString(),
      label: (2006 + i).toString(),
    })),
  ];

  // Filter launches by year if a specific year is selected
  const filteredLaunches = launches?.data.filter(launch => {
    if (yearFilter === 'all') return true;
    const launchYear = new Date(launch.date_utc).getFullYear().toString();
    return launchYear === yearFilter;
  });

  // Calculate statistics
  const totalLaunches = filteredLaunches?.length || 0;
  const successfulLaunches = filteredLaunches?.filter(l => l.success === true).length || 0;
  const failedLaunches = filteredLaunches?.filter(l => l.success === false).length || 0;
  const upcomingLaunches = filteredLaunches?.filter(l => l.upcoming).length || 0;
  
  const successRate = totalLaunches > 0 
    ? ((successfulLaunches / (successfulLaunches + failedLaunches)) * 100).toFixed(1) 
    : '0';

  // Count launches by rocket
  const launchesByRocket = rockets?.data.map(rocket => {
    const rocketLaunches = filteredLaunches?.filter(l => l.rocket === rocket.id) || [];
    return {
      rocketId: rocket.id,
      rocketName: rocket.name,
      totalLaunches: rocketLaunches.length,
      successful: rocketLaunches.filter(l => l.success === true).length,
      failed: rocketLaunches.filter(l => l.success === false).length,
      upcoming: rocketLaunches.filter(l => l.upcoming).length,
    };
  }).sort((a, b) => b.totalLaunches - a.totalLaunches);

  return (
    <Stack spacing="lg">
      <Group position="apart">
        <Title>Launch Statistics</Title>
        
        <Select
          placeholder="Filter by year"
          value={yearFilter}
          onChange={(value) => setYearFilter(value || 'all')}
          data={yearOptions}
          w={150}
        />
      </Group>

      <SimpleGrid cols={4} breakpoints={[
        { maxWidth: 'md', cols: 2 },
        { maxWidth: 'xs', cols: 1 },
      ]}>
        <Card withBorder p="md">
          <Group position="apart">
            <Text>Total Launches</Text>
          </Group>
          <Text size="xl" weight={700} mt="md">
            {totalLaunches}
          </Text>
          <Text size="sm" color="dimmed">
            {yearFilter === 'all' ? 'All time' : `in ${yearFilter}`}
          </Text>
        </Card>
        
        <Card withBorder p="md">
          <Group position="apart">
            <Text>Success Rate</Text>
            <IconCircleCheck size={20} color="green" />
          </Group>
          <Text size="xl" weight={700} mt="md">
            {successRate}%
          </Text>
          <Text size="sm" color="dimmed">
            {successfulLaunches} successful launches
          </Text>
        </Card>
        
        <Card withBorder p="md">
          <Group position="apart">
            <Text>Failed Launches</Text>
            <IconCircleX size={20} color="red" />
          </Group>
          <Text size="xl" weight={700} mt="md">
            {failedLaunches}
          </Text>
          <Text size="sm" color="dimmed">
            {((failedLaunches / (successfulLaunches + failedLaunches)) * 100).toFixed(1)}% failure rate
          </Text>
        </Card>
        
        <Card withBorder p="md">
          <Group position="apart">
            <Text>Upcoming</Text>
            <IconClock size={20} color="blue" />
          </Group>
          <Text size="xl" weight={700} mt="md">
            {upcomingLaunches}
          </Text>
          <Text size="sm" color="dimmed">
            Scheduled launches
          </Text>
        </Card>
      </SimpleGrid>

      <Divider label="Performance by Rocket" labelPosition="center" />

      <SimpleGrid cols={3} breakpoints={[
        { maxWidth: 'md', cols: 2 },
        { maxWidth: 'xs', cols: 1 },
      ]}>
        {launchesByRocket?.slice(0, 6).map(rocketStats => (
          <Paper key={rocketStats.rocketId} withBorder p="md">
            <Title order={4} mb="md">{rocketStats.rocketName}</Title>
            
            <Group position="center" mt="md">
              <RingProgress
                size={120}
                thickness={12}
                sections={[
                  { value: (rocketStats.successful / rocketStats.totalLaunches) * 100 || 0, color: 'green' },
                  { value: (rocketStats.failed / rocketStats.totalLaunches) * 100 || 0, color: 'red' },
                  { value: (rocketStats.upcoming / rocketStats.totalLaunches) * 100 || 0, color: 'blue' },
                ]}
                label={
                  <Center>
                    <Text fw={700} ta="center" size="lg">
                      {rocketStats.totalLaunches}
                    </Text>
                  </Center>
                }
              />
            </Group>
            
            <Stack mt="md" spacing={5}>
              <Group>
                <div style={{ width: 12, height: 12, backgroundColor: 'green', borderRadius: '50%' }} />
                <Text size="sm">Successful: {rocketStats.successful}</Text>
              </Group>
              <Group>
                <div style={{ width: 12, height: 12, backgroundColor: 'red', borderRadius: '50%' }} />
                <Text size="sm">Failed: {rocketStats.failed}</Text>
              </Group>
              <Group>
                <div style={{ width: 12, height: 12, backgroundColor: 'blue', borderRadius: '50%' }} />
                <Text size="sm">Upcoming: {rocketStats.upcoming}</Text>
              </Group>
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
    </Stack>
  );
}