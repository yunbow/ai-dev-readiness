import { useCallback, useEffect, useState } from "react";
import type { HistoryRecord } from "@/domain/history/types";
import { getResults } from "@/infrastructure/indexedDb";

export function useHistory() {
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setRecords(await getResults());
    setLoading(false);
  }, []);

  useEffect(() => {
    void getResults().then((results) => {
      setRecords(results);
      setLoading(false);
    });
  }, []);

  return { records, loading, refresh };
}
