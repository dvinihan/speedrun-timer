import axios from "axios";
import { useQuery } from "react-query";
import { RunSegmentsData } from "../../pages/api/runSegments";

type OnSuccessType = (data: RunSegmentsData) => Promise<unknown> | void;

export const useRunSegmentsQuery = ({
  onSuccess,
}: {
  onSuccess?: OnSuccessType;
} = {}) =>
  useQuery<RunSegmentsData>(
    ["runSegments"],
    async () => {
      const { data } = await axios.get(`/api/runSegments`);
      return data;
    },
    { onSuccess }
  );
