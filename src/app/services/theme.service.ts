import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { JournalService } from "./journal.service"
import type { Theme } from "../models/journal-entry.model"

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private isDarkMode = new BehaviorSubject<boolean>(false)
  isDarkMode$ = this.isDarkMode.asObservable()

  private currentFont = new BehaviorSubject<{ family: string; size: string }>({
    family: "Segoe UI, sans-serif",
    size: "medium",
  })
  currentFont$ = this.currentFont.asObservable()

  private availableFonts = [
    { name: "Default", value: "Segoe UI, sans-serif" },
    { name: "Serif", value: "Georgia, serif" },
    { name: "Monospace", value: "Consolas, monospace" },
    { name: "Handwriting", value: "Caveat, cursive" },
    { name: "Elegant", value: "Playfair Display, serif" },
  ]

  private availableFontSizes = [
    { name: "Small", value: "small" },
    { name: "Medium", value: "medium" },
    { name: "Large", value: "large" },
    { name: "X-Large", value: "x-large" },
  ]

  private themes: Theme[] = [
    {
      name: "Light",
      primaryColor: "#28a745",
      backgroundColor: "#ffffff",
      textColor: "#333333",
      accentColor: "#007bff",
    },
    {
      name: "Dark",
      primaryColor: "#2ecc71",
      backgroundColor: "#222222",
      textColor: "#f0f0f0",
      accentColor: "#3498db",
    },
    {
      name: "Sepia",
      primaryColor: "#8b4513",
      backgroundColor: "#f5e8c9",
      textColor: "#5c3b14",
      accentColor: "#a0522d",
    },
    {
      name: "Ocean",
      primaryColor: "#2980b9",
      backgroundColor: "#e0f7fa",
      textColor: "#0d3c55",
      accentColor: "#00acc1",
    },
    {
      name: "Forest",
      primaryColor: "#2ecc71",
      backgroundColor: "#e8f5e9",
      textColor: "#1b5e20",
      accentColor: "#43a047",
    },
  ]

  constructor(private journalService: JournalService) {
    // Initialize theme from settings
    this.journalService.settings$.subscribe((settings) => {
      this.isDarkMode.next(settings.theme === "dark")
      this.currentFont.next(settings.font)

      // Apply theme to document
      this.applyTheme(settings.theme === "dark")
      this.applyFont(settings.font)
    })
  }

  toggleDarkMode(): void {
    const newDarkModeValue = !this.isDarkMode.value
    this.isDarkMode.next(newDarkModeValue)

    // Update settings
    const currentSettings = this.journalService.getSettings()
    this.journalService.updateSettings({
      ...currentSettings,
      theme: newDarkModeValue ? "dark" : "light",
    })

    // Apply theme
    this.applyTheme(newDarkModeValue)
  }

  setFont(family: string, size: string): void {
    this.currentFont.next({ family, size })

    // Update settings
    const currentSettings = this.journalService.getSettings()
    this.journalService.updateSettings({
      ...currentSettings,
      font: { family, size },
    })

    // Apply font
    this.applyFont({ family, size })
  }

  getAvailableFonts() {
    return this.availableFonts
  }

  getAvailableFontSizes() {
    return this.availableFontSizes
  }

  getAvailableThemes() {
    return this.themes
  }

  private applyTheme(isDark: boolean): void {
    document.body.classList.toggle("dark-theme", isDark)
  }

  private applyFont(font: { family: string; size: string }): void {
    document.documentElement.style.setProperty("--app-font-family", font.family)
    document.documentElement.style.setProperty("--app-font-size", font.size)
  }
}

