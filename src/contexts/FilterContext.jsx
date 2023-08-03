import React, { createContext, useState } from 'react';

// Create new context
export const FilterContext = createContext();

// Create a provider component
export const FilterProvider = ({ children }) => {
  const [filterIsActive, setIsActive] = useState(false);
  const filterHandleClick = () => {
    setIsActive(!filterIsActive);
  };

  return (
    <FilterContext.Provider value={{ filterIsActive, filterHandleClick }}>
      {children}
    </FilterContext.Provider>
  );
};
