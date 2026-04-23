import type { Exercise } from '../types'

type ExerciseRaw = Omit<Exercise, 'type'>

const strength: ExerciseRaw[] = [
  { id: 's1', name: 'Bench Press', muscle: 'Chest', equipment: 'Barbell' },
  { id: 's2', name: 'Squat', muscle: 'Legs', equipment: 'Barbell' },
  { id: 's3', name: 'Deadlift', muscle: 'Back', equipment: 'Barbell' },
  { id: 's4', name: 'Overhead Press', muscle: 'Shoulders', equipment: 'Barbell' },
  { id: 's5', name: 'Barbell Row', muscle: 'Back', equipment: 'Barbell' },
  { id: 's6', name: 'Dumbbell Curl', muscle: 'Arms', equipment: 'Dumbbell' },
  { id: 's7', name: 'Tricep Pushdown', muscle: 'Arms', equipment: 'Cable' },
  { id: 's8', name: 'Lat Pulldown', muscle: 'Back', equipment: 'Cable' },
  { id: 's9', name: 'Leg Press', muscle: 'Legs', equipment: 'Machine' },
  { id: 's10', name: 'Dumbbell Fly', muscle: 'Chest', equipment: 'Dumbbell' },
  { id: 's11', name: 'Lateral Raise', muscle: 'Shoulders', equipment: 'Dumbbell' },
  { id: 's12', name: 'Lunges', muscle: 'Legs', equipment: 'Dumbbell' },
  { id: 's13', name: 'Romanian Deadlift', muscle: 'Hamstrings', equipment: 'Barbell' },
  { id: 's14', name: 'Cable Fly', muscle: 'Chest', equipment: 'Cable' },
  { id: 's15', name: 'Face Pull', muscle: 'Rear Delts', equipment: 'Cable' },
  { id: 's16', name: 'Incline Bench Press', muscle: 'Upper Chest', equipment: 'Barbell' },
  { id: 's17', name: 'Hammer Curl', muscle: 'Arms', equipment: 'Dumbbell' },
  { id: 's18', name: 'Skull Crusher', muscle: 'Triceps', equipment: 'Barbell' },
  { id: 's19', name: 'Calf Raises', muscle: 'Calves', equipment: 'Machine' },
  { id: 's20', name: 'Leg Curl', muscle: 'Hamstrings', equipment: 'Machine' },
  { id: 's21', name: 'Shrugs', muscle: 'Traps', equipment: 'Dumbbell' },
  { id: 's22', name: 'Chest Dips', muscle: 'Chest/Triceps', equipment: 'Bodyweight' },
  { id: 's23', name: 'Hip Thrust', muscle: 'Glutes', equipment: 'Barbell' },
  { id: 's24', name: 'Farmer\'s Walk', muscle: 'Full Body', equipment: 'Dumbbell' },
]

const bodyweight: ExerciseRaw[] = [
  { id: 'b1', name: 'Push-ups', muscle: 'Chest' },
  { id: 'b2', name: 'Pull-ups', muscle: 'Back' },
  { id: 'b3', name: 'Dips', muscle: 'Chest/Triceps' },
  { id: 'b4', name: 'Plank', muscle: 'Core', isTime: true },
  { id: 'b5', name: 'Crunches', muscle: 'Core' },
  { id: 'b6', name: 'Burpees', muscle: 'Full Body' },
  { id: 'b7', name: 'Mountain Climbers', muscle: 'Core', isTime: true },
  { id: 'b8', name: 'Bodyweight Squats', muscle: 'Legs' },
  { id: 'b9', name: 'Chin-ups', muscle: 'Back/Arms' },
  { id: 'b10', name: 'Pike Push-ups', muscle: 'Shoulders' },
  { id: 'b11', name: 'Diamond Push-ups', muscle: 'Triceps' },
  { id: 'b12', name: 'Glute Bridge', muscle: 'Glutes' },
  { id: 'b13', name: 'Leg Raises', muscle: 'Core' },
  { id: 'b14', name: 'Russian Twist', muscle: 'Core' },
  { id: 'b15', name: 'Superman Hold', muscle: 'Lower Back', isTime: true },
  { id: 'b16', name: 'Wall Sit', muscle: 'Legs', isTime: true },
  { id: 'b17', name: 'Side Plank', muscle: 'Obliques', isTime: true },
  { id: 'b18', name: 'Squat Jumps', muscle: 'Legs' },
  { id: 'b19', name: 'Jumping Jacks', muscle: 'Full Body' },
  { id: 'b20', name: 'High Knees', muscle: 'Core/Cardio', isTime: true },
]

const cardio: ExerciseRaw[] = [
  { id: 'c1', name: 'Running', isTime: true, calPerMin: 11 },
  { id: 'c2', name: 'Cycling', isTime: true, calPerMin: 8 },
  { id: 'c3', name: 'Swimming', isTime: true, calPerMin: 10 },
  { id: 'c4', name: 'Jump Rope', isTime: true, calPerMin: 13 },
  { id: 'c5', name: 'Rowing', isTime: true, calPerMin: 9 },
  { id: 'c6', name: 'Walking', isTime: true, calPerMin: 5 },
  { id: 'c7', name: 'Stair Climber', isTime: true, calPerMin: 10 },
  { id: 'c8', name: 'HIIT', isTime: true, calPerMin: 14 },
  { id: 'c9', name: 'Elliptical', isTime: true, calPerMin: 7 },
  { id: 'c10', name: 'Brisk Walking', isTime: true, calPerMin: 6 },
  { id: 'c11', name: 'Boxing / Kickboxing', isTime: true, calPerMin: 12 },
  { id: 'c12', name: 'Dancing', isTime: true, calPerMin: 7 },
]

