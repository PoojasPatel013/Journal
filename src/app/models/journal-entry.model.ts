export interface JournalEntry {
  id: string;
  date: string;
  mood: string;
  title: string;
  content: string;
}

export const MOODS = [
  { emoji: '😄', label: 'Happy', value: 'happy' },
  { emoji: '😊', label: 'Content', value: 'content' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '😔', label: 'Sad', value: 'sad' },
  { emoji: '😡', label: 'Angry', value: 'angry' },
  { emoji: '😴', label: 'Tired', value: 'tired' },
  { emoji: '🤩', label: 'Excited', value: 'excited' },
  { emoji: '😰', label: 'Anxious', value: 'anxious' }
];
