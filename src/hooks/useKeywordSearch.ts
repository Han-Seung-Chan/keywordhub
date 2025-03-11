import { useState, useCallback, useEffect } from "react";
import { useKeywordQuery } from "@/query/useKeywordQuery";
import { useDataLabQueries } from "@/query/useDataLabQueries";
import { defaultDataLab } from "@/constants/default-data-lab";
import { useKeywordStore } from "@/store/useKeywordStore";

export function useKeywordSearch() {
  const { searchKeyword, setSearchKeyword, clearSearchKeyword } =
    useKeywordStore();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  // 쿼리 실행 여부를 제어하는 상태
  const [shouldFetchKeyword, setShouldFetchKeyword] = useState(false);
  const [shouldFetchDataLab, setShouldFetchDataLab] = useState(false);

  const keywordQuery = useKeywordQuery(searchKeyword, shouldFetchKeyword);
  const dataLab = useDataLabQueries(
    defaultDataLab,
    searchKeyword,
    shouldFetchDataLab,
  );

  // 검색 유효성 검사
  const validateSearch = useCallback((): boolean => {
    if (!searchKeyword.trim()) {
      setError("검색할 키워드를 입력해주세요.");
      return false;
    }

    if (/[^a-zA-Z0-9가-힣\s]/.test(searchKeyword)) {
      setError("검색어에 특수문자를 사용할 수 없습니다.");
      return false;
    }

    return true;
  }, [searchKeyword]);

  // 로딩 애니메이션을 위한 함수
  const startLoadingAnimation = useCallback(() => {
    // 첫 25%는 빠르게 증가
    setTimeout(() => {
      setLoadingProgress(25);
    }, 200);

    // 50%까지 다소 빠르게
    setTimeout(() => {
      setLoadingProgress(50);
    }, 500);

    // 75%까지 천천히
    setTimeout(() => {
      setLoadingProgress(75);
    }, 1200);

    // 90%에서 API 응답 대기
    setTimeout(() => {
      setLoadingProgress(90);
    }, 2000);
  }, []);

  // 검색 핸들러
  const handleSearch = useCallback(() => {
    if (!validateSearch()) return;

    // 줄바꿈 처리된 키워드 로그
    console.log(searchKeyword.replace(/ /g, "").split("\n"));

    setError(null);
    setIsLoading(true);
    setLoadingProgress(0);

    // 프로그레스 애니메이션 시작
    startLoadingAnimation();

    setShouldFetchKeyword(true);
    setShouldFetchDataLab(true);
  }, [searchKeyword, validateSearch, startLoadingAnimation]);

  // 검색어 초기화 핸들러
  const handleClear = useCallback(() => {
    clearSearchKeyword();
    setShouldFetchKeyword(false);
    setShouldFetchDataLab(false);
    setError(null);
    setIsLoading(false);
    setLoadingProgress(0);
  }, [clearSearchKeyword]);

  // 키워드 개수 계산
  const keywordCount = searchKeyword
    ? searchKeyword.split("\n").filter(Boolean).length
    : 0;

  useEffect(() => {
    // API 결과 처리
    const keywordDone = !keywordQuery.isLoading && shouldFetchKeyword;
    const dataLabDone = !dataLab.isLoading && shouldFetchDataLab;

    // 오류 처리
    const keywordError = keywordQuery.error;
    const dataLabErrors = dataLab.isError;

    if ((keywordError || dataLabErrors) && !error) {
      setError("데이터를 가져오는 중 오류가 발생했습니다.");
      setIsLoading(false);
      setLoadingProgress(0);
      return;
    }

    // 모든 요청이 완료되면 로딩 상태 해제
    if (keywordDone && dataLabDone) {
      setLoadingProgress(100);

      // 약간의 지연 후 로딩 종료 (완료 애니메이션을 보여주기 위함)
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, [
    keywordQuery.isLoading,
    keywordQuery.error,
    dataLab.isLoading,
    dataLab.isError,
    shouldFetchKeyword,
    shouldFetchDataLab,
    error,
  ]);

  return {
    searchKeyword,
    setSearchKeyword,
    isLoading,
    loadingProgress,
    error,
    keywordCount,
    handleSearch,
    handleClear,
    keywordData: keywordQuery.data,
    dataLabData: {
      pc: dataLab.pc,
      mobile: dataLab.mobile,
    },
  };
}
