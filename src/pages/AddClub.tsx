
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import AddClubForm from '@/components/AddClubForm';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/use-toast';

const AddClub = () => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    // Show a message if user is not authenticated
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "You need to sign in to add a new club.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, toast]);
  
  return (
    <div className="min-h-screen bg-nightShade">
      <Navbar />
      
      <main className="container px-4 mx-auto pt-8 pb-20">
        <Link 
          to="/" 
          className="inline-flex items-center text-nightMuted hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Home
        </Link>
        
        <div className="max-w-md mx-auto">
          {isAuthenticated ? (
            <AddClubForm />
          ) : (
            <div className="glass rounded-xl p-6 text-center animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-4">Authentication Required</h2>
              <p className="text-nightMuted mb-6">
                You need to sign in to add a new club to our database.
              </p>
              <Link 
                to="/"
                className="inline-block bg-nightPurple hover:bg-nightPurple/80 text-white px-4 py-2 rounded-md transition-colors"
              >
                Back to Home
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-8 border-t border-nightStroke">
        <div className="container px-4 mx-auto text-center">
          <p className="text-sm text-nightMuted">
            © {new Date().getFullYear()} QTracker - Real-time nightclub queue tracking
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AddClub;
