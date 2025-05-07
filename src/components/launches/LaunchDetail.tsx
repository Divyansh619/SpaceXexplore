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
  Container,
  MediaQuery,
  Box,
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
      <Center h={300}>
        <Image
          src="https://cdn.pixabay.com/animation/2022/07/31/06/27/06-27-17-124_512.gif"
          alt="Loading..."
          width={300}
        />
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
    <Container size="xl" px={{ base: "xs", sm: "md" }}>
      <Stack spacing="lg">
        <MediaQuery smallerThan="xs" styles={{ display: "none" }}>
          <Breadcrumbs>{items}</Breadcrumbs>
        </MediaQuery>

        <Button
          component={Link}
          to="/launches"
          variant="subtle"
          leftIcon={<IconChevronLeft size={16} />}
          sx={{ width: "fit-content" }}
        >
          Back to Launches
        </Button>

        <Grid gutter={{ base: "sm", sm: "lg" }}>
          {/* Image and media section - full width on mobile */}
          <Grid.Col xs={12} md={4}>
            <Paper withBorder p="md">
              <Image
                src={
                  launch.links.patch.large ||
                  launch.links.flickr.original[0] ||
                  "https://www.spacex.com/static/images/locations/kennedy.jpg"
                }
                alt={launch.name}
                radius="md"
                fit="contain"
                height={250}
                bg="gray.1"
              />

              {launch.links.flickr.original.length > 0 && (
                <SimpleGrid cols={{ base: 3, xs: 3 }} mt="xs" spacing="xs">
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

              <Group
                position="center"
                mt="md"
                spacing={{ base: "xs", sm: "md" }}
              >
                {launch.links.webcast && (
                  <Button
                    component="a"
                    href={launch.links.webcast}
                    target="_blank"
                    rel="noopener noreferrer"
                    leftIcon={<IconBrandYoutube size={18} />}
                    variant="filled"
                    color="red"
                    size={{ base: "sm", sm: "md" }}
                    fullWidth={true}
                  >
                    <MediaQuery smallerThan="xs" styles={{ display: "none" }}>
                      <span>Watch Webcast</span>
                    </MediaQuery>
                    <MediaQuery largerThan="xs" styles={{ display: "none" }}>
                      <span>Watch</span>
                    </MediaQuery>
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
                    size={{ base: "sm", sm: "md" }}
                    fullWidth={true}
                  >
                    <MediaQuery smallerThan="xs" styles={{ display: "none" }}>
                      <span>Read Article</span>
                    </MediaQuery>
                    <MediaQuery largerThan="xs" styles={{ display: "none" }}>
                      <span>Article</span>
                    </MediaQuery>
                  </Button>
                )}
              </Group>
            </Paper>
          </Grid.Col>

          {/* Details section - full width on mobile */}
          <Grid.Col xs={12} md={8}>
            <Card withBorder p={{ base: "xs", sm: "md" }}>
              <Group position="apart" mb="md" align="flex-start" spacing="xs">
                <Title order={1} size={{ base: "h3", sm: "h2" }}>
                  {launch.name}
                </Title>
                {getStatusBadge()}
              </Group>

              <Group mb="md" spacing="xs">
                <IconCalendar size={18} />
                <Text size={{ base: "sm", sm: "md" }}>
                  {formatDate(launch.date_utc)}
                </Text>
              </Group>

              <Text mb="lg" size={{ base: "sm", sm: "md" }}>
                {launch.details ||
                  "No detailed description available for this launch."}
              </Text>

              <Divider my="md" label="Mission Details" labelPosition="center" />

              <Grid gutter={{ base: "xs", sm: "md" }}>
                <Grid.Col xs={12} sm={6}>
                  <Card withBorder padding="sm" mb="md">
                    <Group>
                      <IconRocket size={18} />
                      <Text weight={500}>Rocket</Text>
                    </Group>
                    {isLoadingRocket ? (
                      <Loader size="sm" ml={26} mt="xs" />
                    ) : rocket ? (
                      <Group ml={26} mt="xs" spacing="xs">
                        <Text size={{ base: "sm", sm: "md" }}>
                          {rocket.name}
                        </Text>
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
                        <Text size={{ base: "sm", sm: "md" }}>
                          {launchpad.name}
                        </Text>
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

                <Grid.Col xs={12} sm={6}>
                  <Card withBorder padding="sm" h="100%" p="lg">
                    <Text weight={500} mb="sm">
                      Mission Status
                    </Text>

                    {launch.upcoming ? (
                      <List spacing="xs" center size="sm">
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
                      <List spacing="xs" center size="sm">
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
                      <List spacing="xs" center size="sm">
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

              <SimpleGrid
                cols={{ base: 1, xs: 2, sm: 3 }}
                spacing={{ base: "xs", sm: "md" }}
              >
                {launch.links.reddit.campaign && (
                  <Button
                    component="a"
                    href={launch.links.reddit.campaign}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="light"
                    size={{ base: "xs", sm: "sm" }}
                    fullWidth
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
                    size={{ base: "xs", sm: "sm" }}
                    fullWidth
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
                    size={{ base: "xs", sm: "sm" }}
                    fullWidth
                  >
                    Press Kit
                  </Button>
                )}
              </SimpleGrid>
            </Card>
          </Grid.Col>
        </Grid>
      </Stack>
    </Container>
  );
}
