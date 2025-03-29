import { Component, Input, type OnChanges, type AfterViewInit, type ElementRef, ViewChild } from "@angular/core"
import { CommonModule } from "@angular/common"
import type { JournalEntry } from "../../models/journal-entry.model"

// We will use a simple class-based approach to create a basic chart
// without using external libraries to keep it beginner-friendly

@Component({
  selector: "app-mood-chart",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="mood-chart-container">
      <h2>Your Mood Over Time</h2>
      
      <div *ngIf="entries.length < 2" class="no-data">
        <p>Add at least two journal entries to see your mood patterns over time.</p>
      </div>
      
      <div *ngIf="entries.length >= 2" class="chart-wrapper">
        <canvas #chartCanvas width="800" height="300"></canvas>
        
        <div class="mood-legend">
          <div *ngFor="let mood of moodLegend" class="legend-item">
            <span class="legend-color" [style.background-color]="mood.color"></span>
            <span class="legend-label">{{ mood.label }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .mood-chart-container {
      background-color: #fff;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      margin-bottom: 2rem;
    }
    
    h2 {
      margin-top: 0;
      color: #333;
      text-align: center;
      margin-bottom: 1.5rem;
    }
    
    .no-data {
      text-align: center;
      padding: 2rem 0;
      color: #666;
    }
    
    .chart-wrapper {
      position: relative;
    }
    
    canvas {
      max-width: 100%;
      height: auto;
    }
    
    .mood-legend {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      margin-top: 1rem;
    }
    
    .legend-item {
      display: flex;
      align-items: center;
      margin: 0 0.75rem 0.5rem 0;
    }
    
    .legend-color {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      margin-right: 0.35rem;
    }
    
    .legend-label {
      font-size: 0.9rem;
      color: #555;
    }
  `,
  ],
})
export class MoodChartComponent implements OnChanges, AfterViewInit {
  @Input() entries: JournalEntry[] = []
  @ViewChild("chartCanvas") chartCanvas!: ElementRef<HTMLCanvasElement>

  private MOODS = [
    { value: "happy", color: "#4CAF50", label: "Happy" },
    { value: "content", color: "#8BC34A", label: "Content" },
    { value: "neutral", color: "#FFC107", label: "Neutral" },
    { value: "sad", color: "#FF9800", label: "Sad" },
    { value: "angry", color: "#F44336", label: "Angry" },
    { value: "motivated", color: "#3F51B5", label: "Motivated" },
    { value: "anxious", color: "#9C27B0", label: "Anxious" },
    { value: "grateful", color: "#009688", label: "Grateful" },
    { value: "tired", color: "#795548", label: "Tired" },
    { value: "excited", color: "#E91E63", label: "Excited" },
  ]

  moodLegend = this.MOODS.slice(0, 5) // Just show the first 5 moods in the legend

  private moodValues: { [key: string]: number } = {
    happy: 5,
    content: 4,
    neutral: 3,
    sad: 2,
    angry: 1,
  }

  ngAfterViewInit(): void {
    if (this.entries.length >= 2) {
      this.drawChart()
    }
  }

  ngOnChanges(): void {
    if (this.chartCanvas && this.entries.length >= 2) {
      this.drawChart()
    }
  }

  private drawChart(): void {
    const canvas = this.chartCanvas.nativeElement
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Sort entries by date (oldest first)
    const sortedEntries = [...this.entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    if (sortedEntries.length < 2) return

    // Calculate dimensions
    const padding = 40
    const width = canvas.width - padding * 2
    const height = canvas.height - padding * 2

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(padding, padding)
    ctx.lineTo(padding, height + padding)
    ctx.lineTo(width + padding, height + padding)
    ctx.stroke()

    // Label y-axis (mood levels)
    ctx.font = "12px Arial"
    ctx.fillStyle = "#666"

    const moodLabels = ["Angry", "Sad", "Neutral", "Content", "Happy"]
    const yStep = height / (moodLabels.length - 1)

    moodLabels.forEach((label, i) => {
      const y = height + padding - i * yStep
      ctx.fillText(label, padding - 35, y + 5)

      // Draw horizontal grid line
      ctx.beginPath()
      ctx.strokeStyle = "#eee"
      ctx.moveTo(padding, y)
      ctx.lineTo(width + padding, y)
      ctx.stroke()
      ctx.strokeStyle = "#000"
    })

    // Plot the mood points and connect them
    const xStep = width / (sortedEntries.length - 1)

    ctx.beginPath()
    ctx.strokeStyle = "#3f51b5"
    ctx.lineWidth = 2

    sortedEntries.forEach((entry, i) => {
      const moodValue = this.moodValues[entry.mood]
      const x = padding + i * xStep
      const y = height + padding - (moodValue - 1) * yStep

      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }

      // Add date labels on x-axis for the first, middle, and last points
      if (i === 0 || i === sortedEntries.length - 1 || i === Math.floor(sortedEntries.length / 2)) {
        const date = new Date(entry.date)
        const dateLabel = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        ctx.fillText(dateLabel, x - 15, height + padding + 20)
      }
    })

    ctx.stroke()

    // Draw dots for each data point
    sortedEntries.forEach((entry, i) => {
      const moodValue = this.moodValues[entry.mood]
      const x = padding + i * xStep
      const y = height + padding - (moodValue - 1) * yStep

      ctx.beginPath()
      const moodColor = this.moodLegend.find((m) => m.value === entry.mood)?.color || "#000"
      ctx.fillStyle = moodColor
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.fillStyle = "#fff"
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
    })
  }
}

