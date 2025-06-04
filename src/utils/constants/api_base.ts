export function getApiBaseUrl() {
  return typeof window === 'undefined'
    ? process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api'
    : '/api'
}
