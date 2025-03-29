export type Mood =
  | "happy"
  | "content"
  | "neutral"
  | "sad"
  | "angry"
  | "motivated"
  | "anxious"
  | "grateful"
  | "tired"
  | "excited"

export interface JournalEntry {
  id: string
  title: string
  content: string
  mood: Mood
  activities: string[]
  tags: string[]
  date: Date
  wordCount: number
  isGratitudeEntry: boolean
  gratitudeItems?: string[]
  lastEdited?: Date
}

export interface JournalDraft {
  id: string
  title: string
  content: string
  mood?: Mood
  activities: string[]
  tags: string[]
  lastSaved: Date
}

export interface Theme {
  name: string
  primaryColor: string
  backgroundColor: string
  textColor: string
  accentColor: string
}

export interface FontSettings {
  family: string
  size: string
}

export interface WritingGoal {
  daily: number
  weekly: number
  monthly: number
}

export interface UserSettings {
  theme: "light" | "dark" | "custom"
  customTheme?: Theme
  font: FontSettings
  writingGoals: WritingGoal
  showPrompts: boolean
  autosaveInterval: number // in seconds
}

