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
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import {
  IconSearch,
  IconFilter,
  IconSortAscending,
  IconSortDescending,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { getRockets } from "../../api/spacex";
import { FilterParams, Rocket } from "../../../types/index";
import RocketCard from "./RocketCard";

export function RocketsList() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse search params or use defaults
  const initialFilters: FilterParams = {
    search: searchParams.get("search") || "",
    status: (searchParams.get("status") as FilterParams["status"]) || "all",
    sort: (searchParams.get("sort") as FilterParams["sort"]) || "name",
    order: (searchParams.get("order") as FilterParams["order"]) || "asc",
    page: parseInt(searchParams.get("page") || "1", 10),
    limit: 8,
  };

  const [filters, setFilters] = useState<FilterParams>(initialFilters);
  const [searchValue, setSearchValue] = useState(initialFilters.search);
  const [debouncedSearch] = useDebouncedValue(searchValue, 500);

  // Update filters when debounced search changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      search: debouncedSearch,
      page: 1, // Reset to first page on new search
    }));
  }, [debouncedSearch]);

  // Fetch rockets with current filters
  const { data, isLoading, isError } = useQuery(
    ["rockets", filters],
    () => getRockets(filters),
    { keepPreviousData: true }
  );

  // Update URL search params when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.status) params.set("status", filters.status);
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
      status: value as FilterParams["status"],
      page: 1,
    });
  };

  const handleSortChange = (value: string) => {
    setFilters({ ...filters, sort: value as FilterParams["sort"], page: 1 });
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

  return (
    <Stack spacing="md">
      <Group position="apart">
        <Text size="xl" weight={700}>
          SpaceX Rockets
        </Text>
      </Group>

      <Group mb="md">
        <TextInput
          placeholder="Search rockets..."
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
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
          ]}
          icon={<IconFilter size={16} />}
        />

        <Select
          placeholder="Sort by"
          w={{ base: "100%", sm: "auto" }}
          value={filters.sort}
          onChange={handleSortChange}
          data={[
            { value: "name", label: "Name" },
            { value: "first_flight", label: "First Flight" },
            { value: "success_rate_pct", label: "Success Rate" },
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

      {isLoading ? (
        <Center h={200}>
          <Loader />
        </Center>
      ) : isError ? (
        <Text color="red" align="center">
          Error loading rockets. Please try again.
        </Text>
      ) : data?.data.length === 0 ? (
        <Text align="center" mt="xl">
          No rockets found. Try adjusting your filters.
        </Text>
      ) : (
        <>
          <SimpleGrid
            cols={4}
            spacing="lg"
            breakpoints={[
              { maxWidth: "md", cols: 2 },
              { maxWidth: "sm", cols: 1 },
            ]}
          >
            {data?.data.map((rocket) => (
              <RocketCard key={rocket.id} rocket={rocket} />
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
