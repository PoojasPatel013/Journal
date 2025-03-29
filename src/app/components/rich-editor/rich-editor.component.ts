import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JournalService } from '../../services/journal.service';
import { JournalDraft } from '../../models/journal-entry.model';

@Component({
  selector: 'app-rich-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="rich-editor-container">
      <div class="toolbar">
        <button type="button" (click)="execCommand('bold')" title="Bold">
          <strong>B</strong>
        </button>
        <button type="button" (click)="execCommand('italic')" title="Italic">
          <em>I</em>
        </button>
        <button type="button" (click)="execCommand('underline')" title="Underline">
          <u>U</u>
        </button>
        <button type="button" (click)="execCommand('strikeThrough')" title="Strike through">
          <s>S</s>
        </button>
        <span class="separator"></span>
        <button type="button" (click)="execCommand('insertUnorderedList')" title="Bullet list">
          • List
        </button>
        <button type="button" (click)="execCommand('insertOrderedList')" title="Numbered list">
          1. List
        </button>
        <span class="separator"></span>
        <button type="button" (click)="execCommand('justifyLeft')" title="Align left">
          Left
        </button>
        <button type="button" (click)="execCommand('justifyCenter')" title="Align center">
          Center
        </button>
        <button type="button" (click)="execCommand('justifyRight')" title="Align right">
          Right
        </button>
      </div>
      
      <div 
        class="editor-content" 
        [attr.contenteditable]="true"
        (input)="onContentChange($event)"
        (blur)="onBlur()"
        #editorContent
      ></div>
      
      <div class="editor-footer">
        <div class="word-count">
          Words: {{ wordCount }}
        </div>
        <div *ngIf="lastSaved" class="autosave-status">
          Last saved: {{ lastSaved | date:'short' }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .rich-editor-container {
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      padding: 0.5rem;
      background-color: #f5f5f5;
      border-bottom: 1px solid #ddd;
    }
    
    .toolbar button {
      background: none;
      border: 1px solid #ddd;
      border-radius: 3px;
      padding: 0.35rem 0.7rem;
      margin-right: 0.35rem;
      cursor: pointer;
      font-size: 0.9rem;
      color: #555;
      transition: all 0.2s;
    }
    
    .toolbar button:hover {
      background-color: #e9e9e9;
    }
    
    .separator {
      width: 1px;
      background-color: #ddd;
      margin: 0 0.5rem;
    }
    
    .editor-content {
      min-height: 200px;
      padding: 1rem;
      outline: none;
      overflow-y: auto;
      line-height: 1.6;
    }
    
    .editor-footer {
      display: flex;
      justify-content: space-between;
      padding: 0.5rem;
      background-color: #f5f5f5;
      border-top: 1px solid #ddd;
      font-size: 0.85rem;
      color: #666;
    }
    
    .autosave-status {
      font-style: italic;
    }
  `]
})
export class RichEditorComponent implements OnInit, OnDestroy {
  @Input() initialContent: string = '';
  @Input() draftId: string = '';
  @Output() contentChanged = new EventEmitter<string>();
  
  wordCount: number = 0;
  lastSaved: Date | null = null;
  private autosaveInterval: any;
  private content: string = '';
  
  constructor(private journalService: JournalService) {}
  
  ngOnInit(): void {
    // Load initial content or draft
    if (this.initialContent) {
      this.setContent(this.initialContent);
    } else {
      const draft = this.journalService.getDraft();
      if (draft && draft.id === this.draftId) {
        this.setContent(draft.content);
        this.lastSaved = draft.lastSaved;
      }
    }
    
    // Set up autosave
    const settings = this.journalService.getSettings();
    const interval = settings.autosaveInterval * 1000; // convert to milliseconds
    
    this.autosaveInterval = setInterval(() => {
      this.autosave();
    }, interval);
  }
  
  ngOnDestroy(): void {
    if (this.autosaveInterval) {
      clearInterval(this.autosaveInterval);
    }
  }
  
  execCommand(command: string, value: string = ''): void {
    document.execCommand(command, false, value);
  }
  
  onContentChange(event: Event): void {
    const target = event.target as HTMLDivElement;
    this.content = target.innerHTML;
    this.contentChanged.emit(this.content);
    
    // Count words
    const text = target.textContent || '';
    this.wordCount = this.countWords(text);
  }
  
  onBlur(): void {
    this.autosave();
  }
  
  private setContent(html: string): void {
    const editorContent = document.querySelector('.editor-content') as HTMLDivElement;
    if (editorContent) {
      editorContent.innerHTML = html;
      this.content = html;
      
      // Count words
      const text = editorContent.textContent || '';
      this.wordCount = this.countWords(text);
    }
  }
  
  private autosave(): void {
    if (this.content && this.draftId) {
      const draft: JournalDraft = {
        id: this.draftId,
        title: '', // This will be updated from the form component
        content: this.content,
        activities: [],
        tags: [],
        lastSaved: new Date()
      };
      
      this.journalService.saveDraft(draft);
      this.lastSaved = draft.lastSaved;
    }
  }
  
  private countWords(text: string): number {
    return text.split(/\s+/).filter(word => word.length > 0).length;
  }
}
