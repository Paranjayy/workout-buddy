// Core type definitions for Workout Buddy

export interface Profile {
  name: string
  dob: string
  height: number | null
  lifeExpectancy: number
  calorieGoal: number
  proteinGoal: number
  carbGoal: number
  fatGoal: number
}

export interface WorkoutEntry {
  id: string
  date: string
  exercise: string
  type: 'strength' | 'bodyweight' | 'cardio' | 'yoga'
  sets: number
  reps: number | null
  weight: number | null
  duration: number | null
  detail: string
  time: string
}

export interface FoodItem {
  name: string
  cal: number
  protein: number
  carbs: number
  fat: number
  region: string
  serving?: string
}

export interface MealEntry {
  id: string
  date: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  items: (FoodItem & { entryId: string })[]
}

export interface Exercise {
  id: string
  name: string
  muscle?: string
  equipment?: string
  isTime?: boolean
  calPerMin?: number
  type: 'strength' | 'bodyweight' | 'cardio' | 'yoga'
}

export interface WorkoutTemplate {
  id: string
  name: string
  category: string
  emoji: string
  description: string
  exercises: TemplateExercise[]
}

export interface TemplateExercise {
  name: string
  sets: number
  reps: number | null
  duration?: number
  type: 'strength' | 'bodyweight' | 'cardio' | 'yoga'
  isTime?: boolean
}

export interface Playlist {
  id: string
  title: string
  emoji: string
  genre: string
  language: string
  description: string
  ytPlaylistId: string
  trackCount: number
}

export interface WeightEntry {
  id: string
  date: string
  weight: number
}

export interface LifeProgress {
  ageYears: number
  ageDays: number
  percentLived: number
  daysRemaining: number
  weeksRemaining: number
}

export type NavView =
  | 'dashboard'
  | 'workout'
  | 'calories'
  | 'body'
  | 'timer'
  | 'progress'
  | 'calendar'
  | 'music'
  | 'settings'
