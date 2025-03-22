import { useState, useCallback, useMemo, useRef } from "react";
import {
  KeywordState,
  KeywordArrays,
  KeywordCounts,
} from "../types/keyword-combiner";
import { INITIAL_KEYWORDS, ALL_PATTERNS } from "@/constants/combiner";
import { validateKeywordInput } from "@/utils/keyword-validation";

// 최대 허용 키워드 개수
const MAX_KEYWORDS = 100;

export const useKeywordCombiner = () => {
  const keywordsRef = useRef<KeywordState>(INITIAL_KEYWORDS);
  const [keywords, setKeywords] = useState<KeywordState>(INITIAL_KEYWORDS);
  const [error, setError] = useState<string>("");

  // 선택된 조합 패턴 상태
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([]);

  // 결과 상태
  const [result, setResult] = useState<string>("");

  // 키워드 사이 공백 추가 옵션
  const [addSpaceBetweenKeywords, setAddSpaceBetweenKeywords] =
    useState<boolean>(false);

  // 디바운스 타이머 ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 유효성 검사
  const validationStatus = useMemo(() => {
    const validateKeyword1 = validateKeywordInput(
      keywordsRef.current.keyword1,
      MAX_KEYWORDS,
      true,
    );
    if (!validateKeyword1.isValid) return validateKeyword1;

    const validateKeyword2 = validateKeywordInput(
      keywordsRef.current.keyword2,
      MAX_KEYWORDS,
      true,
    );
    if (!validateKeyword2.isValid) return validateKeyword2;

    const validateKeyword3 = validateKeywordInput(
      keywordsRef.current.keyword3,
      MAX_KEYWORDS,
      true,
    );
    if (!validateKeyword3.isValid) return validateKeyword3;

    const validateKeyword4 = validateKeywordInput(
      keywordsRef.current.keyword4,
      MAX_KEYWORDS,
      true,
    );
    if (!validateKeyword4.isValid) return validateKeyword4;

    return { isValid: true, errorMessage: null };
  }, [
    keywordsRef.current.keyword1,
    keywordsRef.current.keyword2,
    keywordsRef.current.keyword3,
    keywordsRef.current.keyword4,
    MAX_KEYWORDS,
  ]);

  // 검색 유효성 검사
  const validateSearch = useCallback((): boolean => {
    if (!validationStatus.isValid) {
      setError(validationStatus.errorMessage);
      return false;
    }
    setError("");
    return true;
  }, [validationStatus, setError]);

  // 디바운스 함수로 상태 업데이트 최적화
  const updateKeywordsWithDebounce = useCallback(
    (newKeywords: KeywordState) => {
      // 내부 참조 즉시 업데이트
      keywordsRef.current = newKeywords;

      // 이전 타이머 취소
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // 300ms 디바운스로 상태 업데이트
      debounceTimerRef.current = setTimeout(() => {
        setKeywords(newKeywords);
      }, 300);
    },
    [],
  );

  // 키워드 변경 핸들러 - 각 키워드 그룹용 개별 핸들러 함수 생성
  const handleKeyword1Change = useCallback(
    (value: string) => {
      const newKeywords = { ...keywordsRef.current, keyword1: value };
      updateKeywordsWithDebounce(newKeywords);
    },
    [updateKeywordsWithDebounce],
  );

  const handleKeyword2Change = useCallback(
    (value: string) => {
      const newKeywords = { ...keywordsRef.current, keyword2: value };
      updateKeywordsWithDebounce(newKeywords);
    },
    [updateKeywordsWithDebounce],
  );

  const handleKeyword3Change = useCallback(
    (value: string) => {
      const newKeywords = { ...keywordsRef.current, keyword3: value };
      updateKeywordsWithDebounce(newKeywords);
    },
    [updateKeywordsWithDebounce],
  );

  const handleKeyword4Change = useCallback(
    (value: string) => {
      const newKeywords = { ...keywordsRef.current, keyword4: value };
      updateKeywordsWithDebounce(newKeywords);
    },
    [updateKeywordsWithDebounce],
  );

  // 체크박스 변경 핸들러
  const handlePatternChange = useCallback(
    (pattern: string, checked: boolean) => {
      setSelectedPatterns((prev) => {
        if (checked) {
          return [...prev, pattern];
        } else {
          return prev.filter((p) => p !== pattern);
        }
      });
    },
    [],
  );

  // 패턴 전체 선택/해제 핸들러
  const handleSelectAll = useCallback(() => {
    if (selectedPatterns.length === 0) {
      setSelectedPatterns(ALL_PATTERNS);
    } else {
      setSelectedPatterns([]);
    }
  }, [selectedPatterns]);

  // 결과 초기화 핸들러
  const resetResults = useCallback(() => {
    setResult("");
  }, []);

  // 각 키워드 그룹을 배열로 변환
  const keywordArrays = useMemo<KeywordArrays>(() => {
    return {
      "1": keywordsRef.current.keyword1
        .split("\n")
        .filter((k) => k.trim() !== ""),
      "2": keywordsRef.current.keyword2
        .split("\n")
        .filter((k) => k.trim() !== ""),
      "3": keywordsRef.current.keyword3
        .split("\n")
        .filter((k) => k.trim() !== ""),
      "4": keywordsRef.current.keyword4
        .split("\n")
        .filter((k) => k.trim() !== ""),
    };
  }, [keywordsRef.current]);

  // 키워드 개수 계산
  const keywordCounts = useMemo<KeywordCounts>(() => {
    return {
      "1": keywordArrays["1"].length,
      "2": keywordArrays["2"].length,
      "3": keywordArrays["3"].length,
      "4": keywordArrays["4"].length,
    };
  }, [keywordArrays]);

  // 조합 결과 생성
  const generateCombinations = useCallback(() => {
    // 유효성 검사
    if (!validateSearch()) return;

    const combinations: string[] = [];

    selectedPatterns.forEach((pattern) => {
      const parts = pattern.split("+");

      // 패턴에 있는 각 그룹의 키워드들이 있는지 확인
      const hasAllParts = parts.every((part) => keywordArrays[part].length > 0);

      if (hasAllParts) {
        // 첫 번째 그룹의 모든 키워드에 대해
        keywordArrays[parts[0]].forEach((firstKeyword) => {
          // 두 번째 그룹의 모든 키워드에 대해
          keywordArrays[parts[1]].forEach((secondKeyword) => {
            if (parts.length === 2) {
              // 2개 키워드 조합
              const separator = addSpaceBetweenKeywords ? " " : "";
              combinations.push(`${firstKeyword}${separator}${secondKeyword}`);
            } else if (parts.length === 3) {
              // 3개 키워드 조합
              keywordArrays[parts[2]].forEach((thirdKeyword) => {
                const separator = addSpaceBetweenKeywords ? " " : "";
                combinations.push(
                  `${firstKeyword}${separator}${secondKeyword}${separator}${thirdKeyword}`,
                );
              });
            } else if (parts.length === 4) {
              // 4개 키워드 조합
              keywordArrays[parts[2]].forEach((thirdKeyword) => {
                keywordArrays[parts[3]].forEach((fourthKeyword) => {
                  const separator = addSpaceBetweenKeywords ? " " : "";
                  combinations.push(
                    `${firstKeyword}${separator}${secondKeyword}${separator}${thirdKeyword}${separator}${fourthKeyword}`,
                  );
                });
              });
            }
          });
        });
      }
    });

    // 중복 제거 및 정렬
    const uniqueCombinations = [...new Set(combinations)].sort();

    // 결과 설정
    setResult(uniqueCombinations.join("\n"));
  }, [selectedPatterns, keywordArrays, addSpaceBetweenKeywords]);

  // 조합 가능 여부 체크
  const canCombine = useMemo(() => {
    const hasDataInMultipleArrays2 =
      Object.values(keywordArrays).filter((subArr) => subArr.length > 0)
        .length >= 2;

    return (
      selectedPatterns.length > 0 &&
      Object.values(keywordArrays).some((arr) => arr.length > 0) &&
      Object.values(keywordArrays).filter((subArr) => subArr.length > 0)
        .length >= 2
    );
  }, [selectedPatterns, keywordArrays]);

  // 엑셀 다운로드용 데이터 변환
  const getExcelData = useCallback(() => {
    if (!result) return [];

    return result.split("\n").map((keyword, index) => ({
      id: index + 1,
      keyword,
    }));
  }, [result]);

  const getExcelColumns = useCallback(() => {
    return [
      { key: "id", header: "번호", width: 50 },
      { key: "keyword", header: "키워드", width: 200 },
    ];
  }, []);

  return {
    keywords,
    selectedPatterns,
    result,
    addSpaceBetweenKeywords,
    keywordArrays,
    keywordCounts,
    canCombine,
    error,
    handleKeyword1Change,
    handleKeyword2Change,
    handleKeyword3Change,
    handleKeyword4Change,
    handlePatternChange,
    handleSelectAll,
    resetResults,
    setAddSpaceBetweenKeywords,
    generateCombinations,
    getExcelData,
    getExcelColumns,
  };
};
