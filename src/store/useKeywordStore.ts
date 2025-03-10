import { create } from "zustand";

interface KeywordState {
  searchKeyword: string;
  setSearchKeyword: (keyword: string) => void;
  clearSearchKeyword: () => void;
}

export const useKeywordStore = create<KeywordState>((set) => ({
  searchKeyword: "",
  setSearchKeyword: (keyword) => set({ searchKeyword: keyword }),
  clearSearchKeyword: () => set({ searchKeyword: "" }),
}));
