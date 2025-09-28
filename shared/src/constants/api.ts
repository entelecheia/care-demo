export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    PROFILE: "/auth/profile",
  },
  POLICY: {
    BASE: "/policy",
    BY_ID: (id: string) => `/policy/${id}`,
  },
  SIMULATION: {
    BASE: "/simulation",
    BY_ID: (id: string) => `/simulation/${id}`,
  },
  COMMUNITY: {
    BASE: "/community",
    BY_ID: (id: string) => `/community/${id}`,
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
