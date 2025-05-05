import {
  Rocket,
  Launch,
  LaunchPad,
  FilterParams,
  LaunchFilterParams,
  PaginationResult,
} from "../../types/index";

const API_URL = "https://api.spacexdata.com/v4";

const fetchAPI = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
};

// Rocket API calls
export const getRockets = async (
  params: FilterParams = {}
): Promise<PaginationResult<Rocket>> => {
  const rockets = (await fetchAPI("/rockets")) as Rocket[];

  // Apply filtering
  let filteredRockets = rockets;
  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    filteredRockets = rockets.filter(
      (rocket) =>
        rocket.name.toLowerCase().includes(searchTerm) ||
        rocket.description.toLowerCase().includes(searchTerm)
    );
  }

  if (params.status && params.status !== "all") {
    const isActive = params.status === "active";
    filteredRockets = filteredRockets.filter(
      (rocket) => rocket.active === isActive
    );
  }

  // Apply sorting
  if (params.sort) {
    filteredRockets = [...filteredRockets].sort((a, b) => {
      if (params.sort === "name") {
        return a.name.localeCompare(b.name);
      } else if (params.sort === "first_flight") {
        return (
          new Date(a.first_flight).getTime() -
          new Date(b.first_flight).getTime()
        );
      } else if (params.sort === "success_rate_pct") {
        return a.success_rate_pct - b.success_rate_pct;
      }
      return 0;
    });

    if (params.order === "desc") {
      filteredRockets.reverse();
    }
  }

  // Calculate pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedRockets = filteredRockets.slice(startIndex, endIndex);

  return {
    data: paginatedRockets,
    totalCount: filteredRockets.length,
    page,
    totalPages: Math.ceil(filteredRockets.length / limit),
    hasMore: endIndex < filteredRockets.length,
  };
};

export const getRocketById = async (id: string): Promise<Rocket> => {
  return await fetchAPI(`/rockets/${id}`);
};

// Launch API calls
export const getLaunches = async (
  params: LaunchFilterParams = {}
): Promise<PaginationResult<Launch>> => {
  const launches = (await fetchAPI("/launches")) as Launch[];

  // Apply filtering
  let filteredLaunches = launches;
  if (params.search) {
    const searchTerm = params.search.toLowerCase();
    filteredLaunches = launches.filter(
      (launch) =>
        launch.name.toLowerCase().includes(searchTerm) ||
        (launch.details && launch.details.toLowerCase().includes(searchTerm))
    );
  }

  if (params.rocket) {
    filteredLaunches = filteredLaunches.filter(
      (launch) => launch.rocket === params.rocket
    );
  }

  if (params.status && params.status !== "all") {
    if (params.status === "upcoming") {
      filteredLaunches = filteredLaunches.filter((launch) => launch.upcoming);
    } else if (params.status === "success") {
      filteredLaunches = filteredLaunches.filter(
        (launch) => launch.success === true
      );
    } else if (params.status === "failed") {
      filteredLaunches = filteredLaunches.filter(
        (launch) => launch.success === false
      );
    }
  }

  if (params.startDate) {
    const startDate = new Date(params.startDate).getTime();
    filteredLaunches = filteredLaunches.filter(
      (launch) => new Date(launch.date_utc).getTime() >= startDate
    );
  }

  if (params.endDate) {
    const endDate = new Date(params.endDate).getTime();
    filteredLaunches = filteredLaunches.filter(
      (launch) => new Date(launch.date_utc).getTime() <= endDate
    );
  }

  // Apply sorting
  if (params.sort) {
    filteredLaunches = [...filteredLaunches].sort((a, b) => {
      if (params.sort === "date") {
        return new Date(a.date_utc).getTime() - new Date(b.date_utc).getTime();
      } else if (params.sort === "flight_number") {
        return a.flight_number - b.flight_number;
      } else if (params.sort === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    if (params.order === "desc") {
      filteredLaunches.reverse();
    }
  } else {
    // Default sort by date
    filteredLaunches = [...filteredLaunches].sort(
      (a, b) => new Date(b.date_utc).getTime() - new Date(a.date_utc).getTime()
    );
  }

  // Calculate pagination
  const page = params.page || 1;
  const limit = params.limit || 10;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedLaunches = filteredLaunches.slice(startIndex, endIndex);

  return {
    data: paginatedLaunches,
    totalCount: filteredLaunches.length,
    page,
    totalPages: Math.ceil(filteredLaunches.length / limit),
    hasMore: endIndex < filteredLaunches.length,
  };
};

export const getLaunchById = async (id: string): Promise<Launch> => {
  return await fetchAPI(`/launches/${id}`);
};

export const getLaunchPadById = async (id: string): Promise<LaunchPad> => {
  return await fetchAPI(`/launchpads/${id}`);
};

// Data enrichment - Get all launches for a specific rocket
export const getLaunchesByRocketId = async (
  rocketId: string
): Promise<Launch[]> => {
  const launches = (await fetchAPI("/launches")) as Launch[];
  return launches.filter((launch) => launch.rocket === rocketId);
};
