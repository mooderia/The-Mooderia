
import { useState, useEffect } from 'react';

export const useConnection = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Detect if running in Electron
  const isElectron = /electron/i.test(navigator.userAgent);
  
  // Detect if running in Capacitor/Mobile App
  const isCapacitor = (window as any).Capacitor !== undefined;

  return { isOffline, isElectron, isCapacitor };
};
