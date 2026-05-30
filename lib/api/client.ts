const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001"

export class ApiError extends Error {
  status: number
  details: unknown

  constructor(message: string, status: number, details: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }
}

async function parseResponseBody(response: Response) {
  const text = await response.text()

  if (!text) {
    return null
  }

  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function getErrorMessage(status: number, body: unknown) {
  if (body && typeof body === "object" && "message" in body) {
    const message = body.message

    if (Array.isArray(message)) {
      return message.join(", ")
    }

    if (typeof message === "string") {
      return message
    }
  }

  if (typeof body === "string" && body.trim()) {
    return body
  }

  return `La petición falló con código ${status}`
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  const body = await parseResponseBody(response)

  if (!response.ok) {
    throw new ApiError(getErrorMessage(response.status, body), response.status, body)
  }

  return body as T
}

export function apiGet<T>(path: string) {
  return request<T>(path)
}

export function apiPost<T>(path: string, data?: unknown) {
  return request<T>(path, {
    method: "POST",
    body: data === undefined ? undefined : JSON.stringify(data),
  })
}

export function apiPatch<T>(path: string, data: unknown) {
  return request<T>(path, {
    method: "PATCH",
    body: JSON.stringify(data),
  })
}

export function apiDelete(path: string) {
  return request<void>(path, {
    method: "DELETE",
  })
}
