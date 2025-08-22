'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const LoadingContext = createContext({
  isLoading: true,
  setIsLoading: () => {}
});

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);
