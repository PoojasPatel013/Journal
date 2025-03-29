import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JournalEntry, Mood, JournalDraft } from '../../models/journal-entry.model';
import { JournalService } from '../../services/journal.service';
import { PromptService } from '../../services/prompt.service';
import { RichEditorComponent } from '../rich-editor/rich-editor.component';

@Component({
  selector: 'app-journal-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RichEditorComponent],
  template: `
    <div class="journal-form-container">
      <div class="form-header">
        <h2>How are you feeling today?</h2>
        
        <div *ngIf="showPrompt" class="writing-prompt">
          <div class="prompt-content">
            <span class="prompt-label">Writing Prompt:</span>
            <p>{{ currentPrompt }}</p>
          </div>
          <button class="refresh-prompt" (click)="refreshPrompt()">
            New Prompt
          </button>
        </div>
        
        <div class="quote-of-day">
          <p class="quote-text">"{{ currentQuote.text }}"</p>
          <p class="quote-author">— {{ currentQuote.author }}</p>
        </div>
      </div>
      
      <div class="mood-selector">
        <button 
          *ngFor="let mood of moods" 
          (click)="selectMood(mood.value)"
          [class.selected]="selectedMood === mood.value"
          class="mood-button"
        >
          <span class="mood-emoji">{{ mood.emoji }}</span>
          <span class="mood-label">{{ mood.label }}</span>
        </button>
      </div>
      
      <form (submit)="addEntry($event)">
        <div class="form-group">
          <label for="title">Entry Title</label>
          <input 
            type="text" 
            id="title" 
            name="title" 
            [(ngModel)]="title" 
            required
            placeholder="What would you like to title this entry?"
            (change)="updateDraft()"
          >
        </div>
        
        <div class="form-group">
          <label for="content">Your Thoughts</label>
          <app-rich-editor
            [draftId]="draftId"
            [initialContent]="content"
            (contentChanged)="onContentChanged($event)"
          ></app-rich-editor>
        </div>
        
        <div class="form-group">
          <label for="activities">Activities Today</label>
          <input 
            type="text" 
            id="activities" 
            name="activities" 
            [(ngModel)]="activities" 
            placeholder="e.g., Running, Reading, Working"
            (change)="updateDraft()"
          >
        </div>
        
        <div class="form-group">
          <label for="tags">Tags</label>
          <div class="tags-input-container">
            <input 
              type="text" 
              id="tags" 
              name="tagsInput" 
              [(ngModel)]="tagsInput" 
              placeholder="Add tags (comma separated)"
              (keydown.enter)="addTag()"
            >
            <button type="button" class="add-tag-button" (click)="addTag()">
              Add
            </button>
          </div>
          
          <div *ngIf="tags.length > 0" class="tags-list">
            <span *ngFor="let tag of tags" class="tag-item">
              {{ tag }}
              <button type="button" class="remove-tag" (click)="removeTag(tag)">×</button>
            </span>
          </div>
        </div>
        
        <div class="form-group checkbox">
          <label>
            <input 
              type="checkbox" 
              [(ngModel)]="isGratitudeEntry" 
              name="isGratitudeEntry"
            >
            Include gratitude section
          </label>
        </div>
        
        <div *ngIf="isGratitudeEntry" class="gratitude-section">
          <h3>What are you grateful for today?</h3>
          <p class="gratitude-prompt">{{ currentGratitudePrompt }}</p>
          
          <div *ngFor="let item of gratitudeItems; let i = index" class="gratitude-item">
            <input 
              type="text" 
              [(ngModel)]="gratitudeItems[i]" 
              [name]="'gratitude-' + i"
              placeholder="I'm grateful for..."
            >
          </div>
          
          <button 
            type="button" 
            class="add-gratitude-button" 
            (click)="addGratitudeItem()"
            *ngIf="gratitudeItems.length < 5"
          >
            + Add Another
          </button>
        </div>
        
        <div class="form-actions">
          <button type="button" class="discard-button" (click)="resetForm()">
            Discard
          </button>
          <button type="submit" class="submit-button" [disabled]="!canSubmit()">
            Save Journal Entry
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .journal-form-container {
      background-color: #fff;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    
    .form-header {
      margin-bottom: 1.5rem;
    }
    
    h2 {
      margin-top: 0;
      color: #333;
      text-align: center;
    }
    
    .writing-prompt {
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 1rem;
      margin: 1.5rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .prompt-label {
      font-weight: bold;
      color: #495057;
      margin-right: 0.5rem;
    }
    
    .prompt-content {
      flex: 1;
    }
    
    .prompt-content p {
      margin: 0.5rem 0 0;
      color: #495057;
      font-style: italic;
    }
    
    .refresh-prompt {
      background-color: #6c757d;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.4rem 0.75rem;
      font-size: 0.85rem;
      cursor: pointer;
      transition: background-color 0.2s;
      white-space: nowrap;
      margin-left: 1rem;
    }
    
    .refresh-prompt:hover {
      background-color: #5a6268;
    }
    
    .quote-of-day {
      text-align: center;
      font-style: italic;
      color: #6c757d;
      margin: 1.5rem 0;
    }
    
    .quote-text {
      margin-bottom: 0.25rem;
    }
    
    .quote-author {
      margin-top: 0;
      font-weight: 500;
    }
    
    .mood-selector {
      display: flex;
      justify-content: space-between;
      margin: 1.5rem 0;
      flex-wrap: wrap;
    }
    
    .mood-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: none;
      border: 2px solid #eaeaea;
      border-radius: 8px;
      padding: 0.75rem;
      cursor: pointer;
      transition: all 0.2s;
      width: 18%;
    }
    
    .mood-button:hover {
      border-color: #ccc;
    }
    
    .mood-button.selected {
      border-color: #007bff;
      background-color: #f0f7ff;
    }
    
    .mood-emoji {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    
    .mood-label {
      font-size: 0.9rem;
      color: #666;
    }
    
    .form-group {
      margin-bottom: 1.25rem;
    }
    
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #555;
      font-weight: 500;
    }
    
    .form-group.checkbox label {
      display: flex;
      align-items: center;
      font-weight: normal;
    }
    
    .form-group.checkbox input {
      margin-right: 0.5rem;
    }
    
    input, textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: inherit;
      font-size: 1rem;
    }
    
    .tags-input-container {
      display: flex;
    }
    
    .add-tag-button {
      background-color: #6c757d;
      color: white;
      border: none;
      border-radius: 0 4px 4px 0;
      padding: 0 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .add-tag-button:hover {
      background-color: #5a6268;
    }
    
    .tags-list {
      display: flex;
      flex-wrap: wrap;
      margin-top: 0.75rem;
    }
    
    .tag-item {
      display: flex;
      align-items: center;
      background-color: #e9ecef;
      color: #495057;
      padding: 0.35rem 0.5rem;
      border-radius: 4px;
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
      font-size: 0.9rem;
    }
    
    .remove-tag {
      background: none;
      border: none;
      color: #6c757d;
      margin-left: 0.35rem;
      cursor: pointer;
      font-size: 1.1rem;
      line-height: 1;
      padding: 0 0.25rem;
    }
    
    .remove-tag:hover {
      color: #dc3545;
    }
    
    .gratitude-section {
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      padding: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .gratitude-section h3 {
      margin-top: 0;
      color: #495057;
      font-size: 1.1rem;
    }
    
    .gratitude-prompt {
      font-style: italic;
      color: #6c757d;
      margin-bottom: 1rem;
    }
    
    .gratitude-item {
      margin-bottom: 0.75rem;
    }
    
    .add-gratitude-button {
      background: none;
      border: 1px dashed #ced4da;
      color: #6c757d;
      border-radius: 4px;
      padding: 0.5rem;
      width: 100%;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .add-gratitude-button:hover {
      background-color: #f1f3f5;
      color: #495057;
    }
    
    .form-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 1.5rem;
    }
    
    .submit-button {
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
      flex: 1;
    }
    
    .submit-button:hover {
      background-color: #218838;
    }
    
    .submit-button:disabled {
      background-color: #8bc99a;
      cursor: not-allowed;
    }
    
    .discard-button {
      background-color: #dc3545;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
      margin-right: 1rem;
    }
    
    .discard-button:hover {
      background-color: #c82333;
    }
    
    @media (max-width: 600px) {
      .mood-button {
        width: 30%;
        margin-bottom: 0.5rem;
      }
      
      .writing-prompt {
        flex-direction: column;
      }
      
      .refresh-prompt {
        margin-left: 0;
        margin-top: 0.75rem;
        align-self: flex-end;
      }
      
      .form-actions {
        flex-direction: column;
      }
      
      .discard-button {
        margin-right: 0;
        margin-bottom: 0.75rem;
      }
    }
  `]
})
export class JournalFormComponent implements OnInit, OnDestroy {
  @Output() entryAdded = new EventEmitter<JournalEntry>();
  
