import { Card, Image, Text, Badge, Button, Group, Stack } from "@mantine/core";
import { IconCalendar, IconRocket } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Launch } from "../../../types/index";

interface LaunchCardProps {
  launch: Launch;
}

export function LaunchCard({ launch }: LaunchCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = () => {
    if (launch.upcoming) {
      return <Badge color="blue">Upcoming</Badge>;
    }
    if (launch.success === true) {
      return <Badge color="green">Successful</Badge>;
    }
    if (launch.success === false) {
      return <Badge color="red">Failed</Badge>;
    }
    return <Badge color="gray">Unknown</Badge>;
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={
            launch.links.patch.small ||
            launch.links.flickr.original[0] ||
            "https://via.placeholder.com/500x300?text=No+Image"
          }
          height={140}
          alt={launch.name}
          fit="contain"
          bg="gray.1"
          p="sm"
        />
      </Card.Section>

      <Stack mt="md" spacing="xs">
        <Group position="apart" noWrap>
          <Text fw={500} lineClamp={1}>
            {launch.name}
          </Text>
          {getStatusBadge()}
        </Group>

        <Group spacing="xs">
          <IconCalendar size={16} />
          <Text size="sm">{formatDate(launch.date_utc)}</Text>
        </Group>

        <Text size="sm" c="dimmed" lineClamp={2}>
          {launch.details || "No details available for this launch."}
        </Text>
      </Stack>

      <Button
        component={Link}
        to={`/launches/${launch.id}`}
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        leftIcon={<IconRocket size={16} />}
      >
        View Details
      </Button>
    </Card>
  );
}
