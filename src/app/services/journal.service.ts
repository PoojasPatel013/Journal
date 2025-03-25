import { Injectable } from "@angular/core"
import { type JournalEntry, MOODS } from "../models/journal-entry.model"
import jsPDF from "jspdf"

@Injectable({
  providedIn: "root",
})
export class JournalService {
  private readonly STORAGE_KEY = "journal_entries"

  constructor() {}

  getEntries(): JournalEntry[] {
    const entriesJson = localStorage.getItem(this.STORAGE_KEY)
    if (!entriesJson) {
      return []
    }

    try {
      const entries = JSON.parse(entriesJson)
      return entries.sort((a: JournalEntry, b: JournalEntry) => new Date(b.date).getTime() - new Date(a.date).getTime())
    } catch (e) {
      console.error("Error parsing journal entries", e)
      return []
    }
  }

  addEntry(entry: JournalEntry): void {
    const entries = this.getEntries()
    entries.push(entry)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(entries))
  }

  deleteEntry(entryId: string): void {
    const entries = this.getEntries()
    const updatedEntries = entries.filter((entry) => entry.id !== entryId)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedEntries))
  }

  getMoodEmoji(moodValue: string): string {
    const mood = MOODS.find((m) => m.value === moodValue)
    return mood ? mood.emoji : "😐"
  }

  exportJournal(): void {
    const entries = this.getEntries()
    if (entries.length === 0) {
      alert("No journal entries to export")
      return
    }

    const doc = new jsPDF()
    let yPos = 20

    // Add title
    doc.setFontSize(22)
    doc.text("My Personal Journal", 105, yPos, { align: "center" })
    yPos += 15

    doc.setFontSize(12)
    doc.text(`Exported on ${new Date().toLocaleDateString()}`, 105, yPos, { align: "center" })
    yPos += 20

    // Add entries
    entries.forEach((entry, index) => {
      // Check if we need a new page
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }

      const moodEmoji = this.getMoodEmoji(entry.mood)
      const dateStr = new Date(entry.date).toLocaleDateString()

      doc.setFontSize(16)
      doc.text(`${dateStr} - ${entry.title} ${moodEmoji}`, 20, yPos)
      yPos += 10

      doc.setFontSize(12)

      // Split long content into multiple lines
      const contentLines = doc.splitTextToSize(entry.content, 170)
      doc.text(contentLines, 20, yPos)
      yPos += contentLines.length * 7 + 15

      // Add a separator line except for the last entry
      if (index < entries.length - 1) {
        doc.setDrawColor(200, 200, 200)
        doc.line(20, yPos - 5, 190, yPos - 5)
        yPos += 10
      }
    })

    doc.save("my-journal.pdf")
  }
}

