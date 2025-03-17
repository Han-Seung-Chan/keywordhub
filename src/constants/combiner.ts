export const TWO_KEYWORD_PATTERNS = [
  "1+2",
  "1+3",
  "1+4",
  "2+1",
  "2+3",
  "2+4",
  "3+1",
  "3+2",
  "3+4",
  "4+1",
  "4+2",
  "4+3",
];

export const THREE_KEYWORD_PATTERNS = [
  "1+2+3",
  "1+2+4",
  "1+3+2",
  "1+3+4",
  "1+4+2",
  "1+4+3",
  "2+1+3",
  "2+1+4",
  "2+3+1",
  "2+3+4",
  "2+4+1",
  "2+4+3",
  "3+1+2",
  "3+1+4",
  "3+2+1",
  "3+2+4",
  "3+4+1",
  "3+4+2",
  "4+1+2",
  "4+1+3",
  "4+2+1",
  "4+2+3",
  "4+3+1",
  "4+3+2",
];

export const FOUR_KEYWORD_PATTERNS = [
  "1+2+3+4",
  "1+2+4+3",
  "1+3+2+4",
  "1+3+4+2",
  "1+4+2+3",
  "1+4+3+2",
  "2+1+3+4",
  "2+1+4+3",
  "2+3+1+4",
  "2+3+4+1",
  "2+4+1+3",
  "2+4+3+1",
  "3+1+2+4",
  "3+1+4+2",
  "3+2+1+4",
  "3+2+4+1",
  "3+4+1+2",
  "3+4+2+1",
  "4+1+2+3",
  "4+1+3+2",
  "4+2+1+3",
  "4+2+3+1",
  "4+3+1+2",
  "4+3+2+1",
];

export const ALL_PATTERNS = [
  ...TWO_KEYWORD_PATTERNS,
  ...THREE_KEYWORD_PATTERNS,
  ...FOUR_KEYWORD_PATTERNS,
];

// 초기 키워드 상태
export const INITIAL_KEYWORDS = {
  keyword1: "",
  keyword2: "",
  keyword3: "",
  keyword4: "",
};
