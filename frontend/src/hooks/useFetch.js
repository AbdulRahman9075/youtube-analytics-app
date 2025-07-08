import { useEffect, useState } from 'react';

function useAbortableFetch(url,maxRetries=2,retryDelay=1000) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    let retryCount =0;
    async function fetchData() {
      while(retryCount < maxRetries){
        try {
          setLoading(true);
          
          const token = localStorage.getItem('token');

          const response = await fetch(url, 
            { 
              signal: controller.signal,headers: token ? { Authorization: `Bearer ${token}`,'Content-Type': 'application/json'} : {'Content-Type': 'application/json'}

            });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            //log error to backend
            fetch('/api/logerror', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                source: 'useAbortableFetch',
                message: errorData.message || 'Unknown backend error',
                url,
                time: new Date().toISOString()
              })
            }).catch(() => {}); // Don't block on logging
            




            throw new Error('Server response was not ok');
          }

          const result = await response.json();
          setData(result);
          setError(null);
          return;
          
        } catch (err) {
          if (err.name === 'AbortError') return;
          
          if (err.message.includes("Unexpected end of JSON input")) {
              console.warn("Empty JSON received, retrying...");
              retryCount++;
              await new Promise(res => setTimeout(res, retryDelay));
              continue;
          }

          fetch('/api/logerror', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              source: 'useAbortableFetch',
              message: err.message,
              url,
              time: new Date().toISOString()
            })
          }).catch(() => {});

          setError(err.message);
          break;
          
        } finally {
          setLoading(false);
        }
      }
    }

  fetchData();

  return () => controller.abort();
  }, [url,maxRetries,retryDelay]);

  return { data, loading, error };
}

export default useAbortableFetch;


