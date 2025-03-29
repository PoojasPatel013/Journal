import { Injectable } from "@angular/core"
import type { JournalEntry, JournalDraft, UserSettings } from "../models/journal-entry.model"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class JournalService {
  private readonly ENTRIES_KEY = "journal_entries"
  private readonly DRAFT_KEY = "journal_draft"
  private readonly SETTINGS_KEY = "journal_settings"
  private readonly TAGS_KEY = "journal_tags"

  private entriesSubject = new BehaviorSubject<JournalEntry[]>([])
  private tagsSubject = new BehaviorSubject<string[]>([])
  private settingsSubject = new BehaviorSubject<UserSettings>(this.getDefaultSettings())

  entries$ = this.entriesSubject.asObservable()
  tags$ = this.tagsSubject.asObservable()
  settings$ = this.settingsSubject.asObservable()

  constructor() {
    this.loadEntries()
    this.loadTags()
    this.loadSettings()
  }

  // Journal Entries Methods
  getEntries(): JournalEntry[] {
    return this.entriesSubject.value
  }

  getMoodEmoji(mood: string): string {
    const moodMap: { [key: string]: string } = {
      happy: '😊',
      sad: '😢',
      excited: '😃',
      angry: '😠',
      neutral: '😐'
    };
    return moodMap[mood.toLowerCase()] || '❓';
  }
  

  getEntriesByDate(startDate: Date, endDate: Date): JournalEntry[] {
    return this.entriesSubject.value.filter((entry) => {
      const entryDate = new Date(entry.date)
      return entryDate >= startDate && entryDate <= endDate
    })
  }

  getEntriesByTag(tag: string): JournalEntry[] {
    return this.entriesSubject.value.filter((entry) => entry.tags.includes(tag))
  }

  getEntriesByMood(mood: string): JournalEntry[] {
    return this.entriesSubject.value.filter((entry) => entry.mood === mood)
  }

  searchEntries(query: string): JournalEntry[] {
    const lowerQuery = query.toLowerCase()
    return this.entriesSubject.value.filter(
      (entry) =>
        entry.title.toLowerCase().includes(lowerQuery) ||
        entry.content.toLowerCase().includes(lowerQuery) ||
        entry.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)),
    )
  }

  getEntryById(id: string): JournalEntry | undefined {
    return this.entriesSubject.value.find((entry) => entry.id === id)
  }

  addEntry(entry: JournalEntry): void {
    const entries = this.getEntries()

    // Add any new tags to the tags list
    this.addTags(entry.tags)

    // Add entry
    entries.unshift(entry)
    this.saveEntries(entries)

    // Clear draft after successful save
    this.clearDraft()
  }

  updateEntry(updatedEntry: JournalEntry): void {
    const entries = this.getEntries()
    const index = entries.findIndex((entry) => entry.id === updatedEntry.id)

    if (index !== -1) {
      // Add any new tags to the tags list
      this.addTags(updatedEntry.tags)

      // Update entry
      entries[index] = {
        ...updatedEntry,
        lastEdited: new Date(),
      }

      this.saveEntries(entries)
    }
  }

  deleteEntry(id: string): void {
    const entries = this.getEntries()
    const updatedEntries = entries.filter((entry) => entry.id !== id)
    this.saveEntries(updatedEntries)
  }

  // Draft Methods
  saveDraft(draft: JournalDraft): void {
    localStorage.setItem(
      this.DRAFT_KEY,
      JSON.stringify({
        ...draft,
        lastSaved: new Date(),
      }),
    )
  }

  getDraft(): JournalDraft | null {
    const draftJson = localStorage.getItem(this.DRAFT_KEY)
    if (!draftJson) return null

    try {
      const draft = JSON.parse(draftJson)
      return {
        ...draft,
        lastSaved: new Date(draft.lastSaved),
      }
    } catch (error) {
      console.error("Error parsing draft:", error)
      return null
    }
  }

  clearDraft(): void {
    localStorage.removeItem(this.DRAFT_KEY)
  }

  // Tags Methods
  getTags(): string[] {
    return this.tagsSubject.value
  }

  addTags(tags: string[]): void {
    const currentTags = this.getTags()
    const newTags = tags.filter((tag) => !currentTags.includes(tag))

    if (newTags.length > 0) {
      const updatedTags = [...currentTags, ...newTags]
      localStorage.setItem(this.TAGS_KEY, JSON.stringify(updatedTags))
      this.tagsSubject.next(updatedTags)
    }
  }

  deleteTag(tag: string): void {
    const currentTags = this.getTags()
    const updatedTags = currentTags.filter((t) => t !== tag)
    localStorage.setItem(this.TAGS_KEY, JSON.stringify(updatedTags))
    this.tagsSubject.next(updatedTags)

    // Also remove this tag from all entries
    const entries = this.getEntries()
    let hasChanges = false

    entries.forEach((entry) => {
      if (entry.tags.includes(tag)) {
        entry.tags = entry.tags.filter((t) => t !== tag)
        hasChanges = true
      }
    })

    if (hasChanges) {
      this.saveEntries(entries)
    }
  }

  // Settings Methods
  getSettings(): UserSettings {
    return this.settingsSubject.value
  }

  updateSettings(settings: UserSettings): void {
    localStorage.setItem(this.SETTINGS_KEY, JSON.stringify(settings))
    this.settingsSubject.next(settings)
  }

  // Private Methods
  private loadEntries(): void {
    const entriesJson = localStorage.getItem(this.ENTRIES_KEY)
    if (!entriesJson) {
      this.entriesSubject.next([])
      return
    }

    try {
      // Parse dates properly from JSON
      const entries = JSON.parse(entriesJson)
      const parsedEntries = entries.map((entry: any) => ({
        ...entry,
        date: new Date(entry.date),
        lastEdited: entry.lastEdited ? new Date(entry.lastEdited) : undefined,
      }))

      this.entriesSubject.next(parsedEntries)
    } catch (error) {
      console.error("Error parsing journal entries:", error)
      this.entriesSubject.next([])
    }
  }

  private loadTags(): void {
    const tagsJson = localStorage.getItem(this.TAGS_KEY)
    if (!tagsJson) {
      this.tagsSubject.next([])
      return
    }

    try {
      const tags = JSON.parse(tagsJson)
      this.tagsSubject.next(tags)
    } catch (error) {
      console.error("Error parsing tags:", error)
      this.tagsSubject.next([])
    }
  }

  private loadSettings(): void {
    const settingsJson = localStorage.getItem(this.SETTINGS_KEY)
    if (!settingsJson) {
      this.settingsSubject.next(this.getDefaultSettings())
      return
    }

    try {
      const settings = JSON.parse(settingsJson)
      this.settingsSubject.next(settings)
    } catch (error) {
      console.error("Error parsing settings:", error)
      this.settingsSubject.next(this.getDefaultSettings())
    }
  }

  private saveEntries(entries: JournalEntry[]): void {
    localStorage.setItem(this.ENTRIES_KEY, JSON.stringify(entries))
    this.entriesSubject.next(entries)
  }

  private getDefaultSettings(): UserSettings {
    return {
      theme: "light",
      font: {
        family: "Segoe UI, sans-serif",
        size: "medium",
      },
      writingGoals: {
        daily: 500,
        weekly: 3000,
        monthly: 12000,
      },
      showPrompts: true,
      autosaveInterval: 30,
    }
  }
}

