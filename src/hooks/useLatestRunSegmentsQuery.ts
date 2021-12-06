import axios from "axios";
import { useQuery } from "react-query";
import { RunSegmentsData } from "../../pages/api/latestRunSegments";

type OnSuccessType = (data: RunSegmentsData) => Promise<unknown> | void;

export const useLatestRunSegmentsQuery = ({
  onSuccess,
}: {
  onSuccess?: OnSuccessType;
} = {}) =>
  useQuery<RunSegmentsData>(
    ["latestRunSegments"],
    async () => {
      const { data } = await axios.get(`/api/latestRunSegments`);
      return data;
    },
    { onSuccess }
  );
