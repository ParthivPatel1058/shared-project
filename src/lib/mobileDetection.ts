// Utility to detect if app is running in mobile/APK context
export const isMobileApp = (): boolean => {
  // Check for common mobile app indicators
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isApplix = window.location.hostname.includes('applix') || 
                   document.referrer.includes('applix');
  const isCapacitor = !!(window as any).Capacitor;
  
  return isStandalone || isApplix || isCapacitor;
};

export const getAuthRedirectUrl = (): string => {
  // Use deep link for mobile apps, web URL for browsers
  if (isMobileApp()) {
    return 'bhoomix://auth';
  }
  return `${window.location.origin}/auth-callback`;
};
