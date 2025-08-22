import { useState } from "react";

export default function useFetch(callback: any) {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fn = async (...args: any) => {
    setLoading(true);
    setError(null);

    try {
      // fetch api response
      const response = await callback(...args);
      setData(response);
      setError(null);
    } catch (error: any) {
      setError(error);
    } finally {
      // remove loading state
      setLoading(false);
    }
  };

  return { data, loading, error, fn };
};