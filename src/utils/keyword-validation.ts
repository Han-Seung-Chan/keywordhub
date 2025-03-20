export function countKeywords(searchKeyword: string): number {
  if (!searchKeyword) return 0;
  return searchKeyword.split("\n").filter((kw) => kw.trim() !== "").length;
}

export function hasSpecialCharacters(searchKeyword: string): boolean {
  return /[^a-zA-Z0-9가-힣\s]/.test(searchKeyword);
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}

export function validateKeywordInput(
  searchKeyword: string,
  maxKeywords: number,
  noCount?: boolean,
): ValidationResult {
  const trimmedKeyword = searchKeyword.trim();
  const keywordCount = countKeywords(searchKeyword);

  if (!trimmedKeyword && !noCount) {
    return { isValid: false, errorMessage: "검색할 키워드를 입력해주세요." };
  }

  if (hasSpecialCharacters(searchKeyword)) {
    return {
      isValid: false,
      errorMessage: "검색어에 특수문자를 사용할 수 없습니다.",
    };
  }

  if (keywordCount > maxKeywords) {
    return {
      isValid: false,
      errorMessage: `최대 ${maxKeywords}개의 키워드만 검색할 수 있습니다.`,
    };
  }

  if (keywordCount === 0 && !noCount) {
    return { isValid: false, errorMessage: "검색할 키워드를 입력해주세요." };
  }

  return { isValid: true, errorMessage: null };
}
