import { useState, useCallback, useMemo } from "react";
import {
  KeywordState,
  KeywordArrays,
  KeywordCounts,
} from "../types/keyword-combiner";
import { INITIAL_KEYWORDS, ALL_PATTERNS } from "@/constants/combiner";

export const useKeywordCombiner = () => {
  // 키워드 입력 상태
  const [keywords, setKeywords] = useState<KeywordState>(INITIAL_KEYWORDS);

  // 선택된 조합 패턴 상태
  const [selectedPatterns, setSelectedPatterns] = useState<string[]>([]);

  // 결과 상태
  const [result, setResult] = useState<string>("");

  // 키워드 사이 공백 추가 옵션
  const [addSpaceBetweenKeywords, setAddSpaceBetweenKeywords] =
    useState<boolean>(false);

  // 처리 중 상태 (UI 비활성화를 위한 상태)
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // 키워드 변경 핸들러 - 각 키워드 그룹용 개별 핸들러 함수 생성
  const handleKeyword1Change = useCallback((value: string) => {
    setKeywords((prev) => ({ ...prev, keyword1: value }));
  }, []);

  const handleKeyword2Change = useCallback((value: string) => {
    setKeywords((prev) => ({ ...prev, keyword2: value }));
  }, []);

  const handleKeyword3Change = useCallback((value: string) => {
    setKeywords((prev) => ({ ...prev, keyword3: value }));
  }, []);

  const handleKeyword4Change = useCallback((value: string) => {
    setKeywords((prev) => ({ ...prev, keyword4: value }));
  }, []);

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
      "1": keywords.keyword1.split("\n").filter((k) => k.trim() !== ""),
      "2": keywords.keyword2.split("\n").filter((k) => k.trim() !== ""),
      "3": keywords.keyword3.split("\n").filter((k) => k.trim() !== ""),
      "4": keywords.keyword4.split("\n").filter((k) => k.trim() !== ""),
    };
  }, [keywords]);

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

  // 파일 다운로드 핸들러
  const handleDownload = useCallback(() => {
    if (!result) return;

    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "keyword_combinations.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [result]);

  // 조합 가능 여부 체크
  const canCombine = useMemo(() => {
    return (
      selectedPatterns.length > 0 &&
      Object.values(keywordArrays).some((arr) => arr.length > 0)
    );
  }, [selectedPatterns, keywordArrays]);

  return {
    keywords,
    selectedPatterns,
    result,
    addSpaceBetweenKeywords,
    keywordArrays,
    keywordCounts,
    canCombine,
    isProcessing,
    handleKeyword1Change,
    handleKeyword2Change,
    handleKeyword3Change,
    handleKeyword4Change,
    handlePatternChange,
    handleSelectAll,
    resetResults,
    setAddSpaceBetweenKeywords,
    setIsProcessing,
    generateCombinations,
    handleDownload,
  };
};
