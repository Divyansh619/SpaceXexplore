// User and Auth types
export interface User {
    id: string;
    email: string;
    name: string;
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface Credentials {
    email: string;
    password: string;
  }
  
  export interface RegisterData extends Credentials {
    name: string;
  }
  
  // SpaceX API types
  export interface Rocket {
    id: string;
    name: string;
    description: string;
    active: boolean;
    first_flight: string;
    height: { meters: number; feet: number };
    diameter: { meters: number; feet: number };
    mass: { kg: number; lb: number };
    stages: number;
    boosters: number;
    cost_per_launch: number;
    success_rate_pct: number;
    engines: {
      type: string;
      version: string;
      number: number;
      propellant_1: string;
      propellant_2: string;
      thrust_to_weight: number;
    };
    flickr_images: string[];
    wikipedia: string;
  }
  
  export interface LaunchPad {
    id: string;
    name: string;
    full_name: string;
    status: string;
    locality: string;
    region: string;
    latitude: number;
    longitude: number;
    details: string;
  }
  
  export interface Launch {
    id: string;
    flight_number: number;
    name: string;
    date_utc: string;
    date_unix: number;
    date_local: string;
    date_precision: string;
    static_fire_date_utc: string | null;
    static_fire_date_unix: number | null;
    tbd: boolean;
    net: boolean;
    window: number | null;
    rocket: string;
    success: boolean | null;
    failures: Array<{
      time: number;
      altitude: number | null;
      reason: string;
    }>;
    upcoming: boolean;
    details: string | null;
    fairings: {
      reused: boolean | null;
      recovery_attempt: boolean | null;
      recovered: boolean | null;
      ships: string[];
    } | null;
    crew: Array<{
      crew: string;
      role: string;
    }>;
    ships: string[];
    capsules: string[];
    payloads: string[];
    launchpad: string;
    links: {
      patch: {
        small: string | null;
        large: string | null;
      };
      reddit: {
        campaign: string | null;
        launch: string | null;
        media: string | null;
        recovery: string | null;
      };
      flickr: {
        small: string[];
        original: string[];
      };
      presskit: string | null;
      webcast: string | null;
      youtube_id: string | null;
      article: string | null;
      wikipedia: string | null;
    };
  }
  
  // UI related types
  export interface FilterParams {
    search?: string;
    status?: 'active' | 'inactive' | 'all';
    sort?: 'name' | 'first_flight' | 'success_rate_pct';
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }
  
  export interface LaunchFilterParams {
    search?: string;
    rocket?: string;
    status?: 'success' | 'failed' | 'upcoming' | 'all';
    startDate?: string;
    endDate?: string;
    sort?: 'date' | 'flight_number' | 'name';
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }
  
  export interface PaginationResult<T> {
    data: T[];
    totalCount: number;
    page: number;
    totalPages: number;
    hasMore: boolean;
  }