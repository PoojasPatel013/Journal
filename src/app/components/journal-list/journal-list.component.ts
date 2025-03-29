import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JournalEntry } from '../../models/journal-entry.model';
import { JournalService } from '../../services/journal.service';

@Component({
  selector: 'app-journal-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="journal-list">
      <div class="list-header">
        <h2>My Journal Entries</h2>
        <button class="btn-export" (click)="onExport()">Export Journal</button>
      </div>
      
      <div *ngIf="entries.length === 0" class="no-entries">
        <p>No journal entries yet. Start by adding your first entry!</p>
      </div>
      
      <div *ngIf="entries.length > 0" class="entries-container">
        <div *ngFor="let entry of entries" class="entry-card">
          <div class="entry-header">
            <div class="entry-date-mood">
            <span class="entry-date">{{ formatDate(entry.date) }}</span>

              <span class="entry-mood">{{ getMoodEmoji(entry.mood) }}</span>
            </div>
            <button class="btn-delete" (click)="deleteEntry(entry.id)">×</button>
          </div>
          
          <h3 class="entry-title">{{ entry.title }}</h3>
          <p class="entry-content">{{ entry.content }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .journal-list {
      margin-top: 2rem;
    }
    
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    .list-header h2 {
      margin: 0;
      color: #6a5acd;
    }
    
    .btn-export {
      background-color: #6a5acd;
      color: white;
      border: none;
      padding: 0.6rem 1.2rem;
      font-size: 0.9rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .btn-export:hover {
      background-color: #5849b8;
    }
    
    .no-entries {
      background-color: #f8f9fa;
      padding: 2rem;
      text-align: center;
      border-radius: 8px;
      color: #666;
    }
    
    .entries-container {
      display: grid;
      gap: 1.5rem;
    }
    
    .entry-card {
      background-color: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      border-left: 4px solid #6a5acd;
    }
    
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.8rem;
    }
    
    .entry-date-mood {
      display: flex;
      align-items: center;
      gap: 0.8rem;
    }
    
    .entry-date {
      color: #666;
      font-size: 0.9rem;
    }
    
    .entry-mood {
      font-size: 1.5rem;
    }
    
    .entry-title {
      margin: 0 0 0.8rem 0;
      color: #333;
    }
    
    .entry-content {
      margin: 0;
      color: #555;
      line-height: 1.5;
      white-space: pre-line;
    }
    
    .btn-delete {
      background: none;
      border: none;
      color: #999;
      font-size: 1.5rem;
      cursor: pointer;
      padding: 0;
      line-height: 1;
      transition: color 0.2s;
    }
    
    .btn-delete:hover {
      color: #ff5252;
    }
    
    @media (min-width: 768px) {
      .entries-container {
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      }
    }
  `]
})
export class JournalListComponent {
  @Input() entries: JournalEntry[] = [];
  @Output() entryDeleted = new EventEmitter<string>();
  @Output() exportRequested = new EventEmitter<void>();
  
  constructor(private journalService: JournalService) {}
  
  formatDate(dateInput: string | Date | null | undefined): string {
    if (!dateInput) return 'Invalid Date';
    
    const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
  
  
  getMoodEmoji(mood: string): string {
    return this.journalService.getMoodEmoji(mood);
  }
  
  deleteEntry(entryId: string): void {
    if (confirm('Are you sure you want to delete this entry?')) {
      this.entryDeleted.emit(entryId);
    }
  }
  
  onExport(): void {
    this.exportRequested.emit();
  }
}
