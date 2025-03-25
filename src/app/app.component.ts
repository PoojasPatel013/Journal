import { Component, type OnInit } from "@angular/core"
import type { JournalEntry } from "./models/journal-entry.model"
import { JournalService } from "./services/journal.service"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { JournalFormComponent } from "./components/journal-form/journal-form.component"
import { JournalListComponent } from "./components/journal-list/journal-list.component"
import { MoodChartComponent } from "./components/mood-chart/mood-chart.component"

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, FormsModule, JournalFormComponent, JournalListComponent, MoodChartComponent],
  template: `
    <div class="app-container">
      <header>
        <h1>My Mood Book</h1>
        <p>Track your moods and thoughts</p>
      </header>
      
      <main>
        <div class="journal-container">
          <app-journal-form (entryAdded)="onEntryAdded($event)"></app-journal-form>
          
          <div class="journal-content">
            <app-mood-chart [entries]="journalEntries"></app-mood-chart>
            <app-journal-list 
              [entries]="journalEntries"
              (entryDeleted)="onEntryDeleted($event)"
              (exportRequested)="exportJournal()">
            </app-journal-list>
          </div>
        </div>
      </main>
      
      <footer>
        <p>My Personal Journal App © {{ currentYear }}</p>
      </footer>
    </div>
  `,
  styles: [
    `
    .app-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }
    
    header {
      background-color: #6a5acd;
      color: white;
      padding: 1.5rem;
      text-align: center;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    
    header h1 {
      margin: 0;
      font-size: 2.2rem;
    }
    
    header p {
      margin: 0.5rem 0 0;
      font-size: 1.1rem;
      opacity: 0.9;
    }
    
    main {
      flex: 1;
      padding: 2rem;
      background-color: #f9f9f9;
    }
    
    .journal-container {
      max-width: 1200px;
      margin: 0 auto;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      padding: 1.5rem;
    }
    
    .journal-content {
      margin-top: 2rem;
    }
    
    footer {
      background-color: #f1f1f1;
      padding: 1rem;
      text-align: center;
      color: #666;
      font-size: 0.9rem;
    }
    
    @media (max-width: 768px) {
      main {
        padding: 1rem;
      }
      
      .journal-container {
        padding: 1rem;
      }
    }
  `,
  ],
})
export class AppComponent implements OnInit {
  journalEntries: JournalEntry[] = []
  currentYear = new Date().getFullYear()

  constructor(private journalService: JournalService) {}

  ngOnInit(): void {
    this.loadEntries()
  }

  loadEntries(): void {
    this.journalEntries = this.journalService.getEntries()
  }

  onEntryAdded(entry: JournalEntry): void {
    this.journalService.addEntry(entry)
    this.loadEntries()
  }

  onEntryDeleted(entryId: string): void {
    this.journalService.deleteEntry(entryId)
    this.loadEntries()
  }

  exportJournal(): void {
    this.journalService.exportJournal()
  }
}

