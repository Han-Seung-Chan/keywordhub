import { useQueries } from "@tanstack/react-query";
import { fetchDatalabData } from "@/lib/fetch-data-lab";
import { DataLabRequest, DataLabResponse } from "@/types/data-lab";
import { ApiResult } from "@/types/api";
import { QUERY_KEYS } from "@/constants/query-keys";

export type DeviceType = "pc" | "mo";

export interface DataLabResults {
  pc: {
    data: DataLabResponse | null;
  };
  mobile: {
    data: DataLabResponse | null;
  };
  isLoading: boolean;
  isError: boolean;
}

/**
 * PC와 모바일 디바이스에 대한 DataLab 쿼리를 동시에 실행하는 커스텀 훅
 */
export const useDataLabQueries = (
  baseRequest: DataLabRequest,
  keyword: string,
  enabled = false,
): DataLabResults => {
  // 키워드 그룹 업데이트 함수
  const createRequestWithKeyword = (
    request: DataLabRequest,
    deviceType: DeviceType,
  ): DataLabRequest => {
    return {
      ...request,
      keywordGroups: keyword
        ? [{ groupName: keyword, keywords: [keyword] }]
        : request.keywordGroups,
      device: deviceType,
    };
  };

  // PC와 모바일에 대한 요청 객체 생성
  const pcRequest = createRequestWithKeyword(baseRequest, "pc");
  const mobileRequest = createRequestWithKeyword(baseRequest, "mo");

  // useQueries를 사용하여 여러 쿼리 실행
  const results = useQueries({
    queries: [
      {
        queryKey: [QUERY_KEYS.DATA_LAB, "pc", keyword],
        queryFn: async (): Promise<ApiResult<DataLabResponse>> => {
          return fetchDatalabData(pcRequest);
        },
        enabled: enabled && !!keyword,
        staleTime: 5 * 60 * 1000,
      },
      {
        queryKey: [QUERY_KEYS.DATA_LAB, "mo", keyword],
        queryFn: async (): Promise<ApiResult<DataLabResponse>> => {
          return fetchDatalabData(mobileRequest);
        },
        enabled: enabled && !!keyword,
        staleTime: 5 * 60 * 1000,
      },
    ],
  });

  // PC 쿼리 결과
  const pcResult = results[0];
  // 모바일 쿼리 결과
  const mobileResult = results[1];

  return {
    pc: {
      data: pcResult.data?.data || null,
    },
    mobile: {
      data: mobileResult.data?.data || null,
    },
    isLoading: pcResult.isLoading || mobileResult.isLoading,
    isError: pcResult.isError || mobileResult.isError,
  };
};
