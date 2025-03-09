
import { MouseEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Share2, Copy, CheckIcon, Twitter, FacebookIcon, InstagramIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

type SocialShareProps = {
  clubName: string;
  queueLength: number;
  waitTime: number;
};

const SocialShare = ({ clubName, queueLength, waitTime }: SocialShareProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  
  const shareText = `Currently at ${clubName}: Queue length is ~${queueLength} people with ~${waitTime} minute wait. Check QTracker for real-time updates!`;
  const shareUrl = window.location.href;
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText + ' ' + shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Link copied!",
      description: "Share link has been copied to clipboard",
    });
  };
  
  const handleSocialShare = (e: MouseEvent, platform: string) => {
    e.preventDefault();
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(window.location.href)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(shareText)}`;
        break;
      case 'instagram':
        // Instagram doesn't have a direct sharing URL, typically stories are shared via mobile app
        toast({
          title: "Instagram Sharing",
          description: "Take a screenshot and share on Instagram!",
        });
        return;
    }
    
    // Open share dialog
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
    
    setIsOpen(false);
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="glass border-nightStroke flex items-center space-x-2 hover:border-nightPurple transition-colors"
      >
        <Share2 className="h-4 w-4" />
        <span>Share</span>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] glass border-nightStroke animate-scale-up">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">
              Share Queue Update
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-nightMuted mb-4">{shareText}</p>
            
            <div className="flex flex-col space-y-3">
              <Button
                variant="outline"
                className="w-full flex justify-between items-center glass border-nightStroke hover:border-nightPurple transition-colors"
                onClick={copyToClipboard}
              >
                <div className="flex items-center">
                  <Copy className="h-4 w-4 mr-2" />
                  <span>Copy link</span>
                </div>
                
                {copied && <CheckIcon className="h-4 w-4 text-nightGreen" />}
              </Button>
              
              <Button
                variant="outline"
                className="w-full flex items-center justify-center glass border-nightStroke hover:border-nightPurple transition-colors"
                onClick={(e) => handleSocialShare(e, 'twitter')}
              >
                <Twitter className="h-4 w-4 mr-2" />
                <span>Share on Twitter</span>
              </Button>
              
              <Button
                variant="outline"
                className="w-full flex items-center justify-center glass border-nightStroke hover:border-nightPurple transition-colors"
                onClick={(e) => handleSocialShare(e, 'facebook')}
              >
                <FacebookIcon className="h-4 w-4 mr-2" />
                <span>Share on Facebook</span>
              </Button>
              
              <Button
                variant="outline"
                className="w-full flex items-center justify-center glass border-nightStroke hover:border-nightPurple transition-colors"
                onClick={(e) => handleSocialShare(e, 'instagram')}
              >
                <InstagramIcon className="h-4 w-4 mr-2" />
                <span>Share on Instagram</span>
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SocialShare;
