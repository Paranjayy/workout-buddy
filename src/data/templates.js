// Workout templates — pre-built workout plans

export const TEMPLATES = [
  {
    id: 'ppl-push',
    name: 'Push Day',
    category: 'Push/Pull/Legs',
    emoji: '💥',
    description: 'Chest, shoulders, triceps',
    exercises: [
      { name: 'Bench Press', sets: 4, reps: 8, type: 'strength' },
      { name: 'Overhead Press', sets: 3, reps: 10, type: 'strength' },
      { name: 'Dumbbell Fly', sets: 3, reps: 12, type: 'strength' },
      { name: 'Lateral Raise', sets: 3, reps: 15, type: 'strength' },
      { name: 'Tricep Pushdown', sets: 3, reps: 12, type: 'strength' },
      { name: 'Dips', sets: 3, reps: 10, type: 'bodyweight' },
    ],
  },
  {
    id: 'ppl-pull',
    name: 'Pull Day',
    category: 'Push/Pull/Legs',
    emoji: '🔗',
    description: 'Back, biceps, rear delts',
    exercises: [
      { name: 'Deadlift', sets: 3, reps: 5, type: 'strength' },
      { name: 'Barbell Row', sets: 4, reps: 8, type: 'strength' },
      { name: 'Lat Pulldown', sets: 3, reps: 10, type: 'strength' },
      { name: 'Face Pull', sets: 3, reps: 15, type: 'strength' },
      { name: 'Dumbbell Curl', sets: 3, reps: 12, type: 'strength' },
      { name: 'Pull-ups', sets: 3, reps: 8, type: 'bodyweight' },
    ],
  },
  {
    id: 'ppl-legs',
    name: 'Leg Day',
    category: 'Push/Pull/Legs',
    emoji: '🦵',
    description: 'Quads, hamstrings, glutes, calves',
    exercises: [
      { name: 'Squat', sets: 4, reps: 6, type: 'strength' },
      { name: 'Romanian Deadlift', sets: 3, reps: 10, type: 'strength' },
      { name: 'Leg Press', sets: 3, reps: 12, type: 'strength' },
      { name: 'Lunges', sets: 3, reps: 10, type: 'strength' },
      { name: 'Bodyweight Squats', sets: 2, reps: 20, type: 'bodyweight' },
    ],
  },
  {
    id: 'full-body',
    name: 'Full Body',
    category: 'Full Body',
    emoji: '🏋️',
    description: 'Hit every muscle in one session',
    exercises: [
      { name: 'Squat', sets: 3, reps: 8, type: 'strength' },
      { name: 'Bench Press', sets: 3, reps: 8, type: 'strength' },
      { name: 'Barbell Row', sets: 3, reps: 8, type: 'strength' },
      { name: 'Overhead Press', sets: 3, reps: 10, type: 'strength' },
      { name: 'Pull-ups', sets: 3, reps: 8, type: 'bodyweight' },
      { name: 'Plank', sets: 3, reps: null, duration: 60, type: 'bodyweight', isTime: true },
    ],
  },
  {
    id: 'hiit-burner',
    name: 'HIIT Burner',
    category: 'Cardio',
    emoji: '🔥',
    description: '20 min high-intensity blast',
    exercises: [
      { name: 'Burpees', sets: 4, reps: 15, type: 'bodyweight' },
      { name: 'Mountain Climbers', sets: 4, reps: null, duration: 45, type: 'bodyweight', isTime: true },
      { name: 'Jump Rope', sets: 4, reps: null, duration: 60, type: 'cardio', isTime: true },
      { name: 'Push-ups', sets: 3, reps: 20, type: 'bodyweight' },
      { name: 'Bodyweight Squats', sets: 3, reps: 20, type: 'bodyweight' },
    ],
  },
  {
    id: 'morning-yoga',
    name: 'Morning Yoga',
    category: 'Flexibility',
    emoji: '🧘',
    description: '15 min sunrise flow',
    exercises: [
      { name: 'Sun Salutation', sets: 3, reps: null, duration: 120, type: 'yoga', isTime: true },
      { name: 'Warrior Sequence', sets: 2, reps: null, duration: 120, type: 'yoga', isTime: true },
      { name: 'Hip Opener Flow', sets: 1, reps: null, duration: 180, type: 'yoga', isTime: true },
    ],
  },
  {
    id: 'core-blast',
    name: 'Core Blast',
    category: 'Core',
    emoji: '🎯',
    description: 'Targeted core strength',
    exercises: [
      { name: 'Plank', sets: 3, reps: null, duration: 60, type: 'bodyweight', isTime: true },
      { name: 'Crunches', sets: 3, reps: 25, type: 'bodyweight' },
      { name: 'Mountain Climbers', sets: 3, reps: null, duration: 45, type: 'bodyweight', isTime: true },
      { name: 'Push-ups', sets: 3, reps: 15, type: 'bodyweight' },
    ],
  },
  {
    id: '5k-prep',
    name: '5K Prep',
    category: 'Running',
    emoji: '🏃',
    description: 'Build up to a 5K run',
    exercises: [
      { name: 'Walking', sets: 1, reps: null, duration: 300, type: 'cardio', isTime: true },
      { name: 'Running', sets: 1, reps: null, duration: 1200, type: 'cardio', isTime: true },
      { name: 'Walking', sets: 1, reps: null, duration: 300, type: 'cardio', isTime: true },
    ],
  },
];

export function getTemplatesByCategory() {
  const cats = {};
  TEMPLATES.forEach(t => {
    (cats[t.category] = cats[t.category] || []).push(t);
  });
  return cats;
}
