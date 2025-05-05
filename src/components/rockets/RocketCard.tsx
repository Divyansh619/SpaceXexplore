import { Card, Image, Text, Badge, Button, Group, Stack } from "@mantine/core";
import { IconRocket, IconClockHour4, IconScale } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { Rocket } from "../../../types";

interface RocketCardProps {
  rocket: Rocket;
}

export default function RocketCard({ rocket }: RocketCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Card.Section>
        <Image
          src={
            rocket.flickr_images[0] ||
            "https://via.placeholder.com/500x300?text=No+Image"
          }
          height={200}
          alt={rocket.name}
        />
      </Card.Section>

      <Stack mt="md" mb="md">
        <Group position="apart" noWrap>
          <Text fw={500} size="lg">
            {rocket.name}
          </Text>
          <Badge color={rocket.active ? "green" : "red"}>
            {rocket.active ? "Active" : "Inactive"}
          </Badge>
        </Group>

        <Text size="sm" c="dimmed" lineClamp={3}>
          {rocket.description}
        </Text>

        <Group spacing="xs">
          <IconClockHour4 size={16} />
          <Text size="sm">First Flight: {formatDate(rocket.first_flight)}</Text>
        </Group>

        <Group spacing="xs">
          <IconScale size={16} />
          <Text size="sm">Success Rate: {rocket.success_rate_pct}%</Text>
        </Group>
      </Stack>

      <Button
        component={Link}
        to={`/rockets/${rocket.id}`}
        variant="light"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        // leftSection={<IconRocket size={16} />}
      >
        View Details
      </Button>
    </Card>
  );
}
