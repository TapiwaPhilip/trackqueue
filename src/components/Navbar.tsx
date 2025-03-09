
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, Menu, X, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import AuthModal from './AuthModal';
import { useClubs } from '@/context/ClubsContext';
import Logo from './Logo';

const Navbar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { refreshClubs, isLoading } = useClubs();
  const location = useLocation();
  
  const handleScroll = () => {
    if (window.scrollY > 10) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          scrolled || searchOpen || menuOpen ? 'glass py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container px-4 mx-auto flex items-center justify-between">
          <Link 
            to="/" 
            className="text-2xl font-bold flex items-center text-white transition-transform hover:scale-105"
          >
            <Logo className="mr-2" />
            <span className="text-nightPurple">Track</span>
            <span>Queue</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            {searchOpen ? (
              <div className="relative animate-fade-in">
                <input
                  type="text"
                  placeholder="Search clubs..."
                  className="bg-nightGray py-2 pl-10 pr-4 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-nightPurple"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-nightMuted" />
                <button 
                  className="absolute right-3 top-2.5 text-nightMuted hover:text-white"
                  onClick={() => setSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button 
                className="text-nightMuted hover:text-white transition-colors"
                onClick={() => setSearchOpen(true)}
              >
                <Search className="h-5 w-5" />
              </button>
            )}
            
            <button 
              className={`flex items-center space-x-1 text-nightMuted hover:text-white transition-colors ${isLoading ? 'animate-spin' : ''}`}
              onClick={refreshClubs}
              disabled={isLoading}
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-nightMuted">
                  Hi, <span className="text-white font-medium">{user?.name}</span>
                </span>
                <Button 
                  variant="outline" 
                  className="border-nightStroke hover:bg-nightStroke" 
                  onClick={logout}
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                variant="outline" 
                className="border-nightStroke hover:bg-nightStroke"
                onClick={() => setAuthModalOpen(true)}
              >
                Sign In
              </Button>
            )}
          </div>
          
          <button 
            className="md:hidden text-nightMuted hover:text-white transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        
        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden glass mt-3 px-4 py-6 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search clubs..."
                  className="bg-nightGray py-2 pl-10 pr-4 rounded-full w-full focus:outline-none focus:ring-2 focus:ring-nightPurple"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-nightMuted" />
              </div>
              
              <button 
                className="flex items-center space-x-2 py-2 text-nightMuted hover:text-white transition-colors"
                onClick={refreshClubs}
                disabled={isLoading}
              >
                <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
              </button>
              
              {isAuthenticated ? (
                <>
                  <div className="py-2 text-sm text-nightMuted">
                    Signed in as <span className="text-white font-medium">{user?.name}</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-nightStroke hover:bg-nightStroke" 
                    onClick={logout}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button 
                  variant="outline" 
                  className="border-nightStroke hover:bg-nightStroke w-full"
                  onClick={() => {
                    setAuthModalOpen(true);
                    setMenuOpen(false);
                  }}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </nav>
      
      {/* Add spacer for fixed navbar */}
      <div className="h-20"></div>
      
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
};

export default Navbar;
