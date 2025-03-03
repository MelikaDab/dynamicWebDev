import { useState, useEffect } from "react";
import { groceryFetcher } from "./groceryFetcher";
import React from "react";

export function useGroceryFetch(source) {
    const [isLoading, setIsLoading] = useState(false); 
    const [error, setError] = useState(null)    
    const [groceryData, setGroceryData] = React.useState([]);
    useEffect(() => {
        let isStale = false;
        fetchData(source);
        async function fetchData(url) {

          setGroceryData([]);
          setError(null);
          setIsLoading(true);
          try {
              const response = await groceryFetcher.fetch(url);
              
              isStale && setGroceryData(response);
          } catch (error) {
              isStale && setError(error);
              console.error(`Could not fetch products: ${error}`)
          }

          finally {
              isStale && setIsLoading(false);
          }

        
        }
        isStale = true;

    }, [source])

    return { isLoading, error, groceryData}
}