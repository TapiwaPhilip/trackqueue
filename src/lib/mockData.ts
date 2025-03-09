export type Club = {
  id: string;
  name: string;
  location: string;
  image: string;
  description: string;
  currentStatus: {
    queueLength: number;
    waitTime: number; // in minutes
    lastUpdated: string; // ISO date string
    trend: 'increasing' | 'decreasing' | 'stable';
  };
  genres?: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
};

export type QueueUpdate = {
  id: string;
  clubId: string;
  timestamp: string;
  queueLength: number; // approximate number of people
  waitTime: number; // approximate wait time in minutes
  comment: string;
  userId: string;
  userName: string;
};

export const clubs: Club[] = [
  {
    id: '1',
    name: 'Berghain',
    location: 'Berlin, Germany',
    image: 'https://images.unsplash.com/photo-1578760039517-aa4cbe9e707b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1074&q=80',
    description: 'The world-famous techno club located in a former power plant, known for its strict door policy and marathon parties.',
    currentStatus: {
      queueLength: 180,
      waitTime: 120,
      lastUpdated: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      trend: 'increasing',
    },
    genres: ['Techno', 'House', 'Electronic'],
    coordinates: {
      latitude: 52.5111,
      longitude: 13.4399
    }
  },
  {
    id: '2',
    name: 'Watergate',
    location: 'Berlin, Germany',
    image: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    description: 'Electronic music club on the banks of the Spree River with panoramic views and an LED ceiling installation.',
    currentStatus: {
      queueLength: 75,
      waitTime: 45,
      lastUpdated: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      trend: 'stable',
    },
    genres: ['House', 'Tech House', 'Electronic'],
    coordinates: {
      latitude: 52.5031,
      longitude: 13.4416
    }
  },
  {
    id: '3',
    name: 'Tresor',
    location: 'Berlin, Germany',
    image: 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1176&q=80',
    description: 'Legendary techno club in an old power plant featuring industrial aesthetics and underground vibes.',
    currentStatus: {
      queueLength: 120,
      waitTime: 70,
      lastUpdated: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
      trend: 'decreasing',
    },
    genres: ['Techno', 'Industrial', 'Minimal'],
    coordinates: {
      latitude: 52.5102,
      longitude: 13.4198
    }
  },
  {
    id: '4',
    name: 'KitKatClub',
    location: 'Berlin, Germany',
    image: 'https://images.unsplash.com/photo-1571204829887-3b8d69e23af5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    description: 'Notorious fetish and techno club known for its libertine door policy and hedonistic atmosphere.',
    currentStatus: {
      queueLength: 90,
      waitTime: 60,
      lastUpdated: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      trend: 'increasing',
    },
    genres: ['Techno', 'Electronic', 'Alternative'],
    coordinates: {
      latitude: 52.5068,
      longitude: 13.4253
    }
  },
  {
    id: '5',
    name: 'Sisyphos',
    location: 'Berlin, Germany',
    image: 'https://images.unsplash.com/photo-1519111887837-a48ccf9edc00?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80',
    description: 'Former dog biscuit factory transformed into a sprawling open-air club with multiple dance floors and a beach area.',
    currentStatus: {
      queueLength: 150,
      waitTime: 90,
      lastUpdated: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
      trend: 'stable',
    },
    genres: ['House', 'Techno', 'Minimal'],
    coordinates: {
      latitude: 52.4869,
      longitude: 13.4901
    }
  },
];

export const queueUpdates: QueueUpdate[] = [
  {
    id: '101',
    clubId: '1',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    queueLength: 180,
    waitTime: 120,
    comment: 'Line is growing fast, doorman being extra selective tonight!',
    userId: 'user1',
    userName: 'TechnoExplorer',
  },
  {
    id: '102',
    clubId: '1',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    queueLength: 150,
    waitTime: 100,
    comment: 'Moving slowly but steadily, good vibes in the queue.',
    userId: 'user2',
    userName: 'BerlinClubber',
  },
  {
    id: '103',
    clubId: '1',
    timestamp: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    queueLength: 120,
    waitTime: 80,
    comment: 'Line started to form, getting busy now!',
    userId: 'user3',
    userName: 'NightOwl',
  },
  {
    id: '104',
    clubId: '2',
    timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    queueLength: 75,
    waitTime: 45,
    comment: 'Not too bad tonight, moving at a decent pace.',
    userId: 'user4',
    userName: 'RaverQueen',
  },
  {
    id: '105',
    clubId: '3',
    timestamp: new Date(Date.now() - 55 * 60 * 1000).toISOString(),
    queueLength: 120,
    waitTime: 70,
    comment: 'Queue seems to be getting shorter, good time to arrive!',
    userId: 'user5',
    userName: 'BassHunter',
  },
];

export const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const past = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} seconds ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
};
