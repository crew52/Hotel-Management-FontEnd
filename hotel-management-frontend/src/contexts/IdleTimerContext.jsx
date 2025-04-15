import { createContext, useContext, useState, useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';

const IdleTimerContext = createContext();

export const useIdleTimerContext = () => useContext(IdleTimerContext);

export const IdleTimerProvider = ({ children, timeout = 300000, onIdle }) => {
  // 300000ms = 5 minutes default timeout
  const [isIdle, setIsIdle] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeout);
  const [lastActive, setLastActive] = useState(new Date());

  const handleOnIdle = () => {
    setIsIdle(true);
    if (onIdle) {
      onIdle();
    }
  };

  const handleOnActive = () => {
    setIsIdle(false);
  };

  const handleOnAction = () => {
    setLastActive(new Date());
  };

  const { getRemainingTime, reset } = useIdleTimer({
    timeout,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500
  });

  // Update remaining time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(getRemainingTime());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [getRemainingTime]);

  const resetTimer = () => {
    reset();
    setIsIdle(false);
  };

  const value = {
    isIdle,
    timeRemaining,
    lastActive,
    resetTimer
  };

  return (
    <IdleTimerContext.Provider value={value}>
      {children}
    </IdleTimerContext.Provider>
  );
};

export default IdleTimerContext; 