  title = '';
  content = '';
  activities = '';
  selectedMood: Mood | null = null;
  tagsInput = '';
  tags: string[] = [];
  isGratitudeEntry = false;
  gratitudeItems: string[] = [''];
  
  draftId = `draft-${Date.now()}`;
  wordCount = 0;
  
  showPrompt = true;
  currentPrompt = '';
  currentQuote = { text: '', author: '' };
  currentGratitudePrompt = '';
  
  private draftInterval: any;
  
  moods = [
    { emoji: '😀', label: 'Happy', value: 'happy' as Mood },
    { emoji: '😊', label: 'Content', value: 'content' as Mood },
    { emoji: '😐', label: 'Neutral', value: 'neutral' as Mood },
    { emoji: '😔', label: 'Sad', value: 'sad' as Mood },
    { emoji: '😡', label: 'Angry', value: 'angry' as Mood },
    { emoji: '💪', label: 'Motivated', value: 'motivated' as Mood },
    { emoji: '😰', label: 'Anxious', value: 'anxious' as Mood },
    { emoji: '🙏', label: 'Grateful', value: 'grateful' as Mood },
    { emoji: '😴', label: 'Tired', value: 'tired' as Mood },
    { emoji: '🤩', label: 'Excited', value: 'excited' as Mood }
  ];
  
