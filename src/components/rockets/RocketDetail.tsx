import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Grid,
  Title,
  Text,
  Image,
  Group,
  Badge,
  Button,
  Card,
  SimpleGrid,
  Stack,
  Divider,
  Breadcrumbs,
  Anchor,
  Loader,
  Center,
  Paper,
  List,
} from "@mantine/core";
import {
  IconRocket,
  IconCalendar,
  IconCurrencyDollar,
  IconScale,
  IconEngine,
  IconRuler,
  IconWeight,
  IconChevronLeft,
} from "@tabler/icons-react";
import { getRocketById, getLaunchesByRocketId } from "../../api/spacex";
import { LaunchCard } from "../launches/LaunchCard";

export function RocketDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: rocket,
    isLoading: isLoadingRocket,
    isError: isErrorRocket,
  } = useQuery(["rocket", id], () => getRocketById(id as string));

  const {
    data: launches,
    isLoading: isLoadingLaunches,
    isError: isErrorLaunches,
  } = useQuery(
    ["rocket-launches", id],
    () => getLaunchesByRocketId(id as string),
    { enabled: !!rocket }
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (isLoadingRocket) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (isErrorRocket || !rocket) {
    return (
      <Stack align="center" mt={50}>
        <Text color="red" size="lg">
          Error loading rocket details
        </Text>
        <Button onClick={() => navigate("/rockets")}>Back to Rockets</Button>
      </Stack>
    );
  }

  const items = [
    { title: "Rockets", href: "/rockets" },
    { title: rocket.name, href: "#" },
  ].map((item, index) => (
    <Anchor component={Link} to={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  return (
    <Stack spacing="lg">
      <Breadcrumbs>{items}</Breadcrumbs>

      <Button
        component={Link}
        to="/rockets"
        variant="subtle"
        leftIcon={<IconChevronLeft size={16} />}
        sx={{ width: "fit-content" }}
      >
        Back to Rockets
      </Button>

      {/* Responsive Main Info Grid */}
      <Grid gutter="md">
        <Grid.Col xs={12} md={5}>
          <Image
            src={
              rocket.flickr_images[0] ||
              "https://via.placeholder.com/500x500?text=No+Image"
            }
            alt={rocket.name}
            radius="md"
          />

          <SimpleGrid cols={4} mt="xs" spacing="xs" breakpoints={[{ maxWidth: 'sm', cols: 2 }]}>
            {rocket.flickr_images.slice(1, 5).map((img, i) => (
              <Image
                key={i}
                src={img}
                alt={`${rocket.name} ${i + 1}`}
                radius="sm"
                height={80}
              />
            ))}
          </SimpleGrid>
        </Grid.Col>

        <Grid.Col xs={12} md={7}>
          <Group position="apart" mb="md">
            <Title>{rocket.name}</Title>
            <Badge size="lg" color={rocket.active ? "green" : "red"}>
              {rocket.active ? "Active" : "Inactive"}
            </Badge>
          </Group>

          <Text mb="lg">{rocket.description}</Text>

          <SimpleGrid cols={2} spacing="md" breakpoints={[{ maxWidth: "sm", cols: 1 }]}>
            <Card withBorder padding="sm">
              <Group>
                <IconCalendar size={20} />
                <Text weight={500}>First Flight</Text>
              </Group>
              <Text ml={26}>{formatDate(rocket.first_flight)}</Text>
            </Card>

            <Card withBorder padding="sm">
              <Group>
                <IconCurrencyDollar size={20} />
                <Text weight={500}>Cost per Launch</Text>
              </Group>
              <Text ml={26}>{formatCurrency(rocket.cost_per_launch)}</Text>
            </Card>

            <Card withBorder padding="sm">
              <Group>
                <IconScale size={20} />
                <Text weight={500}>Success Rate</Text>
              </Group>
              <Text ml={26}>{rocket.success_rate_pct}%</Text>
            </Card>

            <Card withBorder padding="sm">
              <Group>
                <IconRuler size={20} />
                <Text weight={500}>Height</Text>
              </Group>
              <Text ml={26}>
                {rocket.height.meters}m / {rocket.height.feet}ft
              </Text>
            </Card>

            <Card withBorder padding="sm">
              <Group>
                <IconWeight size={20} />
                <Text weight={500}>Mass</Text>
              </Group>
              <Text ml={26}>{rocket.mass.kg.toLocaleString()}kg</Text>
            </Card>

            <Card withBorder padding="sm">
              <Group>
                <IconEngine size={20} />
                <Text weight={500}>Engines</Text>
              </Group>
              <Text ml={26}>
                {rocket.engines.number}x {rocket.engines.type}
              </Text>
            </Card>
          </SimpleGrid>

          <Button
  component="a"
  href={rocket.wikipedia}
  target="_blank"
  rel="noopener noreferrer"
  mt="xl"
  variant="outline"
  sx={(theme) => ({
    width: '100%',
    [theme.fn.largerThan('sm')]: {
      width: 'auto',
    },
  })}
>
  Read more on Wikipedia
</Button>
        </Grid.Col>
      </Grid>

      <Divider my="lg" label="Technical Specifications" labelPosition="center" />

      {/* Responsive Specs Grid */}
      <Grid gutter="md">
        <Grid.Col xs={12} md={6}>
          <Paper withBorder p="md">
            <Title order={4} mb="sm">
              Dimensions
            </Title>
            <List>
              <List.Item>
                Height: {rocket.height.meters}m / {rocket.height.feet}ft
              </List.Item>
              <List.Item>
                Diameter: {rocket.diameter.meters}m / {rocket.diameter.feet}ft
              </List.Item>
              <List.Item>
                Mass: {rocket.mass.kg.toLocaleString()}kg /{" "}
                {rocket.mass.lb.toLocaleString()}lb
              </List.Item>
              <List.Item>Stages: {rocket.stages}</List.Item>
              <List.Item>Boosters: {rocket.boosters}</List.Item>
            </List>
          </Paper>
        </Grid.Col>

        <Grid.Col xs={12} md={6}>
          <Paper withBorder p="md">
            <Title order={4} mb="sm">
              Engine Details
            </Title>
            <List>
              <List.Item>Type: {rocket.engines.type}</List.Item>
              <List.Item>Version: {rocket.engines.version}</List.Item>
              <List.Item>Count: {rocket.engines.number}</List.Item>
              <List.Item>Propellant 1: {rocket.engines.propellant_1}</List.Item>
              <List.Item>Propellant 2: {rocket.engines.propellant_2}</List.Item>
              <List.Item>
                Thrust to Weight: {rocket.engines.thrust_to_weight}
              </List.Item>
            </List>
          </Paper>
        </Grid.Col>
      </Grid>

      <Divider my="lg" label="Launches" labelPosition="center" />

      {isLoadingLaunches ? (
        <Center h={150}>
          <Loader />
        </Center>
      ) : isErrorLaunches ? (
        <Text color="red" align="center">
          Error loading launches
        </Text>
      ) : launches && launches.length > 0 ? (
        <>
          <Text mb="md">
            This rocket has been used in {launches.length} launches:
          </Text>
          <SimpleGrid
            cols={3}
            spacing="md"
            breakpoints={[
              { maxWidth: "md", cols: 2 },
              { maxWidth: "sm", cols: 1 },
            ]}
          >
            {launches.slice(0, 6).map((launch) => (
              <LaunchCard key={launch.id} launch={launch} />
            ))}
          </SimpleGrid>
          {launches.length > 6 && (
            <Button
              component={Link}
              to={`/launches?rocket=${rocket.id}`}
              variant="subtle"
              mt="md"
            >
              View all {launches.length} launches
            </Button>
          )}
        </>
      ) : (
        <Text align="center" italic>
          No launches found for this rocket
        </Text>
      )}
    </Stack>
  );
}
