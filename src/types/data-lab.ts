export interface KeywordGroup {
  groupName: string;
  keywords: string[];
}

export interface DataLabRequest {
  startDate: string;
  endDate: string;
  timeUnit: "date" | "week" | "month";
  keywordGroups: KeywordGroup[];
  device?: "pc" | "mo" | "";
  gender?: "m" | "f" | "";
  ages?: string[];
}

export interface DataLabResponse {
  startDate: string;
  endDate: string;
  timeUnit: string;
  results: {
    title: string;
    keywords: string[];
    data: {
      period: string;
      ratio: number;
    }[];
  }[];
}
