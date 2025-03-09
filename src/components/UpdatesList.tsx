
import { Clock, Users, MessageCircle } from 'lucide-react';
import type { QueueUpdate } from '@/lib/mockData';
import { formatTimeAgo } from '@/lib/mockData';

type UpdatesListProps = {
  updates: QueueUpdate[];
};

const UpdatesList = ({ updates }: UpdatesListProps) => {
  if (updates.length === 0) {
    return (
      <div className="text-center py-8 glass rounded-xl">
        <p className="text-nightMuted">No updates yet. Be the first to share!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {updates.map((update, index) => (
        <div 
          key={update.id}
          className={`glass rounded-xl p-4 transition-all duration-300 hover:border-nightPurple animate-fade-in`}
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-nightPurple flex items-center justify-center text-white font-medium">
                {update.userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-medium text-white">{update.userName}</h4>
                <p className="text-xs text-nightMuted">{formatTimeAgo(update.timestamp)}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="glass rounded-lg p-3 flex items-center">
              <Users className="h-4 w-4 text-nightPurple mr-2" />
              <div>
                <p className="text-xs text-nightMuted">Queue Length</p>
                <p className="font-medium text-white">{update.queueLength} people</p>
              </div>
            </div>
            <div className="glass rounded-lg p-3 flex items-center">
              <Clock className="h-4 w-4 text-nightBlue mr-2" />
              <div>
                <p className="text-xs text-nightMuted">Wait Time</p>
                <p className="font-medium text-white">{update.waitTime} minutes</p>
              </div>
            </div>
          </div>
          
          {update.comment && (
            <div className="glass rounded-lg p-3 flex items-start">
              <MessageCircle className="h-4 w-4 text-nightPink mr-2 mt-0.5" />
              <div>
                <p className="text-xs text-nightMuted">Comment</p>
                <p className="text-sm text-white">{update.comment}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UpdatesList;