const yoga: ExerciseRaw[] = [
  { id: 'y1', name: 'Sun Salutation', isTime: true },
  { id: 'y2', name: 'Vinyasa Flow', isTime: true },
  { id: 'y3', name: 'Warrior Sequence', isTime: true },
  { id: 'y4', name: 'Hip Opener Flow', isTime: true },
  { id: 'y5', name: 'Restorative Yoga', isTime: true },
  { id: 'y6', name: 'Power Yoga', isTime: true },
  { id: 'y7', name: 'Yin Yoga', isTime: true },
  { id: 'y8', name: 'Balance Poses', isTime: true },
]

const sports: ExerciseRaw[] = [
  // Team sports
  { id: 'sp1', name: 'Basketball', isTime: true, calPerMin: 9, muscle: 'Full Body' },
  { id: 'sp2', name: 'Football / Soccer', isTime: true, calPerMin: 10, muscle: 'Full Body' },
  { id: 'sp3', name: 'Cricket', isTime: true, calPerMin: 6, muscle: 'Full Body' },
  { id: 'sp4', name: 'Volleyball', isTime: true, calPerMin: 8, muscle: 'Full Body' },
  { id: 'sp5', name: 'Badminton', isTime: true, calPerMin: 9, muscle: 'Full Body' },
  { id: 'sp6', name: 'Table Tennis', isTime: true, calPerMin: 6, muscle: 'Full Body' },
  { id: 'sp7', name: 'Tennis', isTime: true, calPerMin: 10, muscle: 'Full Body' },
  // Outdoor / solo
  { id: 'sp8', name: 'Hiking', isTime: true, calPerMin: 7, muscle: 'Full Body' },
  { id: 'sp9', name: 'Rock Climbing', isTime: true, calPerMin: 10, muscle: 'Back/Arms' },
  { id: 'sp10', name: 'Skateboarding', isTime: true, calPerMin: 6, muscle: 'Legs/Core' },
  { id: 'sp11', name: 'Surfing', isTime: true, calPerMin: 7, muscle: 'Full Body' },
  { id: 'sp12', name: 'Martial Arts (MMA/BJJ)', isTime: true, calPerMin: 11, muscle: 'Full Body' },
  { id: 'sp13', name: 'Karate / Taekwondo', isTime: true, calPerMin: 10, muscle: 'Full Body' },
  { id: 'sp14', name: 'Wrestling', isTime: true, calPerMin: 12, muscle: 'Full Body' },
  // Home equipment
  { id: 'sp15', name: 'Resistance Band Row', muscle: 'Back', equipment: 'Resistance Band' },
  { id: 'sp16', name: 'Resistance Band Squat', muscle: 'Legs', equipment: 'Resistance Band' },
  { id: 'sp17', name: 'Resistance Band Curl', muscle: 'Arms', equipment: 'Resistance Band' },
  { id: 'sp18', name: 'Kettlebell Swing', muscle: 'Full Body', equipment: 'Kettlebell' },
  { id: 'sp19', name: 'Kettlebell Goblet Squat', muscle: 'Legs', equipment: 'Kettlebell' },
  { id: 'sp20', name: 'Kettlebell Clean & Press', muscle: 'Full Body', equipment: 'Kettlebell' },
  { id: 'sp21', name: 'TRX Row', muscle: 'Back', equipment: 'TRX' },
  { id: 'sp22', name: 'TRX Push-up', muscle: 'Chest', equipment: 'TRX' },
  { id: 'sp23', name: 'Medicine Ball Slam', muscle: 'Core/Full Body', equipment: 'Medicine Ball' },
]

export const EXERCISES = {
  strength: strength.map(e => ({ ...e, type: 'strength' as const })),
  bodyweight: bodyweight.map(e => ({ ...e, type: 'bodyweight' as const })),
  cardio: cardio.map(e => ({ ...e, type: 'cardio' as const })),
  yoga: yoga.map(e => ({ ...e, type: 'yoga' as const })),
  sports: sports.map(e => ({ ...e, type: 'sports' as const })),
}

export function getAllExercises(): Exercise[] {
  return [
    ...EXERCISES.strength,
    ...EXERCISES.bodyweight,
    ...EXERCISES.cardio,
    ...EXERCISES.yoga,
    ...EXERCISES.sports,
  ]
}

export function searchExercises(query: string): Exercise[] {
  const q = query.toLowerCase().trim()
  if (!q) return []
  return getAllExercises()
    .filter(e => e.name.toLowerCase().includes(q) || (e.muscle ?? '').toLowerCase().includes(q) || e.type.includes(q))
    .slice(0, 10)
}
