import { RequestQueue } from "@/class/queue";
import { ApiResult } from "@/types/api";
import { delay } from "@/utils/delete";

// 진행률 콜백 타입 정의
type ProgressCallback = (batchIndex: number, totalBatches: number) => void;

/**
 * 요청 제한 및 재시도 로직이 포함된 fetch 함수
 */
async function fetchWithThrottleAndRetry(
  url: string,
  options: RequestInit,
  maxRetries: number = 5,
  initialDelayMs: number = 5000,
): Promise<Response> {
  let retries = 0;
  let delayMs = initialDelayMs;

  while (retries <= maxRetries) {
    try {
      const response = await fetch(url, options);

      // 429가 아닌 경우 결과 반환 (성공 또는 다른 오류)
      if (response.status !== 429) {
        return response;
      }

      // 429 오류(요청 제한) 발생 시 재시도 준비
      retries++;
      console.log(
        `API 요청 제한 감지. ${retries}번째 재시도 준비 중... ${delayMs}ms 후 재시도`,
      );

      // 지수 백오프: 대기 시간을 2배씩 증가
      await delay(delayMs);
      delayMs *= 2;
    } catch (error) {
      console.error("API 요청 오류:", error);
      retries++;
      await delay(delayMs);
      delayMs *= 2;
    }
  }

  throw new Error("최대 재시도 횟수 초과");
}

// ----------------- 전역 인스턴스 -----------------

// 전역 요청 큐 인스턴스 생성 (애플리케이션 전체에서 공유)
const geminiRequestQueue = new RequestQueue(30); // 분당 30개 요청으로 제한

// ----------------- 메인 API 호출 함수 -----------------

/**
 * Gemini API를 호출하여 키워드 관련도 점수를 가져오는 함수
 * 개선된 버전: 배치 처리, 요청 큐, 재시도 로직 적용
 *
 * @param keyword 검색 키워드
 * @param relatedKeywords 연관 키워드 배열
 * @param onProgress 진행률 콜백 함수
 * @returns 스코어 배열 또는 오류
 */
export async function fetchGeminiScores(
  keyword: string,
  relatedKeywords: string[],
  onProgress?: ProgressCallback,
): Promise<ApiResult<number[]>> {
  try {
    // 연관 키워드가 없는 경우 빈 배열 반환
    if (!relatedKeywords.length) {
      return {
        success: true,
        data: [],
        error: null,
      };
    }

    // 배치 처리로 키워드 처리
    const BATCH_SIZE = 30; // 배치당 최대 키워드 수
    const batches = [];

    // 데이터를 배치로 나누기
    for (let i = 0; i < relatedKeywords.length; i += BATCH_SIZE) {
      batches.push(relatedKeywords.slice(i, i + BATCH_SIZE));
    }

    console.log(
      `총 ${relatedKeywords.length}개의 키워드를 ${batches.length}개 배치로 처리합니다.`,
    );

    const allResults: number[] = [];

    // 각 배치별로 처리
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      console.log(
        `배치 ${i + 1}/${batches.length} 처리 중... (${batch.length}개 키워드)`,
      );

      // 진행 상황 콜백 호출 - 배치 진행 상황 알림
      if (onProgress) {
        onProgress(i, batches.length);
      }

      try {
        // 큐를 통해 요청 제한 준수
        const response = await geminiRequestQueue.enqueue(() =>
          fetchWithThrottleAndRetry("/api/gemini", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              prompt: `검색 키워드 "${keyword}"와 다음 연관 키워드들의 관련도를 1-10 점수로 평가해주세요.
                연관 키워드: ${batch.join(", ")}
                
                각 연관 키워드에 대한 점수만 쉼표로 구분된 배열로 반환해주세요.
                예: [7, 5, 9, 3, 8]
                추가 설명이나 다른 텍스트는 포함하지 말고 오직 숫자 배열만 반환해주세요.`,
            }),
          }),
        );

        const data = await response.json();

        // 디버깅을 위한 로깅
        console.log("Gemini API 원본 응답:", data.text);

        // 텍스트 응답을 숫자 배열로 파싱
        const scoresText = data.text.trim();
        const scoresMatch = scoresText.match(/\[([^\]]+)\]/);

        let batchScores: number[] = [];

        if (scoresMatch) {
          // 배열 형태로 응답이 온 경우
          batchScores = scoresMatch[1]
            .split(",")
            .map((score: string) => parseInt(score.trim(), 10))
            .filter((score: number) => !isNaN(score));

          // 배치 크기와 일치하는지 확인
          while (batchScores.length < batch.length) {
            batchScores.push(1000); // 부족한 경우 기본값 추가
          }
          if (batchScores.length > batch.length) {
            batchScores = batchScores.slice(0, batch.length); // 초과분 제거
          }
        } else {
          // 배열 형태가 아닌 경우 텍스트에서 숫자만 추출
          const numbers = scoresText.match(/\d+/g);
          if (numbers && numbers.length > 0) {
            batchScores = numbers
              .map((n) => parseInt(n, 10))
              .slice(0, batch.length);

            // 부족한 경우 기본값 추가
            while (batchScores.length < batch.length) {
              batchScores.push(1000);
            }
          } else {
            // 숫자를 추출할 수 없는 경우 기본값 사용
            batchScores = Array(batch.length).fill(1000);
          }
        }

        console.log(`배치 ${i + 1} 결과:`, batchScores);

        // 결과 수집
        allResults.push(...batchScores);
      } catch (error) {
        console.error(`배치 ${i + 1} 처리 오류:`, error);
        // 오류 발생 시 기본값으로 처리
        const defaultScores = Array(batch.length).fill(1000);
        allResults.push(...defaultScores);
      }
    }

    // 모든 배치 처리 완료 - 최종 진행 상황 알림
    if (onProgress) {
      onProgress(batches.length, batches.length);
    }

    console.log("Gemini 최종 스코어:", allResults);

    return {
      success: true,
      data: allResults,
      error: null,
    };
  } catch (error) {
    console.error("Gemini API 요청 오류:", error);
    return {
      success: false,
      data: null,
      error:
        error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다",
    };
  }
}
