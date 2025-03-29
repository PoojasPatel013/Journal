import { Injectable } from "@angular/core"

@Injectable({
  providedIn: "root",
})
export class PromptService {
  private writingPrompts = [
    "What made you smile today?",
    "Describe a challenge you're currently facing and how you plan to overcome it.",
    "What are three things you're grateful for today?",
    "If you could change one thing about your day, what would it be?",
    "What's something new you learned recently?",
    "Describe your ideal day from start to finish.",
    "What's a goal you're working towards? What steps are you taking to achieve it?",
    "Write about a person who has positively influenced your life.",
    "What's something you're looking forward to in the coming weeks?",
    "Reflect on a mistake you made and what you learned from it.",
    "What's a habit you'd like to develop or break?",
    "Describe a place where you feel most at peace.",
    "What's something you're proud of accomplishing?",
    "Write about a book, movie, or song that recently impacted you.",
    "What does success mean to you?",
    "Describe a memory that always makes you happy.",
    "What are your top priorities right now?",
    "If you could give advice to your younger self, what would it be?",
    "What's something you want to explore or learn more about?",
    "How have you changed in the past year?",
    "What are you feeling anxious about, and how can you address it?",
    "Write about a small joy you experienced today.",
    "What boundaries do you need to set or maintain in your life?",
    "Describe a recent dream you had and what it might mean.",
    "What's something you're looking forward to tomorrow?",
  ]

  private quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Write it on your heart that every day is the best day in the year.", author: "Ralph Waldo Emerson" },
    { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
    { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
    { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
    { text: "Happiness is not something ready-made. It comes from your own actions.", author: "Dalai Lama" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { text: "The purpose of our lives is to be happy.", author: "Dalai Lama" },
    { text: "Get busy living or get busy dying.", author: "Stephen King" },
    { text: "You only live once, but if you do it right, once is enough.", author: "Mae West" },
    {
      text: "Many of life's failures are people who did not realize how close they were to success when they gave up.",
      author: "Thomas A. Edison",
    },
    { text: "The unexamined life is not worth living.", author: "Socrates" },
    { text: "Turn your wounds into wisdom.", author: "Oprah Winfrey" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    {
      text: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
      author: "Nelson Mandela",
    },
    { text: "Life is really simple, but we insist on making it complicated.", author: "Confucius" },
    {
      text: "In the end, it's not the years in your life that count. It's the life in your years.",
      author: "Abraham Lincoln",
    },
  ]

  private gratitudePrompts = [
    "What's something beautiful you saw today?",
    "Who made a positive difference in your life recently?",
    "What's a simple pleasure you enjoyed today?",
    "What's something you're looking forward to?",
    "What's a challenge you've overcome that you're grateful for?",
    "What's something you have that many others don't?",
    "What's a skill or ability you're thankful to have?",
    "What's something in nature you appreciate?",
    "What's a convenience in your life you're grateful for?",
    "Who's someone that taught you something valuable?",
    "What's a mistake that led to something positive?",
    "What's a small win you had today?",
    "What's something that made you laugh recently?",
    "What's a comfort in your home you appreciate?",
    "What's a technology that makes your life better?",
  ]

  getRandomPrompt(): string {
    const randomIndex = Math.floor(Math.random() * this.writingPrompts.length)
    return this.writingPrompts[randomIndex]
  }

  getRandomQuote(): { text: string; author: string } {
    const randomIndex = Math.floor(Math.random() * this.quotes.length)
    return this.quotes[randomIndex]
  }

  getRandomGratitudePrompt(): string {
    const randomIndex = Math.floor(Math.random() * this.gratitudePrompts.length)
    return this.gratitudePrompts[randomIndex]
  }
}

