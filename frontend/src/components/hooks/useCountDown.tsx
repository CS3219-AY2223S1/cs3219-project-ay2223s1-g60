import React, { useState, useEffect } from 'react';

const useCountDown = (seconds: number) => {
  const [countDown, setCountDown] = useState(seconds);

  useEffect(() => {
    const interval = setInterval(() => setCountDown(countDown - 1), 1000);
    return () => clearInterval(interval);
  }, [countDown]);

  const extendTime = (extendSec: number) => setCountDown(countDown + extendSec);

  return { currTime: countDown < 0 ? 0 : countDown, extendTime };
};

const formatTime = (seconds: number) => {
  const localeOpts = { minimumIntegerDigits: 2 };
  return `${Math.floor(seconds / 60).toLocaleString('en-US', localeOpts)} : ${(
    seconds % 60
  ).toLocaleString('en-US', localeOpts)}`;
};

export { useCountDown, formatTime };
