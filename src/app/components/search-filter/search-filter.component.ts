import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { JournalService } from "../../services/journal.service"
import type { JournalEntry } from "../../models/journal-entry.model"

@Component({
  selector: "app-search-filter",
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="search-filter-container">
      <div class="search-bar">
        <input 
          type="text" 
          [(ngModel)]="searchQuery" 
          (input)="search()"
          placeholder="Search journal entries..."
          class="search-input"
        >
      </div>
      
      <div class="filters">
        <div class="filter-group">
          <label>Filter by Mood</label>
          <select [(ngModel)]="selectedMood" (change)="applyFilters()">
            <option value="">All Moods</option>
            <option *ngFor="let mood of moods" [value]="mood.value">
              {{ mood.emoji }} {{ mood.label }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Filter by Tag</label>
          <select [(ngModel)]="selectedTag" (change)="applyFilters()">
            <option value="">All Tags</option>
            <option *ngFor="let tag of tags" [value]="tag">
              {{ tag }}
            </option>
          </select>
        </div>
        
        <div class="filter-group">
          <label>Date Range</label>
          <div class="date-range">
            <input 
              type="date" 
              [(ngModel)]="startDate" 
              (change)="applyFilters()"
            >
            <span>to</span>
            <input 
              type="date" 
              [(ngModel)]="endDate" 
              (change)="applyFilters()"
            >
          </div>
        </div>
      </div>
      
      <div class="search-results">
        <h3 *ngIf="filteredEntries.length > 0">
          {{ filteredEntries.length }} {{ filteredEntries.length === 1 ? 'Entry' : 'Entries' }} Found
        </h3>
        
        <div *ngIf="filteredEntries.length === 0" class="no-results">
          <p>No entries match your search criteria.</p>
        </div>
        
        <div class="results-list">
          <div *ngFor="let entry of filteredEntries" class="result-item">
            <div class="result-header">
              <span class="result-mood">{{ getMoodEmoji(entry.mood) }}</span>
              <h4 class="result-title">{{ entry.title }}</h4>
              <span class="result-date">{{ formatDate(entry.date) }}</span>
            </div>
            
            <div class="result-preview" [innerHTML]="getContentPreview(entry.content)"></div>
            
            <div *ngIf="entry.tags.length > 0" class="result-tags">
              <span *ngFor="let tag of entry.tags" class="tag">{{ tag }}</span>
            </div>
            
            <button class="view-result" (click)="viewEntry(entry)">
              View Entry
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .search-filter-container {
      background-color: #fff;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .search-bar {
      margin-bottom: 1.5rem;
    }
    
    .search-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
    }
    
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #eaeaea;
    }
    
    .filter-group {
      flex: 1;
      min-width: 200px;
    }
    
    .filter-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
    }
    
    select, input[type="date"] {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: inherit;
    }
    
    .date-range {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .date-range span {
      color: #666;
    }
    
    .search-results {
      margin-top: 1.5rem;
    }
    
    h3 {
      margin-top: 0;
      color: #333;
      margin-bottom: 1rem;
    }
    
    .no-results {
      text-align: center;
      padding: 2rem 0;
      color: #666;
    }
    
    .results-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .result-item {
      border: 1px solid #eaeaea;
      border-radius: 6px;
      padding: 1rem;
      transition: all 0.2s;
    }
    
    .result-item:hover {
      box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    
    .result-header {
      display: flex;
      align-items: center;
      margin-bottom: 0.75rem;
    }
    
    .result-mood {
      font-size: 1.5rem;
      margin-right: 0.75rem;
    }
    
    .result-title {
      margin: 0;
      font-size: 1.1rem;
      color: #333;
      flex: 1;
    }
    
    .result-date {
      font-size: 0.85rem;
      color: #777;
    }
    
    .result-preview {
      color: #555;
      margin-bottom: 0.75rem;
      line-height: 1.5;
      max-height: 4.5em;
      overflow: hidden;
      position: relative;
    }
    
    .result-preview::after {
      content: '...';
      position: absolute;
      bottom: 0;
      right: 0;
      background-color: #fff;
      padding-left: 0.25rem;
    }
    
    .result-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.75rem;
    }
    
    .tag {
      background-color: #f0f0f0;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.85rem;
      color: #555;
    }
    
    .view-result {
      background-color: #007bff;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.5rem 0.75rem;
      font-size: 0.9rem;
      cursor: pointer;
      transition: background-color 0.2s;
      display: block;
      margin-left: auto;
    }
    
    .view-result:hover {
      background-color: #0069d9;
    }
    
    @media (max-width: 768px) {
      .filters {
        flex-direction: column;
      }
      
      .filter-group {
        width: 100%;
      }
    }
  `,
  ],
})
export class SearchFilterComponent implements OnInit {
  searchQuery = ""
  selectedMood = ""
  selectedTag = ""
  startDate = ""
  endDate = ""

  allEntries: JournalEntry[] = []
  filteredEntries: JournalEntry[] = []
  tags: string[] = []

  moods = [
    { emoji: "😀", label: "Happy", value: "happy" },
    { emoji: "😊", label: "Content", value: "content" },
    { emoji: "😐", label: "Neutral", value: "neutral" },
    { emoji: "😔", label: "Sad", value: "sad" },
    { emoji: "😡", label: "Angry", value: "angry" },
    { emoji: "💪", label: "Motivated", value: "motivated" },
    { emoji: "😰", label: "Anxious", value: "anxious" },
    { emoji: "🙏", label: "Grateful", value: "grateful" },
    { emoji: "😴", label: "Tired", value: "tired" },
    { emoji: "🤩", label: "Excited", value: "excited" },
  ]

  constructor(private journalService: JournalService) {}

  ngOnInit(): void {
    this.journalService.entries$.subscribe((entries) => {
      this.allEntries = entries
      this.applyFilters()
    })

    this.journalService.tags$.subscribe((tags) => {
      this.tags = tags
    })

    // Set default date range to last 30 days
    const today = new Date()
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(today.getDate() - 30)

    this.endDate = this.formatDateForInput(today)
    this.startDate = this.formatDateForInput(thirtyDaysAgo)
  }

  search(): void {
    this.applyFilters()
  }

  applyFilters(): void {
    let filtered = [...this.allEntries]

    // Apply search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (entry) =>
          entry.title.toLowerCase().includes(query) ||
          this.stripHtml(entry.content).toLowerCase().includes(query) ||
          entry.tags.some((tag) => tag.toLowerCase().includes(query)),
      )
    }

    // Apply mood filter
    if (this.selectedMood) {
      filtered = filtered.filter((entry) => entry.mood === this.selectedMood)
    }

    // Apply tag filter
    if (this.selectedTag) {
      filtered = filtered.filter((entry) => entry.tags.includes(this.selectedTag))
    }

    // Apply date range
    if (this.startDate) {
      const start = new Date(this.startDate)
      start.setHours(0, 0, 0, 0)
      filtered = filtered.filter((entry) => new Date(entry.date) >= start)
    }

    if (this.endDate) {
      const end = new Date(this.endDate)
      end.setHours(23, 59, 59, 999)
      filtered = filtered.filter((entry) => new Date(entry.date) <= end)
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    this.filteredEntries = filtered
  }

  viewEntry(entry: JournalEntry): void {
    // This would typically navigate to the entry detail view
    console.log("View entry:", entry)
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

  formatDate(date: Date | string): string {
    const d = new Date(date)
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  getContentPreview(html: string): string {
    // Strip HTML tags and get first 150 characters
    const text = this.stripHtml(html)
    return text.length > 150 ? text.substring(0, 150) : text
  }

  private stripHtml(html: string): string {
    const temp = document.createElement("div")
    temp.innerHTML = html
    return temp.textContent || temp.innerText || ""
  }

  private formatDateForInput(date: Date): string {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }
}

