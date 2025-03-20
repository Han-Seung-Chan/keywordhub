import { useCallback, useRef, useState, useMemo } from "react";
import { fetchKeywordData } from "@/lib/fetch-keywords";
import {
  countKeywords,
  validateKeywordInput,
} from "@/utils/keyword-validation";
import { KeywordResponse } from "@/types/keyword-tool";

// 최대 허용 키워드 개수
const MAX_KEYWORDS = 100;

interface RelatedKeywordResult {
  keywordData: KeywordResponse;
  relatedKeywords: KeywordResponse[];
  isLoading: boolean;
  error: string | null;
}

export function useRelatedKeyword() {
  // 상태 관리
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<RelatedKeywordResult[]>([]);
  const [processedCount, setProcessedCount] = useState<number>(0);
  const [totalKeywords, setTotalKeywords] = useState<number>(0);

  // 로컬 참조 및 Ref
  const keywordsToProcess = useRef<string[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);
  const processingRef = useRef<boolean>(false);

  // 키워드 개수 계산 메모이제이션
  const keywordCount = useMemo(
    () => countKeywords(searchKeyword),
    [searchKeyword],
  );

  // 유효성 검사 - 옵션 객체 메모이제이션
  const validationStatus = useMemo(
    () => validateKeywordInput(searchKeyword, MAX_KEYWORDS),
    [searchKeyword, MAX_KEYWORDS],
  );

  // 검색 유효성 검사
  const validateSearch = useCallback((): boolean => {
    if (!validationStatus.isValid) {
      setError(validationStatus.errorMessage);
      return false;
    }
    return true;
  }, [validationStatus]);

  // 현재 처리중인 키워드에 대한 연관 키워드 가져오기
  const processNextKeyword = useCallback(async () => {
    if (processingRef.current || keywordsToProcess.current.length === 0) {
      return;
    }

    processingRef.current = true;
    const currentKeyword = keywordsToProcess.current.shift();

    if (!currentKeyword) {
      processingRef.current = false;
      return;
    }

    try {
      // 개별 키워드에 대해 API 호출
      const result = await fetchKeywordData(currentKeyword);
      console.log(result);

      // 결과 처리
      if (result.success && result.data.length) {
        // relKeyword 값을 배열로 추출 (자신의 relKeyword와 다른 모든 결과의 relKeyword 포함)
        const relatedKeywords = result.data.filter(
          (data) => data.monthlyMobileQcCnt > 0 || data.monthlyPcQcCnt > 0,
        );

        // 연관 키워드 결과 추가
        setResults((prevResults) => [
          ...prevResults,
          {
            keywordData: result.data[0],
            relatedKeywords,
            isLoading: false,
            error: null,
          },
        ]);
      } else {
        // 오류 처리
        setResults((prevResults) => [
          ...prevResults,
          {
            keywordData: {} as KeywordResponse,
            relatedKeywords: [],
            isLoading: false,
            error: result.error || "키워드 데이터를 가져오는데 실패했습니다.",
          },
        ]);
      }

      // 진행률 업데이트
      const newProcessedCount = processedCount + 1;
      setProcessedCount(newProcessedCount);

      // 진행률 계산 (0~100%)
      const newProgress = Math.min(
        10 + Math.floor((newProcessedCount / totalKeywords) * 90),
        99,
      );
      setProgress(newProgress);

      // 모든 키워드 처리 완료 체크
      if (keywordsToProcess.current.length === 0) {
        // 처리 완료
        setTimeout(() => {
          setProgress(100);
          setIsSearching(false);
        }, 100);
      } else {
        // 다음 키워드 처리
        processingRef.current = false;
        processNextKeyword();
      }
    } catch (error) {
      console.error(`키워드 '${currentKeyword}' 처리 중 오류:`, error);

      // 오류 처리
      setResults((prevResults) => [
        ...prevResults,
        {
          keywordData: {} as KeywordResponse,
          relatedKeywords: [],
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "알 수 없는 오류가 발생했습니다.",
        },
      ]);

      // 다음 키워드 처리로 진행
      processingRef.current = false;

      // 진행률 업데이트
      const newProcessedCount = processedCount + 1;
      setProcessedCount(newProcessedCount);
      setProgress(
        Math.min(10 + Math.floor((newProcessedCount / totalKeywords) * 90), 99),
      );

      // 계속 진행
      processNextKeyword();
    }
  }, [processedCount, totalKeywords]);

  // 검색 실행 핸들러
  const handleSearch = useCallback(() => {
    // 유효성 검사
    if (!validateSearch()) return;

    // 이전 요청 취소 (있는 경우)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 새 AbortController 생성
    abortControllerRef.current = new AbortController();

    // 줄바꿈으로 분리하여 키워드 배열 생성
    const keywords = searchKeyword
      .split("\n")
      .map((kw) => kw.trim())
      .filter((kw) => kw !== "");

    // 초기화
    setError(null);
    setIsSearching(true);
    setProgress(10); // 시작 진행률
    setResults([]);
    setProcessedCount(0);
    setTotalKeywords(keywords.length);

    // 상태 설정
    keywordsToProcess.current = [...keywords];
    processingRef.current = false;

    // 연관 키워드 처리 시작 - 최대 5개 동시 처리
    const maxConcurrent = 5;
    for (let i = 0; i < Math.min(maxConcurrent, keywords.length); i++) {
      processNextKeyword();
    }
  }, [searchKeyword, validateSearch, processNextKeyword]);

  // 검색 초기화 핸들러
  const handleClear = useCallback(() => {
    // 이전 요청 취소 (있는 경우)
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setSearchKeyword("");
    setIsSearching(false);
    setProgress(0);
    setError(null);
    setResults([]);
    setProcessedCount(0);
    setTotalKeywords(0);
    keywordsToProcess.current = [];
  }, []);

  // 검색 중단 핸들러
  const handleStop = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsSearching(false);
    keywordsToProcess.current = [];
  }, []);

  // 결과 정리 - 메모이제이션
  const processedResults = useMemo(() => {
    return results.map((result) => ({
      ...result,
      // 필요하다면 여기서 추가 가공 가능
    }));
  }, [results]);

  // 중복 제거된 모든 연관 키워드 목록 - 메모이제이션
  const allRelatedKeywords = useMemo(() => {
    const allKeywords = new Set<KeywordResponse>();

    results.forEach((result) => {
      result.relatedKeywords.forEach((keyword) => {
        allKeywords.add(keyword);
      });
    });

    return Array.from(allKeywords);
  }, [results]);

  return {
    searchKeyword,
    setSearchKeyword,
    isSearching,
    progress,
    error,
    keywordCount,
    results: processedResults,
    allRelatedKeywords,
    processedCount,
    totalKeywords,
    handleSearch,
    handleClear,
    handleStop,
    maxKeywords: MAX_KEYWORDS,
  };
}
