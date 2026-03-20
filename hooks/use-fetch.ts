import { useState } from "react";

export default function useFetch<TData, TArgs extends any[]>(
  callback: (...args: TArgs) => Promise<TData>,
) {
  const [data, setData] = useState<TData | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fn = async (...args: TArgs): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      // fetch api response
      const response = await callback(...args);
      setData(response);
      setError(null);
    } catch (err) {
      // catch errors
      setError(err as Error);
      console.error(err)
    } finally {
      // remove loading state
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};