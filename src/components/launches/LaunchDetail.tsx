import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Title,
  Text,
  Image,
  Group,
  Badge,
  Button,
  Card,
  SimpleGrid,
  Stack,
  Grid,
  Divider,
  Breadcrumbs,
  Anchor,
  Loader,
  Center,
  Paper,
  List,
  ThemeIcon,
} from "@mantine/core";
import {
  IconCalendar,
  IconChevronLeft,
  IconRocket,
  IconMap2,
  IconLink,
  IconBrandYoutube,
  IconArticle,
  IconCircleCheck,
  IconCircleX,
  IconInfoCircle,
} from "@tabler/icons-react";
import {
  getLaunchById,
  getRocketById,
  getLaunchPadById,
} from "../../api/spacex";

export function LaunchDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const {
    data: launch,
    isLoading: isLoadingLaunch,
    isError: isErrorLaunch,
  } = useQuery(["launch", id], () => getLaunchById(id as string));

  // Data enrichment: get rocket details
  const { data: rocket, isLoading: isLoadingRocket } = useQuery(
    ["rocket", launch?.rocket],
    () => getRocketById(launch?.rocket as string),
    { enabled: !!launch?.rocket }
  );

  // Data enrichment: get launchpad details
  const { data: launchpad, isLoading: isLoadingLaunchpad } = useQuery(
    ["launchpad", launch?.launchpad],
    () => getLaunchPadById(launch?.launchpad as string),
    { enabled: !!launch?.launchpad }
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoadingLaunch) {
    return (
      <Center h={400}>
        <Loader size="lg" />
      </Center>
    );
  }

  if (isErrorLaunch || !launch) {
    return (
      <Stack align="center" mt={50}>
        <Text color="red" size="lg">
          Error loading launch details
        </Text>
        <Button onClick={() => navigate("/launches")}>Back to Launches</Button>
      </Stack>
    );
  }

  const items = [
    { title: "Launches", href: "/launches" },
    { title: launch.name, href: "#" },
  ].map((item, index) => (
    <Anchor component={Link} to={item.href} key={index}>
      {item.title}
    </Anchor>
  ));

  const getStatusBadge = () => {
    if (launch.upcoming) {
      return (
        <Badge size="lg" color="blue">
          Upcoming
        </Badge>
      );
    }
    if (launch.success === true) {
      return (
        <Badge size="lg" color="green">
          Successful
        </Badge>
      );
    }
    if (launch.success === false) {
      return (
        <Badge size="lg" color="red">
          Failed
        </Badge>
      );
    }
    return (
      <Badge size="lg" color="gray">
        Unknown
      </Badge>
    );
  };

  return (
    <Stack spacing="lg">
      <Breadcrumbs>{items}</Breadcrumbs>

      <Button
        component={Link}
        to="/launches"
        variant="subtle"
        leftIcon={<IconChevronLeft size={16} />}
        sx={{ width: "fit-content" }}
      >
        Back to Launches
      </Button>

      <Grid>
        <Grid.Col span={4}>
          <Paper withBorder p="md">
            <Image
              src={
                launch.links.patch.large ||
                launch.links.flickr.original[0] ||
                "https://via.placeholder.com/400x400?text=No+Image"
              }
              alt={launch.name}
              radius="md"
              fit="contain"
              height={250}
              bg="gray.1"
            />

            {launch.links.flickr.original.length > 0 && (
              <SimpleGrid cols={3} mt="xs" spacing="xs">
                {launch.links.flickr.original.slice(0, 3).map((img, i) => (
                  <Image
                    key={i}
                    src={img}
                    alt={`Launch image ${i + 1}`}
                    radius="sm"
                    height={80}
                  />
                ))}
              </SimpleGrid>
            )}

            <Group position="center" mt="md" spacing="md">
              {launch.links.webcast && (
                <Button
                  component="a"
                  href={launch.links.webcast}
                  target="_blank"
                  rel="noopener noreferrer"
                  leftIcon={<IconBrandYoutube size={18} />}
                  variant="filled"
                  color="red"
                >
                  Watch Webcast
                </Button>
              )}

              {launch.links.article && (
                <Button
                  component="a"
                  href={launch.links.article}
                  target="_blank"
                  rel="noopener noreferrer"
                  leftIcon={<IconArticle size={18} />}
                  variant="outline"
                >
                  Read Article
                </Button>
              )}
            </Group>
          </Paper>
        </Grid.Col>

        <Grid.Col span={8}>
          <Card withBorder p="md">
            <Group position="apart" mb="md">
              <Title>{launch.name}</Title>
              {getStatusBadge()}
            </Group>

            <Group mb="md">
              <IconCalendar size={18} />
              <Text>{formatDate(launch.date_utc)}</Text>
            </Group>

            <Text mb="lg">
              {launch.details ||
                "No detailed description available for this launch."}
            </Text>

            <Divider my="md" label="Mission Details" labelPosition="center" />

            <Grid>
              <Grid.Col span={6}>
                <Card withBorder padding="sm" mb="md">
                  <Group>
                    <IconRocket size={18} />
                    <Text weight={500}>Rocket</Text>
                  </Group>
                  {isLoadingRocket ? (
                    <Loader size="sm" ml={26} mt="xs" />
                  ) : rocket ? (
                    <Group ml={26} mt="xs">
                      <Text>{rocket.name}</Text>
                      <Button
                        component={Link}
                        to={`/rockets/${rocket.id}`}
                        size="xs"
                        variant="subtle"
                      >
                        View Rocket
                      </Button>
                    </Group>
                  ) : (
                    <Text ml={26} color="dimmed" size="sm">
                      Rocket information unavailable
                    </Text>
                  )}
                </Card>

                <Card withBorder padding="sm">
                  <Group>
                    <IconMap2 size={18} />
                    <Text weight={500}>Launch Site</Text>
                  </Group>
                  {isLoadingLaunchpad ? (
                    <Loader size="sm" ml={26} mt="xs" />
                  ) : launchpad ? (
                    <Stack ml={26} mt="xs" spacing={5}>
                      <Text>{launchpad.name}</Text>
                      <Text size="sm" color="dimmed">
                        {launchpad.locality}, {launchpad.region}
                      </Text>
                    </Stack>
                  ) : (
                    <Text ml={26} color="dimmed" size="sm">
                      Launchpad information unavailable
                    </Text>
                  )}
                </Card>
              </Grid.Col>

              <Grid.Col span={6}>
                <Card withBorder padding="sm" h="100%">
                  <Text weight={500} mb="sm">
                    Mission Status
                  </Text>

                  {launch.upcoming ? (
                    <List spacing="xs" center>
                      <List.Item
                        icon={
                          <ThemeIcon color="blue" size={20} radius="xl">
                            <IconInfoCircle size={14} />
                          </ThemeIcon>
                        }
                      >
                        Mission is scheduled for future launch
                      </List.Item>
                      {launch.date_precision && (
                        <List.Item>
                          Date precision: {launch.date_precision}
                        </List.Item>
                      )}
                    </List>
                  ) : launch.success ? (
                    <List spacing="xs" center>
                      <List.Item
                        icon={
                          <ThemeIcon color="green" size={20} radius="xl">
                            <IconCircleCheck size={14} />
                          </ThemeIcon>
                        }
                      >
                        Mission completed successfully
                      </List.Item>
                    </List>
                  ) : (
                    <List spacing="xs" center>
                      <List.Item
                        icon={
                          <ThemeIcon color="red" size={20} radius="xl">
                            <IconCircleX size={14} />
                          </ThemeIcon>
                        }
                      >
                        Mission failed
                      </List.Item>
                      {launch.failures &&
                        launch.failures.length > 0 &&
                        launch.failures.map((failure, idx) => (
                          <List.Item key={idx}>{failure.reason}</List.Item>
                        ))}
                    </List>
                  )}
                </Card>
              </Grid.Col>
            </Grid>

            <Divider my="md" label="External Links" labelPosition="center" />

            <SimpleGrid cols={3}>
              {launch.links.reddit.campaign && (
                <Button
                  component="a"
                  href={launch.links.reddit.campaign}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="light"
                >
                  Reddit Campaign
                </Button>
              )}

              {launch.links.wikipedia && (
                <Button
                  component="a"
                  href={launch.links.wikipedia}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="light"
                >
                  Wikipedia
                </Button>
              )}

              {launch.links.presskit && (
                <Button
                  component="a"
                  href={launch.links.presskit}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="light"
                >
                  Press Kit
                </Button>
              )}
            </SimpleGrid>
          </Card>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
