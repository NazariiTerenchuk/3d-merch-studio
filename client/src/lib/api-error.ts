import { isAxiosError } from 'axios';

interface ProblemDetails {
  title?: string;
  errors?: Record<string, string[]>;
}

/**
 * The API returns domain errors as a plain string and model-binding errors as ProblemDetails.
 */
export function getApiErrorMessage(error: unknown, fallback = 'Сталася помилка. Спробуйте ще раз.'): string {
  if (!isAxiosError(error)) return fallback;

  if (!error.response) return 'Сервер недоступний. Перевірте, що API запущено.';

  const data = error.response.data as unknown;

  if (typeof data === 'string' && data.trim()) return data;

  if (data && typeof data === 'object') {
    const problem = data as ProblemDetails;
    const firstFieldError = problem.errors ? Object.values(problem.errors).flat()[0] : undefined;
    if (firstFieldError) return firstFieldError;
    if (problem.title) return problem.title;
  }

  return fallback;
}
