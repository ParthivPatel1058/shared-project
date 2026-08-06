import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const NotFound = () => {
  const location = useLocation();
  const { tx } = useLanguage();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center">
        <h1 className="mb-4 font-display text-6xl font-bold text-foreground">404</h1>
        <p className="mb-6 text-xl text-muted-foreground">
          {tx('Oops! Page not found', 'क्षमा करें! पेज नहीं मिला')}
        </p>
        {/* Link, not <a href>: a raw anchor forces a full page reload. */}
        <Link to="/" className="font-semibold text-primary underline-offset-4 hover:underline">
          {tx('Return to Home', 'होम पर वापस जाएं')}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
