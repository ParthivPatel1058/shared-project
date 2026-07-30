import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initAnalytics, trackPageView } from '@/lib/analytics';

/**
 * Reports client-side navigations to GA4.
 *
 * GA4's built-in page_view only fires on a full document load, so in a SPA
 * every route change after the first would go unrecorded. Mount this once
 * inside the router.
 */
export default function RouteAnalytics() {
  const location = useLocation();

  useEffect(() => {
    initAnalytics();
  }, []);

  useEffect(() => {
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return null;
}
