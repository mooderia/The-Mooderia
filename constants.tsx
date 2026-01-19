
import { ZodiacInfo, Badge } from './types';

export const ZODIACS: ZodiacInfo[] = [
  { name: 'Aries', dates: 'Mar 21 - Apr 19', symbol: '♈', description: 'The Pioneer', history: 'Aries represents the ram whose golden fleece was sought by Jason and the Argonauts.' },
  { name: 'Taurus', dates: 'Apr 20 - May 20', symbol: '♉', description: 'The Builder', history: 'In Greek mythology, Zeus transformed into a bull to win the heart of Europa.' },
  { name: 'Gemini', dates: 'May 21 - Jun 20', symbol: '♊', description: 'The Messenger', history: 'Represented by Castor and Pollux, twins who shared immortality.' },
  { name: 'Cancer', dates: 'Jun 21 - Jul 22', symbol: '♋', description: 'The Guardian', history: 'Hercules encountered the giant crab Karkinos during his 12 labors.' },
  { name: 'Leo', dates: 'Jul 23 - Aug 22', symbol: '♌', description: 'The Leader', history: 'Associated with the Nemean Lion, a beast slain by Hercules.' },
  { name: 'Virgo', dates: 'Aug 23 - Sep 22', symbol: '♍', description: 'The Critic', history: 'Often linked to Astraea, the goddess of innocence and purity.' },
  { name: 'Libra', dates: 'Sep 23 - Oct 22', symbol: '♎', description: 'The Diplomat', history: 'The only non-living symbol, representing the scales of Justice.' },
  { name: 'Scorpio', dates: 'Oct 23 - Nov 21', symbol: '♏', description: 'The Strategist', history: 'Sent by Gaia to defeat Orion after he threatened all animals.' },
  { name: 'Sagittarius', dates: 'Nov 22 - Dec 21', symbol: '♐', description: 'The Explorer', history: 'Symbolizes Chiron, the wise centaur who taught Greek heroes.' },
  { name: 'Capricorn', dates: 'Dec 22 - Jan 19', symbol: '♑', description: 'The Achiever', history: 'Associated with Pan, the god who grew fish scales to escape Typhon.' },
  { name: 'Aquarius', dates: 'Jan 20 - Feb 18', symbol: '♒', description: 'The Reformer', history: 'Ganymede, the cup-bearer to the gods who poured water for life.' },
  { name: 'Pisces', dates: 'Feb 19 - Mar 20', symbol: '♓', description: 'The Dreamer', history: 'Aphrodite and Eros turned into fish to hide from a sea monster.' },
];

export const STREAK_BADGES: Badge[] = [
  { id: '1', name: 'Starter', icon: '🌱', description: '3 Day Streak', threshold: 3 },
  { id: '2', name: 'Dedicated', icon: '🔥', description: '7 Day Streak', threshold: 7 },
  { id: '3', name: 'Mood Master', icon: '👑', description: '15 Day Streak', threshold: 15 },
  { id: '4', name: 'Mooderia Elite', icon: '💎', description: '30 Day Streak', threshold: 30 },
];

export const getZodiacFromDate = (month: number, day: number): string => {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
  return 'Aries';
};
