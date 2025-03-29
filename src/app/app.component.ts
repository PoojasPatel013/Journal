import { Component, type OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { HeaderComponent } from "./components/header/header.component"
import { JournalFormComponent } from "./components/journal-form/journal-form.component"
import { JournalListComponent } from "./components/journal-list/journal-list.component"
import { MoodChartComponent } from "./components/mood-chart/mood-chart.component"
import { SettingsComponent } from "./components/settings/settings.component"
import { CalendarViewComponent } from "./components/calendar-view/calendar-view.component"
import { SearchFilterComponent } from "./components/search-filter/search-filter.component"
import type { JournalEntry } from "./models/journal-entry.model"
import { JournalService } from "./services/journal.service"
import { ThemeService } from "./services/theme.service"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    HeaderComponent,
    JournalFormComponent,
    JournalListComponent,
    MoodChartComponent,
    SettingsComponent,
    CalendarViewComponent,
    SearchFilterComponent,
  ],
  template: `
    <div class="app-container" [class.dark-theme]="isDarkMode">
      <app-header></app-header>
      
      <nav class="app-nav">
        <button 
          [class.active]="activeTab === 'write'" 
          (click)="setActiveTab('write')"
        >
          Write
        </button>
        <button 
          [class.active]="activeTab === 'entries'" 
          (click)="setActiveTab('entries')"
        >
          Entries
        </button>
        <button 
          [class.active]="activeTab === 'calendar'" 
          (click)="setActiveTab('calendar')"
        >
          Calendar
        </button>
        <button 
          [class.active]="activeTab === 'search'" 
          (click)="setActiveTab('search')"
        >
          Search
        </button>
        <button 
          [class.active]="activeTab === 'settings'" 
          (click)="setActiveTab('settings')"
        >
          Settings
        </button>
      </nav>
      
      <main>
        <div *ngIf="activeTab === 'write'">
          <app-journal-form (entryAdded)="onEntryAdded($event)"></app-journal-form>
          <app-mood-chart [entries]="journalEntries"></app-mood-chart>
        </div>
        
        <div *ngIf="activeTab === 'entries'">
          <app-journal-list 
            [entries]="journalEntries"
            (entryDeleted)="onEntryDeleted($event)"
          ></app-journal-list>
        </div>
        
        <div *ngIf="activeTab === 'calendar'">
          <app-calendar-view></app-calendar-view>
        </div>
        
        <div *ngIf="activeTab === 'search'">
          <app-search-filter></app-search-filter>
        </div>
        
        <div *ngIf="activeTab === 'settings'">
          <app-settings></app-settings>
        </div>
      </main>
    </div>
  `,
  styles: [
    `
    .app-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 1rem;
      min-height: 100vh;
    }
    
    .app-nav {
      display: flex;
      justify-content: center;
      margin: 1.5rem 0;
      border-bottom: 1px solid #eaeaea;
      padding-bottom: 0.5rem;
    }
    
    .app-nav button {
      background: none;
      border: none;
      padding: 0.75rem 1.25rem;
      margin: 0 0.25rem;
      cursor: pointer;
      font-size: 1rem;
      color: #555;
      border-radius: 4px;
      transition: all 0.2s;
    }
    
    .app-nav button:hover {
      background-color: #f0f0f0;
      color: #333;
    }
    
    .app-nav button.active {
      background-color: #007bff;
      color: white;
    }
    
    main {
      margin-top: 2rem;
    }
    
    /* Dark theme styles */
    .dark-theme {
      background-color: #222;
      color: #f0f0f0;
    }
    
    .dark-theme .app-nav {
      border-bottom-color: #444;
    }
    
    .dark-theme .app-nav button {
      color: #ccc;
    }
    
    .dark-theme .app-nav button:hover {
      background-color: #333;
      color: #fff;
    }
    
    .dark-theme .app-nav button.active {
      background-color: #0069d9;
    }
    
    @media (max-width: 600px) {
      .app-nav {
        flex-wrap: wrap;
      }
      
      .app-nav button {
        flex: 1 0 auto;
        margin-bottom: 0.5rem;
      }
    }
  `,
  ],
})
export class AppComponent implements OnInit {
  journalEntries: JournalEntry[] = []
  activeTab = "write"
  isDarkMode = false

  constructor(
    private journalService: JournalService,
    private themeService: ThemeService,
  ) {}

  ngOnInit(): void {
    this.loadEntries()

    this.themeService.isDarkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark
    })
  }

  loadEntries(): void {
    this.journalService.entries$.subscribe((entries) => {
      this.journalEntries = entries
    })
  }

  onEntryAdded(entry: JournalEntry): void {
    // The entry is already added to the service, so we just need to update our view
    this.loadEntries()
  }

  onEntryDeleted(id: string): void {
    this.journalService.deleteEntry(id)
    this.loadEntries()
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab
  }
}

