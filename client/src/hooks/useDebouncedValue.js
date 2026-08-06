import { useEffect, useState } from 'react';

// Delays updating the returned value until `value` has stopped changing for
// `delay` ms. Used to avoid firing a network request on every keystroke
// (marketplace search box, price/GSM number inputs).
const useDebouncedValue = (value, delay = 400) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
};

export default useDebouncedValue;
