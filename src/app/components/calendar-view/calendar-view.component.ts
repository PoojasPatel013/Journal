import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { JournalService } from "../../services/journal.service"
import type { JournalEntry } from "../../models/journal-entry.model"

@Component({
  selector: "app-calendar-view",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="calendar-container">
      <div class="calendar-header">
        <h2>Journal Calendar</h2>
        <div class="month-navigation">
          <button (click)="prevMonth()" class="nav-button">
            &lt; Previous
          </button>
          <h3>{{ currentMonthName }} {{ currentYear }}</h3>
          <button (click)="nextMonth()" class="nav-button">
            Next &gt;
          </button>
        </div>
      </div>
      
      <div class="calendar">
        <div class="weekdays">
          <div class="weekday" *ngFor="let day of weekdays">{{ day }}</div>
        </div>
        
        <div class="days">
          <div 
            *ngFor="let day of calendarDays" 
            class="day"
            [class.other-month]="day.otherMonth"
            [class.today]="day.isToday"
            [class.has-entries]="day.entries.length > 0"
            (click)="selectDay(day)"
          >
            <div class="day-number">{{ day.day }}</div>
            <div *ngIf="day.entries.length > 0" class="entry-indicator">
              <div 
                *ngFor="let mood of day.moodSummary" 
                class="mood-dot"
                [style.background-color]="getMoodColor(mood)"
                [attr.title]="mood"
              ></div>
            </div>
          </div>
        </div>
      </div>
      
      <div *ngIf="selectedDay && selectedDay.entries.length > 0" class="day-entries">
        <h3>Entries for {{ formatSelectedDate() }}</h3>
        
        <div class="entry-list">
          <div *ngFor="let entry of selectedDay.entries" class="entry-item">
            <div class="entry-header">
              <span class="entry-mood">{{ getMoodEmoji(entry.mood) }}</span>
              <h4 class="entry-title">{{ entry.title }}</h4>
              <span class="entry-time">{{ formatTime(entry.date) }}</span>
            </div>
            <button class="view-entry" (click)="viewEntry(entry)">
              View Entry
            </button>
          </div>
        </div>
      </div>
      
      <div *ngIf="selectedDay && selectedDay.entries.length === 0" class="no-entries">
        <p>No entries for {{ formatSelectedDate() }}</p>
      </div>
    </div>
  `,
  styles: [
    `
    .calendar-container {
      background-color: #fff;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .calendar-header {
      margin-bottom: 1.5rem;
    }
    
    h2 {
      margin-top: 0;
      color: #333;
      margin-bottom: 1rem;
    }
    
    .month-navigation {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .nav-button {
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      color: #495057;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .nav-button:hover {
      background-color: #e9ecef;
    }
    
    h3 {
      margin: 0;
      color: #495057;
    }
    
    .calendar {
      margin-bottom: 1.5rem;
    }
    
    .weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      text-align: center;
      font-weight: bold;
      color: #495057;
      border-bottom: 1px solid #dee2e6;
      padding-bottom: 0.75rem;
      margin-bottom: 0.5rem;
    }
    
    .weekday {
      padding: 0.5rem;
    }
    
    .days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0.25rem;
    }
    
    .day {
      aspect-ratio: 1;
      padding: 0.5rem;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
      position: relative;
    }
    
    .day:hover {
      background-color: #f8f9fa;
    }
    
    .day.other-month {
      color: #adb5bd;
      background-color: #f8f9fa;
    }
    
    .day.today {
      border-color: #007bff;
      font-weight: bold;
    }
    
    .day.has-entries {
      background-color: #e8f4f8;
    }
    
    .day-number {
      font-size: 0.9rem;
    }
    
    .entry-indicator {
      position: absolute;
      bottom: 0.35rem;
      left: 0;
      right: 0;
      display: flex;
      justify-content: center;
      gap: 0.25rem;
    }
    
    .mood-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
    }
    
    .day-entries {
      margin-top: 1.5rem;
      border-top: 1px solid #dee2e6;
      padding-top: 1.5rem;
    }
    
    .entry-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    
    .entry-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      transition: all 0.2s;
    }
    
    .entry-item:hover {
      background-color: #f8f9fa;
    }
    
    .entry-header {
      display: flex;
      align-items: center;
    }
    
    .entry-mood {
      font-size: 1.25rem;
      margin-right: 0.75rem;
    }
    
    .entry-title {
      margin: 0;
      font-size: 1rem;
    }
    
    .entry-time {
      margin-left: 0.75rem;
      color: #6c757d;
      font-size: 0.85rem;
    }
    
    .view-entry {
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.4rem 0.75rem;
      font-size: 0.85rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .view-entry:hover {
      background-color: #0069d9;
    }
    
    .no-entries {
      margin-top: 1.5rem;
      text-align: center;
      color: #6c757d;
      padding: 1.5rem;
      border: 1px dashed #dee2e6;
      border-radius: 4px;
    }
  `,
  ],
})
export class CalendarViewComponent implements OnInit {
  weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  calendarDays: Array<{
    day: number
    date: Date
    otherMonth: boolean
    isToday: boolean
    entries: JournalEntry[]
    moodSummary: string[]
  }> = []

  currentDate = new Date()
  currentMonth = this.currentDate.getMonth()
  currentYear = this.currentDate.getFullYear()
  currentMonthName = ""

  selectedDay: {
    day: number
    date: Date
    otherMonth: boolean
    isToday: boolean
    entries: JournalEntry[]
    moodSummary: string[]
  } | null = null

  allEntries: JournalEntry[] = []

  constructor(private journalService: JournalService) {}

  ngOnInit(): void {
    this.journalService.entries$.subscribe((entries) => {
      this.allEntries = entries
      this.generateCalendar()
    })
  }

  prevMonth(): void {
    this.currentMonth--
    if (this.currentMonth < 0) {
      this.currentMonth = 11
      this.currentYear--
    }
    this.generateCalendar()
  }

  nextMonth(): void {
    this.currentMonth++
    if (this.currentMonth > 11) {
      this.currentMonth = 0
      this.currentYear++
    }
    this.generateCalendar()
  }

  selectDay(day: any): void {
    this.selectedDay = day
  }

  viewEntry(entry: JournalEntry): void {
    // This would typically navigate to the entry detail view
    // For now, we'll just log it
    console.log("View entry:", entry)
  }

  formatSelectedDate(): string {
    if (!this.selectedDay) return ""

    return this.selectedDay.date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  formatTime(date: Date | string): string {
    const d = new Date(date)
    return d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  getMoodEmoji(mood: string): string {
    const moodMap: { [key: string]: string } = {
      happy: "😀",
      content: "😊",
      neutral: "😐",
      sad: "😔",
      angry: "😡",
      motivated: "💪",
      anxious: "😰",
      grateful: "🙏",
      tired: "😴",
      excited: "🤩",
    }

    return moodMap[mood] || "❓"
  }

  getMoodColor(mood: string): string {
    const moodMap: { [key: string]: string } = {
      happy: "#4CAF50",
      content: "#8BC34A",
      neutral: "#FFC107",
      sad: "#FF9800",
      angry: "#F44336",
      motivated: "#3F51B5",
      anxious: "#9C27B0",
      grateful: "#009688",
      tired: "#795548",
      excited: "#E91E63",
    }

    return moodMap[mood] || "#CCCCCC"
  }

  private generateCalendar(): void {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonth, 1)
    const lastDayOfMonth = new Date(this.currentYear, this.currentMonth + 1, 0)
    const today = new Date()

    // Update month name
    this.currentMonthName = firstDayOfMonth.toLocaleString("default", { month: "long" })

    // Calculate days from previous month to show
    const firstDayOfWeek = firstDayOfMonth.getDay() // 0 = Sunday, 1 = Monday, etc.

    // Calculate days from next month to show
    const lastDayOfWeek = lastDayOfMonth.getDay()
    const daysFromNextMonth = 6 - lastDayOfWeek

    // Generate calendar days
    this.calendarDays = []

    // Add days from previous month
    const prevMonth = new Date(this.currentYear, this.currentMonth, 0)
    const prevMonthDays = prevMonth.getDate()

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthDays - i
      const date = new Date(this.currentYear, this.currentMonth - 1, day)

      // Get entries for this day
      const dayEntries = this.getEntriesForDay(date)

      this.calendarDays.push({
        day,
        date,
        otherMonth: true,
        isToday: this.isSameDay(date, today),
        entries: dayEntries,
        moodSummary: this.getMoodSummary(dayEntries),
      })
    }

    // Add days from current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const date = new Date(this.currentYear, this.currentMonth, day)

      // Get entries for this day
      const dayEntries = this.getEntriesForDay(date)

      this.calendarDays.push({
        day,
        date,
        otherMonth: false,
        isToday: this.isSameDay(date, today),
        entries: dayEntries,
        moodSummary: this.getMoodSummary(dayEntries),
      })
    }

    // Add days from next month
    for (let day = 1; day <= daysFromNextMonth; day++) {
      const date = new Date(this.currentYear, this.currentMonth + 1, day)

      // Get entries for this day
      const dayEntries = this.getEntriesForDay(date)

      this.calendarDays.push({
        day,
        date,
        otherMonth: true,
        isToday: this.isSameDay(date, today),
        entries: dayEntries,
        moodSummary: this.getMoodSummary(dayEntries),
      })
    }

    // Reset selected day
    this.selectedDay = null
  }

  private getEntriesForDay(date: Date): JournalEntry[] {
    return this.allEntries.filter((entry) => this.isSameDay(new Date(entry.date), date))
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    )
  }

  private getMoodSummary(entries: JournalEntry[]): string[] {
    // Get unique moods from entries
    const moods = entries.map((entry) => entry.mood)
    return [...new Set(moods)]
  }
}

