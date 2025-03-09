
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Navbar from '@/components/Navbar';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-nightShade">
      <Navbar />
      
      <div className="container px-4 mx-auto flex flex-col items-center justify-center" style={{ height: 'calc(100vh - 160px)' }}>
        <div className="text-center animate-fade-in">
          <h1 className="text-9xl font-bold text-nightPurple mb-4 animate-pulse-gentle">404</h1>
          <p className="text-xl text-white mb-6">This page seems to have slipped past the bouncer.</p>
          <Link 
            to="/" 
            className="inline-block glass border border-nightPurple px-6 py-3 rounded-full text-white hover:bg-nightPurple/20 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
