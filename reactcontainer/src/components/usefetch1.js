import { useState, useEffect } from "react";
import axios from "axios";

const useFetch = (url) => {
  const token = localStorage.getItem('access_token') ? 'Bearer ' + localStorage.getItem('access_token') : null;
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(url, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: token,
          },
        });
        setData(response.data);
      } catch (error) {
        setError(error);
      } finally {
        setIsLoading(false);
      }
    };

    
    fetchData();
    const intervalId = setInterval(fetchData, 10000);

    
    return () => clearInterval(intervalId);
  }, [url, token]);

  return { data, isLoading, error };
};

export default useFetch;
