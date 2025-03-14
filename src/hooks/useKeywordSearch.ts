import { useCallback, useRef, useState } from "react";
import { defaultDataLab } from "@/constants/default-data-lab";
import {
  useSharedKeywordState,
  KeywordSearchResult,
} from "@/store/useSharedKeywordState";
import { fetchBatchKeywordData } from "@/lib/fetch-keywords";
import { fetchDatalabDataBatch } from "@/lib/fetch-data-lab";
import { DataLabRequest } from "@/types/data-lab";

// 배치 크기 정의: 한 번에 처리할 키워드 수
const KEYWORD_BATCH_SIZE = 20;
// 데이터랩 요청당 최대 키워드 수
const DATA_LAB_BATCH_SIZE = 5;

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
    addKeywordResults,
  } = useSharedKeywordState();

  // 최대 허용 키워드 개수
  const maxKeywords = 100;

  // 키워드 처리 상태 관리
  const keywordsToProcess = useRef<string[]>([]);
  const batchIndexRef = useRef<number>(0);
  const [currentBatch, setCurrentBatch] = useState<string[]>([]);
  const processingRef = useRef<boolean>(false);

  // 현재 배치에 대한 결과 저장
  const batchResultsRef = useRef<Map<string, KeywordSearchResult>>(new Map());

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

  // 키워드 배열을 DATA_LAB_BATCH_SIZE 크기의 청크로 분할
  const createKeywordChunks = (keywords: string[]): string[][] => {
    const chunks: string[][] = [];
    for (let i = 0; i < keywords.length; i += DATA_LAB_BATCH_SIZE) {
      chunks.push(keywords.slice(i, i + DATA_LAB_BATCH_SIZE));
    }
    return chunks;
  };

  // 효율적인 배치 처리를 위한 함수
  const processBatch = useCallback(async () => {
    if (
      processingRef.current ||
      batchIndexRef.current >= keywordsToProcess.current.length
    ) {
      // 이미 처리 중이거나 모든 배치가 처리된 경우
      return;
    }

    processingRef.current = true;

    // 다음 배치 키워드 가져오기
    const startIndex = batchIndexRef.current;
    const endIndex = Math.min(
      startIndex + KEYWORD_BATCH_SIZE,
      keywordsToProcess.current.length,
    );
    const currentBatchKeywords = keywordsToProcess.current.slice(
      startIndex,
      endIndex,
    );

    setCurrentBatch(currentBatchKeywords);
    batchResultsRef.current.clear(); // 이전 배치 결과 초기화

    try {
      // 키워드 데이터 병렬 요청
      const keywordResults = await fetchBatchKeywordData(currentBatchKeywords);

      // 키워드를 DATA_LAB_BATCH_SIZE 개씩 그룹화
      const keywordChunks = createKeywordChunks(currentBatchKeywords);

      // 각 키워드 청크에 대한 데이터랩 요청 처리
      for (const chunk of keywordChunks) {
        // PC 요청 생성
        const pcRequest: DataLabRequest = {
          ...defaultDataLab,
          keywordGroups: chunk.map((keyword) => ({
            groupName: keyword,
            keywords: [keyword],
          })),
          device: "pc",
        };

        // MO 요청 생성
        const moRequest: DataLabRequest = {
          ...defaultDataLab,
          keywordGroups: chunk.map((keyword) => ({
            groupName: keyword,
            keywords: [keyword],
          })),
          device: "mo",
        };

        // 두 요청을 배열로 묶어 한 번에 전송
        const requests = [pcRequest, moRequest];
        const [pcResponses, moResponses] =
          await fetchDatalabDataBatch(requests);

        // 응답 처리 및 결과 저장
        for (let i = 0; i < chunk.length; i++) {
          const keyword = chunk[i];
          const pcData = pcResponses[i]?.success ? pcResponses[i].data : null;
          const moData = moResponses[i]?.success ? moResponses[i].data : null;

          // 키워드 결과 객체 생성
          const keywordResult: KeywordSearchResult = {
            keyword,
            keywordData: keywordResults.get(keyword) || null,
            pcData,
            mobileData: moData,
          };

          batchResultsRef.current.set(keyword, keywordResult);
        }
      }

      // 배치의 모든 결과를 한 번에 추가
      const batchResults = Array.from(batchResultsRef.current.values());
      batchResults.forEach((result) => addKeywordResult(result));

      // 진행 상태 업데이트
      batchIndexRef.current = endIndex;
      setProcessCounts(endIndex, keywordsToProcess.current.length);

      // 진행률 계산 (0~100%)
      const newProgress = Math.min(
        10 + Math.floor((endIndex / keywordsToProcess.current.length) * 90),
        99,
      );
      setProgress(newProgress);

      // 모든 배치 처리 완료 체크
      if (endIndex >= keywordsToProcess.current.length) {
        // 처리 완료
        setTimeout(() => {
          setProgress(100);
          setIsSearching(false);
        }, 300);
      } else {
        // 다음 배치 처리
        processingRef.current = false;
        setTimeout(processBatch, 10);
      }
    } catch (error) {
      console.error("배치 처리 중 오류 발생:", error);
      setError("키워드 검색 중 오류가 발생했습니다.");
      setIsSearching(false);
    } finally {
      processingRef.current = false;
    }
  }, [
    addKeywordResult,
    addKeywordResults,
    setError,
    setIsSearching,
    setProcessCounts,
    setProgress,
  ]);

  // 검색 실행 핸들러
  const handleSearch = useCallback(() => {
    // 유효성 검사
    if (!validateSearch()) return;

    // 줄바꿈으로 분리하여 키워드 배열 생성
    const keywords = searchKeyword
      .split("\n")
      .map((kw) => kw.trim().replace(/\s+/g, ""))
      .filter((kw) => kw !== "");

    console.log(`${keywords.length}개의 키워드 검색 시작:`, keywords);

    // 초기화
    resetAll();
    setError(null);
    setIsSearching(true);
    setProgress(10); // 시작 진행률

    // 상태 설정
    keywordsToProcess.current = keywords;
    batchIndexRef.current = 0;
    processingRef.current = false;
    setCurrentBatch([]);
    batchResultsRef.current.clear();

    // 처리 상태 업데이트
    setProcessCounts(0, keywords.length);
    // 배치 처리 시작
    setTimeout(processBatch, 0);
  }, [
    searchKeyword,
    validateSearch,
    resetAll,
    setError,
    setIsSearching,
    setProgress,
    setProcessCounts,
    processBatch,
  ]);

  // 검색 초기화 핸들러
  const handleClear = useCallback(() => {
    clearSearchKeyword();
    resetAll();
    batchIndexRef.current = 0;
    keywordsToProcess.current = [];
    setCurrentBatch([]);
    batchResultsRef.current.clear();
  }, [clearSearchKeyword, resetAll]);

  // 키워드 개수 계산
  const keywordCount = searchKeyword
    ? searchKeyword.split("\n").filter((kw) => kw.trim() !== "").length
    : 0;

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
    currentBatch,
    processedCount: batchIndexRef.current,
    totalKeywords: keywordsToProcess.current.length,
  };
}
