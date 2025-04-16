import { createContext, useContext, useState, useEffect } from 'react';
import { useIdleTimer } from 'react-idle-timer';

const IdleTimerContext = createContext();

export const useIdleTimerContext = () => useContext(IdleTimerContext);

export const IdleTimerProvider = ({ children, timeout = 15000 }) => {
  // 15000ms = 15 giây timeout mặc định
  const [isIdle, setIsIdle] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeout);
  const [lastActive, setLastActive] = useState(new Date());

  const handleOnIdle = () => {
    console.log('IdleTimer: User is idle, setting isIdle to true');
    setIsIdle(true);
  };

  const handleOnActive = () => {
    console.log('IdleTimer: User is active');
    // Không tự động cập nhật isIdle để cho phép component con quyết định khi nào reset
  };

  const handleOnAction = () => {
    console.log('IdleTimer: User action detected');
    setLastActive(new Date());
  };

  const { getRemainingTime, reset } = useIdleTimer({
    timeout,
    onIdle: handleOnIdle,
    onActive: handleOnActive,
    onAction: handleOnAction,
    debounce: 500,
    startManually: false, // Bắt đầu tự động ngay khi khởi tạo
    events: [
      'mousemove',
      'keydown',
      'wheel',
      'DOMMouseScroll',
      'mousewheel',
      'mousedown',
      'touchstart',
      'touchmove',
      'MSPointerDown',
      'MSPointerMove',
      'visibilitychange'
    ],
    immediateEvents: []
  });

  // Update remaining time every second
  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getRemainingTime();
      setTimeRemaining(remaining);
      console.log('IdleTimer: Time remaining:', remaining, 'ms');
      
      // Kiểm tra nếu thời gian còn lại là 0
      if (remaining <= 0 && isIdle) {
        console.log('IdleTimer: Time is up while user is idle');
      }
    }, 1000);

    console.log('IdleTimer: Timer initialized with timeout', timeout, 'ms');

    return () => {
      clearInterval(interval);
    };
  }, [getRemainingTime, timeout, isIdle]);

  const resetTimer = () => {
    console.log('IdleTimer: Timer reset manually');
    reset();
    setIsIdle(false);
    setTimeRemaining(timeout);
  };

  const value = {
    isIdle,
    timeRemaining,
    lastActive,
    resetTimer,
    timeout
  };

  return (
    <IdleTimerContext.Provider value={value}>
      {children}
    </IdleTimerContext.Provider>
  );
};

export default IdleTimerContext; 