  constructor(
    private journalService: JournalService,
    private promptService: PromptService
  ) {}
  
  ngOnInit(): void {
    // Load settings
    const settings = this.journalService.getSettings();
    this.showPrompt = settings.showPrompts;
    
    // Load prompts and quotes
    this.refreshPrompt();
    this.currentQuote = this.promptService.getRandomQuote();
    this.currentGratitudePrompt = this.promptService.getRandomGratitudePrompt();
    
    // Load draft if exists
    const draft = this.journalService.getDraft();
    if (draft) {
      this.draftId = draft.id;
      this.title = draft.title;
      this.content = draft.content;
      this.activities = draft.activities.join(', ');
      this.tags = draft.tags;
      this.selectedMood = draft.mood || null;
    }
    
    // Set up draft saving interval for title and other fields
    // (content is handled by the rich editor component)
    this.draftInterval = setInterval(() => {
      this.updateDraft();
    }, 30000); // Every 30 seconds
  }
  
  ngOnDestroy(): void {
    if (this.draftInterval) {
      clearInterval(this.draftInterval);
    }
  }
  
  selectMood(mood: Mood): void {
    this.selectedMood = mood;
    this.updateDraft();
  }
  
  onContentChanged(content: string): void {
    this.content = content;
    // Word count is handled by the rich editor component
  }
  
  addTag(): void {
    if (!this.tagsInput.trim()) return;
    
    const newTags = this.tagsInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag && !this.tags.includes(tag));
    
    if (newTags.length > 0) {
      this.tags = [...this.tags, ...newTags];
      this.tagsInput = '';
      this.updateDraft();
    }
  }
  
  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag);
    this.updateDraft();
  }
  
  addGratitudeItem(): void {
    if (this.gratitudeItems.length < 5) {
      this.gratitudeItems.push('');
    }
  }
  
  refreshPrompt(): void {
    this.currentPrompt = this.promptService.getRandomPrompt();
  }
  
  updateDraft(): void {
    const activitiesList = this.activities
      ? this.activities.split(',').map(a => a.trim())
      : [];
    
    const draft: JournalDraft = {
      id: this.draftId,
      title: this.title,
      content: this.content,
      mood: this.selectedMood || undefined,
      activities: activitiesList,
      tags: this.tags,
      lastSaved: new Date()
    };
    
    this.journalService.saveDraft(draft);
  }
  
  canSubmit(): boolean {
    return !!(this.title && this.content && this.selectedMood);
  }
  
  addEntry(event: Event): void {
    event.preventDefault();
    
    if (!this.canSubmit()) return;
    
    const activitiesList = this.activities
      ? this.activities.split(',').map(a => a.trim())
      : [];
    
    // Filter out empty gratitude items
    const gratitudeItems = this.isGratitudeEntry
      ? this.gratitudeItems.filter(item => item.trim())
      : [];
    
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      title: this.title,
      content: this.content,
      mood: this.selectedMood as Mood,
      activities: activitiesList,
      tags: this.tags,
      date: new Date(),
      wordCount: this.countWords(this.content),
      isGratitudeEntry: this.isGratitudeEntry && gratitudeItems.length > 0,
      gratitudeItems: gratitudeItems.length > 0 ? gratitudeItems : undefined
    };
    
    this.journalService.addEntry(newEntry);
    this.entryAdded.emit(newEntry);
    this.resetForm();
  }
  
  resetForm(): void {
    this.title = '';
    this.content = '';
    this.activities = '';
    this.selectedMood = null;
    this.tags = [];
    this.tagsInput = '';
    this.isGratitudeEntry = false;
    this.gratitudeItems = [''];
    
    // Generate a new draft ID
    this.draftId = `draft-${Date.now()}`;
    
    // Clear the existing draft
    this.journalService.clearDraft();
    
    // Refresh prompts
    this.refreshPrompt();
    this.currentQuote = this.promptService.getRandomQuote();
    this.currentGratitudePrompt = this.promptService.getRandomGratitudePrompt();
  }
  
  private countWords(html: string): number {
    // Create a temporary div to extract text from HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || '';
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }
}
