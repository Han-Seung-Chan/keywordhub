import { fetchDatalabData } from "@/lib/fetch-data-lab";
import { ApiResult } from "@/types/api";
import { DataLabRequest, DataLabResponse } from "@/types/data-lab";
import { useMutation } from "@tanstack/react-query";

export const useDataLabMutation = () => {
  return useMutation({
    mutationFn: async (
      request: DataLabRequest,
    ): Promise<ApiResult<DataLabResponse>> => {
      return fetchDatalabData(request);
    },
  });
};
