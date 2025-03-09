
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { useClubs } from '@/context/ClubsContext';
import { useAuth } from '@/context/AuthContext';
import AuthModal from './AuthModal';

type QueueUpdateProps = {
  clubId: string;
};

const QueueUpdate = ({ clubId }: QueueUpdateProps) => {
  const [queueLength, setQueueLength] = useState<number>(50);
  const [waitTime, setWaitTime] = useState<number>(30);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  
  const { addQueueUpdate } = useClubs();
  const { isAuthenticated, user } = useAuth();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    
    setIsSubmitting(true);
    
    // Add slight delay to simulate server request
    setTimeout(() => {
      addQueueUpdate({
        clubId,
        queueLength,
        waitTime,
        comment,
        userId: user?.id || 'anonymous',
        userName: user?.name || 'Anonymous',
      });
      
      // Reset form
      setComment('');
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <>
      <div className="glass rounded-xl p-6 animate-fade-in">
        <h3 className="text-xl font-bold mb-4 text-white">Update Queue Status</h3>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-nightMuted mb-1">
              Approximate queue length: {queueLength} people
            </label>
            <Slider
              value={[queueLength]}
              min={0}
              max={300}
              step={5}
              onValueChange={(values) => setQueueLength(values[0])}
              className="my-4"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-nightMuted mb-1">
              Estimated wait time: {waitTime} minutes
            </label>
            <Slider
              value={[waitTime]}
              min={0}
              max={180}
              step={5}
              onValueChange={(values) => setWaitTime(values[0])}
              className="my-4"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-nightMuted mb-1">
              Comments (optional)
            </label>
            <Textarea
              placeholder="Add any helpful notes about the current situation..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-nightGray border-nightStroke"
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-nightPurple hover:bg-nightPurple/90 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Update'}
          </Button>
        </form>
      </div>
      
      <AuthModal 
        open={authModalOpen} 
        onOpenChange={setAuthModalOpen} 
        message="Please sign in to submit a queue update"
      />
    </>
  );
};

export default QueueUpdate;
