import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '../../services/theme.service';
import { JournalService } from '../../services/journal.service';
import { UserSettings } from '../../models/journal-entry.model';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <h2>Journal Settings</h2>
      
      <div class="settings-section">
        <h3>Appearance</h3>
        
        <div class="setting-item">
          <label>Theme</label>
          <div class="theme-toggle">
            <button 
              [class.active]="!isDarkMode" 
              (click)="toggleTheme(false)"
            >
              Light
            </button>
            <button 
              [class.active]="isDarkMode" 
              (click)="toggleTheme(true)"
            >
              Dark
            </button>
          </div>
        </div>
        
        <div class="setting-item">
          <label>Font Family</label>
          <select [(ngModel)]="settings.font.family" (change)="updateFont()">
            <option *ngFor="let font of availableFonts" [value]="font.value">
              {{ font.name }}
            </option>
          </select>
        </div>
        
        <div class="setting-item">
          <label>Font Size</label>
          <select [(ngModel)]="settings.font.size" (change)="updateFont()">
            <option *ngFor="let size of availableFontSizes" [value]="size.value">
              {{ size.name }}
            </option>
          </select>
        </div>
      </div>
      
      <div class="settings-section">
        <h3>Writing Goals</h3>
        
        <div class="setting-item">
          <label>Daily Word Goal</label>
          <input 
            type="number" 
            [(ngModel)]="settings.writingGoals.daily" 
            (change)="saveSettings()"
            min="0"
          >
        </div>
        
        <div class="setting-item">
          <label>Weekly Word Goal</label>
          <input 
            type="number" 
            [(ngModel)]="settings.writingGoals.weekly" 
            (change)="saveSettings()"
            min="0"
          >
        </div>
        
        <div class="setting-item">
          <label>Monthly Word Goal</label>
          <input 
            type="number" 
            [(ngModel)]="settings.writingGoals.monthly" 
            (change)="saveSettings()"
            min="0"
          >
        </div>
      </div>
      
      <div class="settings-section">
        <h3>Journal Features</h3>
        
        <div class="setting-item checkbox">
          <label>
            <input 
              type="checkbox" 
              [(ngModel)]="settings.showPrompts" 
              (change)="saveSettings()"
            >
            Show writing prompts
          </label>
        </div>
        
        <div class="setting-item">
          <label>Autosave Interval (seconds)</label>
          <input 
            type="number" 
            [(ngModel)]="settings.autosaveInterval" 
            (change)="saveSettings()"
            min="5"
            max="300"
          >
        </div>
      </div>
      
      <div class="settings-actions">
        <button class="save-button" (click)="saveSettings()">Save Settings</button>
      </div>
    </div>
  `,
  styles: [`
    .settings-container {
      background-color: #fff;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    h2 {
      margin-top: 0;
      color: #333;
      margin-bottom: 1.5rem;
    }
    
    .settings-section {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #eaeaea;
    }
    
    .settings-section:last-child {
      border-bottom: none;
    }
    
    h3 {
      color: #555;
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }
    
    .setting-item {
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .setting-item.checkbox {
      justify-content: flex-start;
    }
    
    .setting-item.checkbox input {
      margin-right: 0.5rem;
    }
    
    label {
      color: #555;
      font-weight: 500;
    }
    
    select, input[type="number"] {
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-family: inherit;
      width: 200px;
    }
    
    .theme-toggle {
      display: flex;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
    }
    
    .theme-toggle button {
      padding: 0.5rem 1rem;
      border: none;
      background: none;
      cursor: pointer;
      flex: 1;
      transition: all 0.2s;
    }
    
    .theme-toggle button.active {
      background-color: #007bff;
      color: white;
    }
    
    .settings-actions {
      display: flex;
      justify-content: flex-end;
      margin-top: 1rem;
    }
    
    .save-button {
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .save-button:hover {
      background-color: #218838;
    }
    
    @media (max-width: 600px) {
      .setting-item {
        flex-direction: column;
        align-items: flex-start;
      }
      
      select, input[type="number"] {
        width: 100%;
        margin-top: 0.5rem;
      }
    }
  `]
})
export class SettingsComponent implements OnInit {
  settings: UserSettings;
  isDarkMode = false;
  availableFonts: { name: string, value: string }[] = [];
  availableFontSizes: { name: string, value: string }[] = [];
  
  constructor(
    private journalService: JournalService,
    private themeService: ThemeService
  ) {
    this.settings = this.journalService.getSettings();
  }
  
  ngOnInit(): void {
    this.themeService.isDarkMode$.subscribe(isDark => {
      this.isDarkMode = isDark;
    });
    
    this.availableFonts = this.themeService.getAvailableFonts();
    this.availableFontSizes = this.themeService.getAvailableFontSizes();
  }
  
  toggleTheme(isDark: boolean): void {
    if (this.isDarkMode !== isDark) {
      this.themeService.toggleDarkMode();
    }
  }
  
  updateFont(): void {
    this.themeService.setFont(
      this.settings.font.family,
      this.settings.font.size
    );
    this.saveSettings();
  }
  
  saveSettings(): void {
    this.journalService.updateSettings(this.settings);
  }
}
