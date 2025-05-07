import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  SimpleGrid,
  TextInput,
  Group,
  Select,
  Button,
  Pagination,
  Box,
  Text,
  Loader,
  Center,
  Stack,
  Paper,
} from "@mantine/core";

import { useDebouncedValue } from "@mantine/hooks";
import {
  IconSearch,
  IconFilter,
  IconSortAscending,
  IconSortDescending,
  IconRocket,
  IconCalendar,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { getLaunches, getRockets } from "../../api/spacex";
import { LaunchFilterParams } from "../../../types/index";
import { LaunchCard } from "./LaunchCard";

export function LaunchesList() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse search params or use defaults
  const initialFilters: LaunchFilterParams = {
    search: searchParams.get("search") || "",
    rocket: searchParams.get("rocket") || "",
    status:
      (searchParams.get("status") as LaunchFilterParams["status"]) || "all",
    startDate: searchParams.get("startDate") || "",
    endDate: searchParams.get("endDate") || "",
    sort: (searchParams.get("sort") as LaunchFilterParams["sort"]) || "date",
    order: (searchParams.get("order") as LaunchFilterParams["order"]) || "desc",
    page: parseInt(searchParams.get("page") || "1", 10),
    limit: 12,
  };

  const [filters, setFilters] = useState<LaunchFilterParams>(initialFilters);
  const [searchValue, setSearchValue] = useState(initialFilters.search);
  const [debouncedSearch] = useDebouncedValue(searchValue, 500);
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    initialFilters.startDate ? new Date(initialFilters.startDate) : null,
    initialFilters.endDate ? new Date(initialFilters.endDate) : null,
  ]);

  // Fetch rockets for the filter dropdown
  const { data: rocketsData } = useQuery(["rockets-list"], () => getRockets());

  // Update filters when debounced search changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: debouncedSearch,
      page: 1, // Reset to first page on new search
    }));
  }, [debouncedSearch]);

  // Fetch launches with current filters
  const { data, isLoading, isError } = useQuery(
    ["launches", filters],
    () => getLaunches(filters),
    { keepPreviousData: true }
  );

  // Update URL search params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.rocket) params.set("rocket", filters.rocket);
    if (filters.status) params.set("status", filters.status);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);
    if (filters.sort) params.set("sort", filters.sort);
    if (filters.order) params.set("order", filters.order);
    if (filters.page !== undefined && filters.page !== 1) {
      params.set("page", filters.page.toString());
    }

    setSearchParams(params);
  }, [filters, setSearchParams]);

  const handleStatusChange = (value: string) => {
    setFilters({
      ...filters,
      status: value as LaunchFilterParams["status"],
      page: 1,
    });
  };

  const handleRocketChange = (value: string) => {
    setFilters({ ...filters, rocket: value, page: 1 });
  };

  const handleSortChange = (value: string) => {
    setFilters({
      ...filters,
      sort: value as LaunchFilterParams["sort"],
      page: 1,
    });
  };

  const handleOrderChange = () => {
    setFilters({
      ...filters,
      order: filters.order === "asc" ? "desc" : "asc",
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: "smooth" });

  };

  const handleDateRangeChange = (range: [Date | null, Date | null]) => {
    setDateRange(range);
    setFilters({
      ...filters,
      startDate: range[0] ? range[0].toISOString() : "",
      endDate: range[1] ? range[1].toISOString() : "",
      page: 1,
    });
  };

  const clearDateRange = () => {
    setDateRange([null, null]);
    setFilters({
      ...filters,
      startDate: "",
      endDate: "",
      page: 1,
    });
  };

  return (
    <Stack spacing="md">
      <Group position="apart">
        <Text size="xl" weight={700}>
          SpaceX Launches
        </Text>
      </Group>

      <Group mb="md">
        <TextInput
          placeholder="Search launches..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.currentTarget.value)}
          sx={{ flexGrow: 1 }}
          icon={<IconSearch size={16} />}
        />

        <Select
          placeholder="Status"
          w={{ base: "100%", sm: "auto" }}
          value={filters.status}
          onChange={handleStatusChange}
          data={[
            { value: "all", label: "All Status" },
            { value: "upcoming", label: "Upcoming" },
            { value: "success", label: "Successful" },
            { value: "failed", label: "Failed" },
          ]}
          icon={<IconFilter size={16} />}
        />

        <Select
          placeholder="Rocket"
          w={{ base: "100%", sm: "auto" }}
          value={filters.rocket}
          onChange={handleRocketChange}
          data={[
            { value: "", label: "All Rockets" },
            ...(rocketsData?.data || []).map((rocket) => ({
              value: rocket.id,
              label: rocket.name,
            })),
          ]}
          icon={<IconRocket size={16} />}
        />

        <Select
          placeholder="Sort by"
          w={{ base: "100%", sm: "auto" }}
          value={filters.sort}
          onChange={handleSortChange}
          data={[
            { value: "date", label: "Date" },
            { value: "flight_number", label: "Flight Number" },
            { value: "name", label: "Name" },
          ]}
        />

        <Button
          variant="subtle"
          onClick={handleOrderChange}
          leftIcon={
            filters.order === "asc" ? (
              <IconSortAscending size={16} />
            ) : (
              <IconSortDescending size={16} />
            )
          }
        >
          {filters.order === "asc" ? "Ascending" : "Descending"}
        </Button>
      </Group>

      {/* <Paper p="md" withBorder mb="md">
        <Group position="apart">
          <Group>
            <IconCalendar size={16} />
            <Text weight={500}>Date Range</Text>
          </Group>

          {(dateRange[0] || dateRange[1]) && (
            <Button variant="subtle" compact onClick={clearDateRange}>
              Clear
            </Button>
          )}
        </Group>

        <DateRangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
          mx="auto"
          mt="sm"
        />
      </Paper> */}

      {isLoading ? (
        <Center h={200}>
          <Loader />
        </Center>
      ) : isError ? (
        <Text color="red" align="center">
          Error loading launches. Please try again.
        </Text>
      ) : data?.data.length === 0 ? (
        <Text align="center" mt="xl">
          No launches found. Try adjusting your filters.
        </Text>
      ) : (
        <>
          <SimpleGrid
            cols={4}
            spacing="lg"
            breakpoints={[
              { maxWidth: "lg", cols: 3 },
              { maxWidth: "md", cols: 2 },
              { maxWidth: "sm", cols: 1 },
            ]}
          >
            {data?.data.map((launch) => (
              <LaunchCard key={launch.id} launch={launch} />
            ))}
          </SimpleGrid>

          {data && data.totalPages > 1 && (
            <Pagination
              total={data.totalPages}
              value={filters.page}
              onChange={handlePageChange}
              mt="xl"
              position="center"
            />
          )}
        </>
      )}
    </Stack>
  );
}
