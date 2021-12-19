import axios, { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { RunsApiRequest, RunsApiResponse } from "../../pages/api/runs";
import { useAppContext } from "../context/AppContext";

interface RunsData extends RunsApiResponse {
  refetchRunsData: () => void;
}

export const useRunsData = () => {
  const { runningTime, setRunningTime } = useAppContext()!;

  const { data, refetch: refetchRunsData } = useQuery<RunsApiResponse>(
    ["runs"],
    async () => {
      const { data } = await axios.get<
        RunsApiRequest,
        AxiosResponse<RunsApiResponse>
      >("/api/runs");
      return data;
    },
    {
      onSuccess: ({ totalTime }) => {
        if (!runningTime) {
          setRunningTime(totalTime);
        }
      },
      refetchOnMount: false,
    }
  );
  return ({ ...data, refetchRunsData } ?? {}) as RunsData;
};
