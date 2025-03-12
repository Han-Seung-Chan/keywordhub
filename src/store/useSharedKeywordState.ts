import { create } from "zustand";
import { KeywordData } from "@/types/table";
import { ApiResult } from "@/types/api";
import { KeywordResponse } from "@/types/keyword-tool";
import { DataLabResponse } from "@/types/data-lab";

// 키워드 검색 결과 타입
export interface KeywordSearchResult {
  keyword: string;
  keywordData: ApiResult<KeywordResponse> | null;
  pcData: DataLabResponse | null;
  mobileData: DataLabResponse | null;
}

interface SharedKeywordState {
  // 키워드 입력 상태
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  clearSearchKeyword: () => void;

  // 검색 진행 상태
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;

  // 로딩 상태
  progress: number;
  setProgress: (progress: number) => void;

  // 오류 상태
  error: string | null;
  setError: (error: string | null) => void;

  // 키워드 결과
  keywordResults: KeywordSearchResult[];
  addKeywordResult: (result: KeywordSearchResult) => void;

  // 처리 상태
  processedCount: number;
  totalCount: number;
  setProcessCounts: (processed: number, total: number) => void;

  // 변환된 테이블 데이터
  tableData: KeywordData[];
  setTableData: (data: KeywordData[]) => void;

  // 상태 초기화
  resetAll: () => void;
}

// 공유 상태 스토어 생성
export const useSharedKeywordState = create<SharedKeywordState>((set, get) => ({
  // 키워드 입력 상태
  searchKeyword: "",
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
  clearSearchKeyword: () => set({ searchKeyword: "" }),

  // 검색 진행 상태
  isSearching: false,
  setIsSearching: (isSearching) => set({ isSearching }),

  // 로딩 상태
  progress: 0,
  setProgress: (progress) => set({ progress }),

  // 오류 상태
  error: null,
  setError: (error) => set({ error }),

  // 키워드 결과
  keywordResults: [],
  addKeywordResult: (result) =>
    set((state) => ({
      keywordResults: [...state.keywordResults, result],
    })),

  // 처리 상태
  processedCount: 0,
  totalCount: 0,
  setProcessCounts: (processed, total) =>
    set({
      processedCount: processed,
      totalCount: total,
    }),

  // 변환된 테이블 데이터
  tableData: [],
  setTableData: (data) => set({ tableData: data }),

  // 상태 초기화
  resetAll: () =>
    set({
      isSearching: false,
      progress: 0,
      error: null,
      keywordResults: [],
      processedCount: 0,
      totalCount: 0,
      tableData: [],
    }),
}));
