import crypto from "crypto";
import { NextResponse } from "next/server";

/**
 * API 응답 오류를 처리하는 공통 함수
 */
export const handleApiError = (error: any, customMessage?: string) => {
  console.error(customMessage || "API 처리 중 오류:", error);

  return NextResponse.json(
    {
      error: customMessage || "서버 내부 오류가 발생했습니다.",
      message: error.message,
    },
    { status: 500 },
  );
};

/**
 * 현재 타임스탬프를 생성합니다
 */
export const getTimestamp = (): string => {
  return String(Math.round(new Date().getTime()));
};

/**
 * API 요청을 위한 서명을 생성합니다
 */
export const generateSignature = (
  timestamp: string,
  method: string,
  uri: string,
  secretKey: string,
): string => {
  const message = `${timestamp}.${method}.${uri}`;

  try {
    return crypto
      .createHmac("sha256", secretKey)
      .update(message)
      .digest("base64");
  } catch (error) {
    console.error("서명 생성 중 오류:", error);
    throw new Error("서명 생성 실패");
  }
};

/**
 * 환경 변수 검증 함수
 */
export const validateEnvVariables = (requiredVars: string[]): void => {
  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    throw new Error(
      `필수 환경 변수가 설정되지 않았습니다: ${missingVars.join(", ")}`,
    );
  }
};

/**
 * API 응답 파싱 함수
 */
export const parseApiResponse = async (response: Response) => {
  // 응답 처리
  const responseText = await response.text();

  if (!responseText.trim()) {
    return { data: null, error: null };
  }

  try {
    const parsedResponse = JSON.parse(responseText);

    // 오류 응답 확인
    if (parsedResponse.status && parsedResponse.status >= 400) {
      return {
        data: null,
        error: {
          status: parsedResponse.status,
          message: parsedResponse.title || "API 요청 실패",
        },
      };
    }

    return { data: parsedResponse, error: null };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return {
        data: null,
        error: {
          status: 500,
          message: "API 응답을 파싱하는 중 오류가 발생했습니다",
        },
      };
    }
    throw error;
  }
};
