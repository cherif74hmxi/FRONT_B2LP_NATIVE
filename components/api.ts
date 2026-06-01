import axios, { type AxiosRequestConfig } from "axios";
import {
  API_BASE_URL,
  type AuthSession,
  type Billet,
  type Commentaire,
} from "./types";

type ApiRequestOptions = {
  method?: AxiosRequestConfig["method"];
  body?: Record<string, unknown>;
  token?: string;
  headers?: AxiosRequestConfig["headers"];
};

type RegisterApiResponse = {
  access_token: string;
  token_type: "Bearer" | string;
};

function isApiObject(payload: unknown): payload is Record<string, unknown> {
  return payload !== null && typeof payload === "object";
}

function getFirstValidationError(payload: Record<string, unknown>): string | undefined {
  if (!isApiObject(payload.errors)) {
    return undefined;
  }

  for (const value of Object.values(payload.errors)) {
    if (Array.isArray(value) && typeof value[0] === "string") {
      return value[0];
    }
  }

  return undefined;
}

function getApiErrorMessage(payload: unknown, status?: number): string {
  if (isApiObject(payload)) {
    const validationError = getFirstValidationError(payload);

    if (validationError) {
      return validationError;
    }

    if (typeof payload.message === "string") {
      return payload.message;
    }
  }

  return status ? `Erreur API ${status}` : "Impossible de joindre l'API";
}

function parseApiResponse<T>(payload: unknown): T {
  if (isApiObject(payload) && payload.success === false) {
    throw new Error(getApiErrorMessage(payload));
  }

  if (isApiObject(payload) && "data" in payload) {
    return payload.data as T;
  }

  return payload as T;
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const { body, token, headers, method = "GET" } = options;

  try {
    const response = await axios.request({
      url: `${API_BASE_URL}${path}`,
      method,
      data: body,
      timeout: 15000,
      headers: {
        Accept: "application/json",
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });

    if (response.status === 204) {
      return null as T;
    }

    return parseApiResponse<T>(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        getApiErrorMessage(error.response?.data, error.response?.status),
      );
    }

    throw error;
  }
}

export function fetchBillets(): Promise<Billet[]> {
  return apiRequest<Billet[]>("/billets");
}

export function fetchBillet(
  id: string | number,
  token?: string,
): Promise<Billet> {
  return apiRequest<Billet>(`/billets/${encodeURIComponent(String(id))}`, {
    token,
  });
}

export function loginUser(
  email: string,
  password: string,
): Promise<AuthSession> {
  return apiRequest<AuthSession>("/login", {
    method: "POST",
    body: { email, password },
  });
}

export function logoutUser(token: string): Promise<null> {
  return apiRequest<null>("/user/logout", {
    method: "POST",
    token,
  });
}

export function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<RegisterApiResponse> {
  return apiRequest<RegisterApiResponse>("/register", {
    method: "POST",
    body: { name, email, password },
  });
}

export function createBillet(
  token: string,
  billet: { date: string; titre: string; contenu: string },
): Promise<Billet> {
  return apiRequest<Billet>("/billets", {
    method: "POST",
    token,
    body: {
      BIL_DATE: billet.date,
      BIL_TITRE: billet.titre,
      BIL_CONTENU: billet.contenu,
    },
  });
}

export function updateBillet(
  token: string,
  id: number,
  billet: { date: string; titre: string; contenu: string },
): Promise<Billet> {
  return apiRequest<Billet>(`/billets/${id}`, {
    method: "PATCH",
    token,
    body: {
      BIL_DATE: billet.date,
      BIL_TITRE: billet.titre,
      BIL_CONTENU: billet.contenu,
    },
  });
}

export function deleteBillet(token: string, id: number): Promise<null> {
  return apiRequest<null>(`/billets/${id}`, {
    method: "DELETE",
    token,
  });
}

export function createCommentaire(
  token: string,
  billetId: number,
  userId: number,
  contenu: string,
): Promise<Commentaire> {
  return apiRequest<Commentaire>("/commentaires", {
    method: "POST",
    token,
    body: {
      COM_DATE: new Date().toISOString().slice(0, 10),
      COM_CONTENU: contenu,
      billet_id: billetId,
      user_id: userId,
    },
  });
}

export function deleteCommentaire(token: string, id: number): Promise<null> {
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error(
      "Impossible de supprimer ce commentaire : l'API ne renvoie pas son id.",
    );
  }

  return apiRequest<null>(`/commentaires/${id}`, {
    method: "DELETE",
    token,
  });
}
