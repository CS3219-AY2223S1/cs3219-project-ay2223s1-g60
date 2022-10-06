import React, { useState, useEffect } from 'react';

const useCountDown = (seconds: number) => {
  const [countDown, setCountDown] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => setCountDown(countDown - 1), 1000);
    return () => clearInterval(interval);
  }, [countDown]);

  return countDown;
};

export default useCountDown;
