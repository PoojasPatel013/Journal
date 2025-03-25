import { Component } from "@angular/core"

@Component({
  selector: "app-header",
  standalone: true,
  template: `
    <header>
      <h1>My Mood Journal</h1>
      <p>Track your moods and thoughts over time</p>
    </header>
  `,
  styles: [
    `
    header {
      text-align: center;
      padding: 1.5rem 0;
      border-bottom: 1px solid #eaeaea;
    }
    
    h1 {
      margin: 0;
      color: #333;
      font-size: 2.5rem;
    }
    
    p {
      color: #666;
      margin-top: 0.5rem;
    }
  `,
  ],
})
export class HeaderComponent {}

