import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JournalEntry, MOODS } from '../../models/journal-entry.model';
import { Chart, registerables } from 'chart.js';

// Register Chart.js components
Chart.register(...registerables);

@Component({
  selector: 'app-mood-chart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mood-chart-container">
      <h2>Mood Tracker</h2>
      
      <div *ngIf="entries.length < 2" class="no-data">
        <p>Add at least two entries to see your mood trends.</p>
      </div>
      
      <div *ngIf="entries.length >= 2" class="chart-wrapper">
        <canvas id="moodChart"></canvas>
      </div>
    </div>
  `,
  styles: [`
    .mood-chart-container {
      background-color: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      margin-bottom: 2rem;
    }
    
    h2 {
      margin-top: 0;
      color: #6a5acd;
      margin-bottom: 1.5rem;
    }
    
    .no-data {
      background-color: #f8f9fa;
      padding: 2rem;
      text-align: center;
      border-radius: 8px;
      color: #666;
    }
    
    .chart-wrapper {
      height: 300px;
    }
  `]
})
export class MoodChartComponent implements OnChanges {
  @Input() entries: JournalEntry[] = [];
  private chart: Chart | null = null;
  
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entries'] && this.entries.length >= 2) {
      this.initChart();
    }
  }
  
  private initChart(): void {
    // Sort entries by date (oldest first)
    const sortedEntries = [...this.entries].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    // Prepare data for chart
    const labels = sortedEntries.map(entry => {
      const date = new Date(entry.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const moodValues = sortedEntries.map(entry => {
      // Map mood values to numbers for the chart
      switch (entry.mood) {
        case 'happy': return 5;
        case 'content': return 4;
        case 'excited': return 5;
        case 'neutral': return 3;
        case 'tired': return 2;
        case 'sad': return 1;
        case 'angry': return 1;
        case 'anxious': return 2;
        default: return 3;
      }
    });
    
    // Destroy previous chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }
    
    // Create new chart
    const ctx = document.getElementById('moodChart') as HTMLCanvasElement;
    if (!ctx) return;
    
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Mood',
          data: moodValues,
          borderColor: '#6a5acd',
          backgroundColor: 'rgba(106, 90, 205, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointBackgroundColor: '#6a5acd',
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            min: 0,
            max: 6,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                switch (value) {
                  case 5: return '😄 Happy';
                  case 4: return '😊 Content';
                  case 3: return '😐 Neutral';
                  case 2: return '😔 Low';
                  case 1: return '😢 Sad';
                  default: return '';
                }
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw as number;
                let moodLabel = '';
                
                switch (value) {
                  case 5: moodLabel = 'Happy/Excited'; break;
                  case 4: moodLabel = 'Content'; break;
                  case 3: moodLabel = 'Neutral'; break;
                  case 2: moodLabel = 'Tired/Anxious'; break;
                  case 1: moodLabel = 'Sad/Angry'; break;
                  default: moodLabel = 'Unknown';
                }
                
                return `Mood: ${moodLabel}`;
              }
            }
          }
        }
      }
    });
  }
}
