
export type Mood = 'Happy' | 'Sad' | 'Angry' | 'Tired' | null;

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  threshold: number;
}

export interface User {
  displayName: string;
  username: string;
  email: string;
  password?: string;
  followers: string[];
  following: string[];
  friends: string[];
  blockedUsers: string[];
  posts: Post[];
  reposts: Post[];
  moodHistory: { date: string, mood: Mood }[];
  moodStreak: number;
  lastMoodDate?: string;
  profilePic?: string;
  bannerPic?: string;
  profileColor?: string;
  title?: string;
  // Mood Pet Stats
  moodCoins: number;
  petEmoji: string;
  petHunger: number; // 0-100
  petThirst: number; // 0-100
  petRest: number;   // 0-100
  petLastUpdate: number; // timestamp
  petSleepUntil: number | null; // timestamp
}

export interface Message {
  id: string;
  sender: string;
  recipient: string;
  text: string;
  timestamp: number;
  read: boolean;
}

export interface Notification {
  id: string;
  type: 'heart' | 'comment' | 'repost';
  fromUser: string;
  postId: string;
  timestamp: number;
  read: boolean;
  postContentSnippet: string;
}

export interface Post {
  id: string;
  author: string;
  content: string;
  hearts: number;
  comments: Comment[];
  timestamp: number;
  isRepost?: boolean;
  originalAuthor?: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  replies: Comment[];
}

export type Section = 'Home' | 'Mood' | 'Zodiac' | 'CityHall' | 'Profile' | 'Settings' | 'Notifications';

export interface ZodiacInfo {
  name: string;
  dates: string;
  description: string;
  history: string;
  symbol: string;
}
