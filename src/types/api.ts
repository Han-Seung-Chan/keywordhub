/**
 * API 결과 타입 - 성공 또는 오류
 */
export type ApiResult<T> =
  | { success: true; data: T; error: null }
  | { success: false; data: null; error: string };
