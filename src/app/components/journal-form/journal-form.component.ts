import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JournalEntry, MOODS } from '../../models/journal-entry.model';

@Component({
  selector: 'app-journal-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="journal-form">
      <h2>Add New Entry</h2>
      
      <div class="form-group">
        <label for="entry-date">Date</label>
        <input 
          type="date" 
          id="entry-date" 
          name="date" 
          [(ngModel)]="entryDate" 
          required
        >
      </div>
      
      <div class="form-group">
        <label>How are you feeling today?</label>
        <div class="mood-selector">
          <div 
            *ngFor="let mood of moods" 
            class="mood-option" 
            [class.selected]="selectedMood === mood.value"
            (click)="selectMood(mood.value)"
          >
            <span class="mood-emoji">{{ mood.emoji }}</span>
            <span class="mood-label">{{ mood.label }}</span>
          </div>
        </div>
      </div>
      
      <div class="form-group">
        <label for="entry-title">Title</label>
        <input 
          type="text" 
          id="entry-title" 
          name="title" 
          [(ngModel)]="entryTitle" 
          placeholder="Give your entry a title"
          required
        >
      </div>
      
      <div class="form-group">
        <label for="entry-content">Journal Entry</label>
        <textarea 
          id="entry-content" 
          name="content" 
          [(ngModel)]="entryContent" 
          placeholder="Write about your day..."
          rows="5"
          required
        ></textarea>
      </div>
      
      <button 
        class="btn-save" 
        (click)="saveEntry()" 
        [disabled]="!canSave()"
      >
        Save Entry
      </button>
    </div>
  `,
  styles: [`
    .journal-form {
      background-color: #f8f9fa;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    
    h2 {
      margin-top: 0;
      color: #6a5acd;
      margin-bottom: 1.5rem;
    }
    
    .form-group {
      margin-bottom: 1.2rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #444;
    }
    
    input[type="text"],
    input[type="date"],
    textarea {
      width: 100%;
      padding: 0.8rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      font-family: inherit;
    }
    
    textarea {
      resize: vertical;
      min-height: 100px;
    }
    
    .mood-selector {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 0.5rem;
    }
    
    .mood-option {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.8rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s;
      border: 2px solid transparent;
    }
    
    .mood-option:hover {
      background-color: #f0f0f0;
    }
    
    .mood-option.selected {
      background-color: #e8e4ff;
      border-color: #6a5acd;
    }
    
    .mood-emoji {
      font-size: 1.8rem;
      margin-bottom: 0.3rem;
    }
    
    .mood-label {
      font-size: 0.8rem;
    }
    
    .btn-save {
      background-color: #6a5acd;
      color: white;
      border: none;
      padding: 0.8rem 1.5rem;
      font-size: 1rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .btn-save:hover {
      background-color: #5849b8;
    }
    
    .btn-save:disabled {
      background-color: #b5b5b5;
      cursor: not-allowed;
    }
    
    @media (max-width: 600px) {
      .mood-selector {
        justify-content: center;
      }
      
      .mood-option {
        padding: 0.6rem;
      }
      
      .mood-emoji {
        font-size: 1.5rem;
      }
    }
  `]
})
export class JournalFormComponent {
  @Output() entryAdded = new EventEmitter<JournalEntry>();
  
  entryDate: string = new Date().toISOString().split('T')[0];
  selectedMood: string = '';
  entryTitle: string = '';
  entryContent: string = '';
  
  moods = MOODS;
  
  selectMood(mood: string): void {
    this.selectedMood = mood;
  }
  
  canSave(): boolean {
    return !!this.entryDate && 
           !!this.selectedMood && 
           !!this.entryTitle && 
           !!this.entryContent;
  }
  
  saveEntry(): void {
    if (!this.canSave()) {
      return;
    }
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: this.entryDate,
      mood: this.selectedMood,
      title: this.entryTitle,
      content: this.entryContent
    };
    
    this.entryAdded.emit(newEntry);
    this.resetForm();
  }
  
  resetForm(): void {
    this.entryDate = new Date().toISOString().split('T')[0];
    this.selectedMood = '';
    this.entryTitle = '';
    this.entryContent = '';
  }
}
