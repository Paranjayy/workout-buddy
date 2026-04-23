// Achievements & Badge definitions

export interface Achievement {
  id: string
  name: string
  description: string
  emoji: string
  category: 'workout' | 'nutrition' | 'consistency' | 'wellness' | 'milestone'
  check: (stats: AchievementStats) => boolean
}

export interface AchievementStats {
  totalWorkouts: number
  totalMeals: number
  currentStreak: number
  longestStreak: number
  totalExercisesLogged: number
  uniqueExercises: number
  waterPerfectDays: number
  journalEntries: number
  templatesUsed: number
  totalWeightEntries: number
  daysActive: number
}

export interface UnlockedAchievement {
  id: string
  unlockedAt: string
}

export const ACHIEVEMENTS: Achievement[] = [
  // Workout milestones
  { id: 'first-workout', name: 'First Rep', description: 'Log your first exercise', emoji: '🎯', category: 'workout',
    check: s => s.totalWorkouts >= 1 },
  { id: 'ten-workouts', name: 'Getting Serious', description: 'Log 10 exercises', emoji: '💪', category: 'workout',
    check: s => s.totalWorkouts >= 10 },
  { id: 'fifty-workouts', name: 'Half Century', description: 'Log 50 exercises', emoji: '🔥', category: 'workout',
    check: s => s.totalWorkouts >= 50 },
  { id: 'hundred-workouts', name: 'Centurion', description: 'Log 100 exercises', emoji: '🏆', category: 'workout',
    check: s => s.totalWorkouts >= 100 },
  { id: 'five-hundred', name: 'Iron Legend', description: 'Log 500 exercises', emoji: '⚡', category: 'workout',
    check: s => s.totalWorkouts >= 500 },
  { id: 'variety', name: 'Jack of All Trades', description: 'Try 10 different exercises', emoji: '🎭', category: 'workout',
    check: s => s.uniqueExercises >= 10 },
  { id: 'template-user', name: 'Template Master', description: 'Use 5 workout templates', emoji: '📋', category: 'workout',
    check: s => s.templatesUsed >= 5 },

  // Nutrition
  { id: 'first-meal', name: 'Fuel Up', description: 'Log your first meal', emoji: '🍎', category: 'nutrition',
    check: s => s.totalMeals >= 1 },
  { id: 'meal-tracker', name: 'Meal Prep Pro', description: 'Log 30 meals', emoji: '🍱', category: 'nutrition',
    check: s => s.totalMeals >= 30 },

  // Consistency
  { id: 'streak-3', name: 'On a Roll', description: '3-day workout streak', emoji: '🔗', category: 'consistency',
    check: s => s.currentStreak >= 3 },
  { id: 'streak-7', name: 'Week Warrior', description: '7-day workout streak', emoji: '🗓️', category: 'consistency',
    check: s => s.currentStreak >= 7 },
  { id: 'streak-14', name: 'Fortnight Force', description: '14-day workout streak', emoji: '⚔️', category: 'consistency',
    check: s => s.currentStreak >= 14 },
  { id: 'streak-30', name: 'Monthly Monster', description: '30-day workout streak', emoji: '👑', category: 'consistency',
    check: s => s.currentStreak >= 30 },
  { id: 'streak-100', name: 'Unstoppable', description: '100-day workout streak', emoji: '💎', category: 'consistency',
    check: s => s.currentStreak >= 100 },

  // Wellness
  { id: 'hydrated', name: 'Stay Hydrated', description: 'Hit water goal for a day', emoji: '💧', category: 'wellness',
    check: s => s.waterPerfectDays >= 1 },
  { id: 'water-week', name: 'Water Week', description: 'Hit water goal 7 days', emoji: '🌊', category: 'wellness',
    check: s => s.waterPerfectDays >= 7 },
  { id: 'journaler', name: 'Reflective', description: 'Write 5 journal entries', emoji: '📝', category: 'wellness',
    check: s => s.journalEntries >= 5 },
  { id: 'weigh-in', name: 'Tracking Progress', description: 'Log weight 10 times', emoji: '⚖️', category: 'wellness',
    check: s => s.totalWeightEntries >= 10 },

  // Milestones
  { id: 'active-7', name: 'First Week', description: 'Be active for 7 different days', emoji: '📅', category: 'milestone',
    check: s => s.daysActive >= 7 },
  { id: 'active-30', name: 'Monthly Commitment', description: 'Be active for 30 different days', emoji: '🏅', category: 'milestone',
    check: s => s.daysActive >= 30 },
]
