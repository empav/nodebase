import { PAGINATION } from "@/config/constants";
import { useEffect, useState } from "react";

interface Props<
  T extends {
    search: string;
    page: number;
  },
> {
  params: T;
  setParams: (newParams: T) => void;
  debounceMs?: number;
}

export function useEntitySearch<T extends { search: string; page: number }>({
  params,
  setParams,
  debounceMs = 500,
}: Props<T>) {
  const [localSearch, setLocalSearch] = useState(params.search);

  useEffect(() => {
    if (localSearch === "" && params.search !== "") {
      setParams({ ...params, page: PAGINATION.DEFAULT_PAGE, search: "" });
      return;
    }

    const timer = setTimeout(() => {
      if (localSearch !== params.search) {
        setParams({
          ...params,
          page: PAGINATION.DEFAULT_PAGE,
          search: localSearch,
        });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localSearch, params.search, setParams, params, debounceMs]);

  useEffect(() => {
    setLocalSearch(params.search);
  }, [params.search]);

  return { searchValue: localSearch, onSearchChange: setLocalSearch };
}
