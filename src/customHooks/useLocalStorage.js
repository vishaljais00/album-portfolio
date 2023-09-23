import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // Get the stored value from localStorage (if it exists) or use the initialValue
  const storedValue = JSON.parse(localStorage.getItem(key)) || initialValue;

  // Create a state to hold the current value
  const [value, setValue] = useState(storedValue);

  // Update the localStorage value whenever the state changes
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default useLocalStorage;
