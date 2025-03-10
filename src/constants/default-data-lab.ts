import { DataLabRequest } from "@/types/data-lab";
import { getDataLabDateRange } from "@/utils/date";

const { startDate, endDate } = getDataLabDateRange();

export const defaultDataLab: DataLabRequest = {
  startDate,
  endDate,
  timeUnit: "month",
  keywordGroups: [{ groupName: "", keywords: [""] }],
};
