import { useCallback, useEffect, useRef } from "react";
import { useKeywordQuery } from "@/query/useKeywordQuery";
import { useDataLabQueries } from "@/query/useDataLabQueries";
import { defaultDataLab } from "@/constants/default-data-lab";
import { useSharedKeywordState } from "@/store/useSharedKeywordState";

export function useKeywordSearch() {
  // 공유 상태 사용
  const {
    searchKeyword,
    setSearchKeyword,
    clearSearchKeyword,
    isSearching,
    setIsSearching,
    progress,
    setProgress,
    error,
    setError,
    addKeywordResult,
    setProcessCounts,
    resetAll,
  } = useSharedKeywordState();

  // 최대 허용 키워드 개수
  const maxKeywords = 100;

  // 키워드 처리 상태 관리
  const keywordsToProcess = useRef<string[]>([]);
  const currentKeywordIndexRef = useRef<number>(0);
  const currentKeywordRef = useRef<string>("");

  // 키워드 및 데이터랩 API 쿼리
  const keywordQuery = useKeywordQuery(
    currentKeywordRef.current,
    isSearching && !!currentKeywordRef.current,
  );

  const dataLab = useDataLabQueries(
    defaultDataLab,
    currentKeywordRef.current,
    isSearching && !!currentKeywordRef.current,
  );

  // 검색 유효성 검사
  const validateSearch = useCallback((): boolean => {
    if (!searchKeyword.trim()) {
      setError("검색할 키워드를 입력해주세요.");
      return false;
    }

    // 특수문자 검사
    if (/[^a-zA-Z0-9가-힣\s]/.test(searchKeyword)) {
      setError("검색어에 특수문자를 사용할 수 없습니다.");
      return false;
    }

    // 키워드 개수 확인
    const keywords = searchKeyword
      .split("\n")
      .map((kw) => kw.trim())
      .filter((kw) => kw !== "");

    if (keywords.length > maxKeywords) {
      setError(`최대 ${maxKeywords}개의 키워드만 검색할 수 있습니다.`);
      return false;
    }

    if (keywords.length === 0) {
      setError("검색할 키워드를 입력해주세요.");
      return false;
    }

    return true;
  }, [searchKeyword, setError, maxKeywords]);

  // 검색 실행 핸들러
  const handleSearch = useCallback(() => {
    // 유효성 검사
    if (!validateSearch()) return;

    // 줄바꿈으로 분리하여 키워드 배열 생성
    const keywords = searchKeyword
      .split("\n")
      .map((kw) => kw.trim())
      .filter((kw) => kw !== "");

    console.log(`${keywords.length}개의 키워드 검색 시작:`, keywords);

    // 초기화
    resetAll();
    setError(null);
    setIsSearching(true);
    setProgress(10); // 시작 진행률

    // 참조값 설정
    currentKeywordIndexRef.current = 0;
    keywordsToProcess.current = keywords;

    // 처리 상태 업데이트
    setProcessCounts(0, keywords.length);

    // 첫 번째 키워드 처리 시작
    if (keywords.length > 0) {
      currentKeywordRef.current = keywords[0];
    }
  }, [
    searchKeyword,
    validateSearch,
    resetAll,
    setError,
    setIsSearching,
    setProgress,
    setProcessCounts,
  ]);

  // 검색 초기화 핸들러
  const handleClear = useCallback(() => {
    clearSearchKeyword();
    resetAll();
    currentKeywordIndexRef.current = 0;
    keywordsToProcess.current = [];
    currentKeywordRef.current = "";
  }, [clearSearchKeyword, resetAll]);

  // 키워드 개수 계산
  const keywordCount = searchKeyword
    ? searchKeyword.split("\n").filter((kw) => kw.trim() !== "").length
    : 0;

  // API 결과 모니터링 및 다음 키워드 처리
  useEffect(() => {
    if (!isSearching || !currentKeywordRef.current) return;

    // 현재 키워드의 API 요청이 모두 완료되었는지 확인
    const keywordDone = !keywordQuery.isLoading;
    const dataLabDone = !dataLab.isLoading;

    if (keywordDone && dataLabDone) {
      // 현재 키워드의 결과 저장
      const result = {
        keyword: currentKeywordRef.current,
        keywordData: keywordQuery.data || null,
        pcData: dataLab.pc.data,
        mobileData: dataLab.mobile.data,
      };

      // 공유 스토어에 결과 추가
      addKeywordResult(result);

      // 다음 키워드로 이동
      currentKeywordIndexRef.current += 1;

      // 다음 키워드 처리 (직접 호출하지 않고 상태 변경으로 트리거)
      const nextIndex = currentKeywordIndexRef.current;
      if (nextIndex < keywordsToProcess.current.length) {
        // 다음 키워드 설정
        const nextKeyword = keywordsToProcess.current[nextIndex];
        setTimeout(() => {
          currentKeywordRef.current = nextKeyword;
          setProcessCounts(nextIndex, keywordsToProcess.current.length);
          // 진행률 계산 (0~100%)
          const newProgress = Math.min(
            10 +
              Math.floor(
                (currentKeywordIndexRef.current /
                  keywordsToProcess.current.length) *
                  90,
              ),
            99,
          );
          setProgress(newProgress);
        }, 10);
      } else {
        // 모든 키워드 처리 완료
        setTimeout(() => {
          setProgress(100);
          setProcessCounts(
            keywordsToProcess.current.length,
            keywordsToProcess.current.length,
          );
          setIsSearching(false);
        }, 300);
      }
    }
  }, [
    isSearching,
    keywordQuery.isLoading,
    keywordQuery.data,
    dataLab.isLoading,
    dataLab.pc.data,
    dataLab.mobile.data,
    addKeywordResult,
    setProgress,
    setProcessCounts,
    setIsSearching,
  ]);

  return {
    searchKeyword,
    setSearchKeyword,
    isLoading: isSearching,
    loadingProgress: progress,
    error,
    keywordCount,
    handleSearch,
    handleClear,
    maxKeywords,
    currentKeyword: currentKeywordRef.current,
    processedCount: currentKeywordIndexRef.current,
    totalKeywords: keywordsToProcess.current.length,
  };
}
