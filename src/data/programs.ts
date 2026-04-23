// Comprehensive fitness programs inspired by real training plans

export interface FitnessProgram {
  id: string
  name: string
  emoji: string
  duration: string
  level: string
  focus: string
  schedule: DayPlan[]
  tips: string[]
  dietTips: string[]
}

export interface DayPlan {
  day: string
  label: string
  color: string
  exercises: ProgramExercise[]
}

export interface ProgramExercise {
  name: string
  sets: string
  muscle: string
}

export const MUSCLE_GROUPS = [
  { id: 'chest', name: 'Chest', emoji: '🫁' },
  { id: 'back', name: 'Back', emoji: '🔙' },
  { id: 'shoulders', name: 'Shoulders', emoji: '💪' },
  { id: 'biceps', name: 'Biceps', emoji: '💪' },
  { id: 'triceps', name: 'Triceps', emoji: '🦾' },
  { id: 'core', name: 'Core / Abs', emoji: '🧱' },
  { id: 'quads', name: 'Quads', emoji: '🦵' },
  { id: 'hamstrings', name: 'Hamstrings', emoji: '🦵' },
  { id: 'glutes', name: 'Glutes', emoji: '🍑' },
  { id: 'calves', name: 'Calves', emoji: '🦶' },
  { id: 'forearms', name: 'Forearms', emoji: '🤛' },
  { id: 'cardio', name: 'Cardio', emoji: '❤️' },
] as const

export const WARMUP_ROUTINE: ProgramExercise[] = [
  { name: 'Neck Rolls', sets: '30 sec', muscle: 'neck' },
  { name: 'Arm Circles', sets: '30 sec', muscle: 'shoulders' },
  { name: 'Hip Rotations', sets: '30 sec', muscle: 'core' },
  { name: 'Leg Swings', sets: '30 sec each', muscle: 'legs' },
  { name: 'Spot Jogging', sets: '1 min', muscle: 'cardio' },
]

export const COOLDOWN_ROUTINE: ProgramExercise[] = [
  { name: 'Hamstring Stretch', sets: '30 sec each', muscle: 'hamstrings' },
  { name: 'Quad Stretch', sets: '30 sec each', muscle: 'quads' },
  { name: 'Chest Stretch', sets: '30 sec', muscle: 'chest' },
  { name: 'Shoulder Stretch', sets: '30 sec each', muscle: 'shoulders' },
  { name: 'Child Pose', sets: '30–60 sec', muscle: 'back' },
]

export const FITNESS_PROGRAMS: FitnessProgram[] = [
  {
    id: 'fat-loss-gym',
    name: 'Fat Loss & Fitness Plan',
    emoji: '🔥',
    duration: '8–12 weeks',
    level: 'Beginner to Intermediate',
    focus: 'Lose Fat · Build Muscle · Improve Strength',
    schedule: [
      { day: 'MON', label: 'Upper Body (Push + Pull)', color: 'var(--clr-accent-l)', exercises: [
        { name: 'Push Ups', sets: '3 × 8–15', muscle: 'chest' },
        { name: 'Bench Press', sets: '3 × 8–12', muscle: 'chest' },
        { name: 'Shoulder Press', sets: '3 × 8–12', muscle: 'shoulders' },
        { name: 'Pull Ups', sets: '3 × 6–10', muscle: 'back' },
        { name: 'Dumbbell Row', sets: '3 × 8–12', muscle: 'back' },
        { name: 'Bicep Curl', sets: '3 × 10–15', muscle: 'biceps' },
        { name: 'Triceps Dips', sets: '3 × 10–15', muscle: 'triceps' },
      ]},
      { day: 'TUE', label: 'Lower Body', color: 'var(--clr-sky-l)', exercises: [
        { name: 'Squats', sets: '3 × 8–12', muscle: 'quads' },
        { name: 'Lunges', sets: '3 × 10 each', muscle: 'quads' },
        { name: 'Romanian Deadlift', sets: '3 × 8–12', muscle: 'hamstrings' },
        { name: 'Leg Press', sets: '3 × 10–12', muscle: 'quads' },
        { name: 'Calf Raises', sets: '3 × 15–20', muscle: 'calves' },
      ]},
      { day: 'WED', label: 'Cardio / Active Recovery', color: 'var(--clr-amber-l)', exercises: [
        { name: 'Brisk Walk / Cycling', sets: '30–45 min', muscle: 'cardio' },
        { name: 'Mobility Work', sets: '15 min', muscle: 'core' },
      ]},
      { day: 'THU', label: 'Upper Body', color: 'var(--clr-accent-l)', exercises: [
        { name: 'Push Ups', sets: '3 × 8–15', muscle: 'chest' },
        { name: 'Dumbbell Row', sets: '3 × 8–12', muscle: 'back' },
        { name: 'Shoulder Press', sets: '3 × 8–12', muscle: 'shoulders' },
        { name: 'Bicep Curl', sets: '3 × 10–15', muscle: 'biceps' },
        { name: 'Triceps Dips', sets: '3 × 10–15', muscle: 'triceps' },
      ]},
      { day: 'FRI', label: 'Lower Body + Core', color: 'var(--clr-sky-l)', exercises: [
        { name: 'Squats', sets: '3 × 8–12', muscle: 'quads' },
        { name: 'Romanian Deadlift', sets: '3 × 8–12', muscle: 'hamstrings' },
        { name: 'Plank', sets: '3 × 30–60 sec', muscle: 'core' },
        { name: 'Russian Twist', sets: '3 × 15–20', muscle: 'core' },
        { name: 'Leg Raises', sets: '3 × 10–15', muscle: 'core' },
      ]},
      { day: 'SAT', label: 'Cardio / HIIT / Sports', color: 'var(--clr-amber-l)', exercises: [
        { name: 'HIIT or Sports', sets: '20–30 min', muscle: 'cardio' },
      ]},
      { day: 'SUN', label: 'Rest & Recover', color: 'var(--clr-rose-l)', exercises: [] },
    ],
    tips: [
      'Be consistent — don\'t miss workouts',
      'Focus on form — quality > quantity',
      'Progressive overload — increase weight/reps gradually',
      'Get 7–8 hours of sleep every night',
      'Drink 3–4 liters of water per day',
      'Rest 45–90 seconds between sets',
      'Warm up 5–10 min, cool down 5–10 min',
    ],
    dietTips: [
      'Eat a calorie deficit (300–500 cal below TDEE)',
      'Protein: 1.2–1.6g per kg bodyweight',
      'Eat whole foods, less processed',
      'Avoid sugar, junk food & soft drinks',
      'Eat your last meal 2–3 hours before sleep',
      'Aim for 8,000–12,000 steps per day',
    ],
  },
  {
    id: 'home-bodyweight',
    name: 'Home Workout (No Equipment)',
    emoji: '🏠',
    duration: '8+ weeks',
    level: 'Beginner to Intermediate',
    focus: 'Burn Fat · Tone Body · No Gym Needed',
    schedule: [
      { day: 'MON', label: 'Full Body Workout', color: 'var(--clr-accent-l)', exercises: [
        { name: 'Squats', sets: '15–20 reps', muscle: 'quads' },
        { name: 'Push Ups', sets: '10–15 reps', muscle: 'chest' },
        { name: 'Lunges', sets: '12–15 each', muscle: 'quads' },
        { name: 'Plank', sets: '30–60 sec', muscle: 'core' },
        { name: 'Mountain Climbers', sets: '20–30 reps', muscle: 'cardio' },
        { name: 'Glute Bridge', sets: '15–20 reps', muscle: 'glutes' },
      ]},
      { day: 'TUE', label: 'Brisk Walk', color: 'var(--clr-amber-l)', exercises: [
        { name: 'Brisk Walking', sets: '30–45 min', muscle: 'cardio' },
      ]},
      { day: 'WED', label: 'HIIT Workout', color: 'var(--clr-rose-l)', exercises: [
        { name: 'Jumping Jacks', sets: '30–45 sec', muscle: 'cardio' },
        { name: 'High Knees', sets: '30–45 sec', muscle: 'cardio' },
        { name: 'Burpees', sets: '8–12 reps', muscle: 'cardio' },
        { name: 'Mountain Climbers', sets: '30–45 sec', muscle: 'cardio' },
        { name: 'Squat Jumps', sets: '12–15 reps', muscle: 'quads' },
        { name: 'Plank Jacks', sets: '30–45 sec', muscle: 'core' },
      ]},
      { day: 'THU', label: 'Brisk Walk', color: 'var(--clr-amber-l)', exercises: [
        { name: 'Brisk Walking', sets: '30–45 min', muscle: 'cardio' },
      ]},
      { day: 'FRI', label: 'Full Body Workout', color: 'var(--clr-accent-l)', exercises: [
        { name: 'Squats', sets: '15–20 reps', muscle: 'quads' },
        { name: 'Push Ups', sets: '10–15 reps', muscle: 'chest' },
        { name: 'Lunges', sets: '12–15 each', muscle: 'quads' },
        { name: 'Plank', sets: '30–60 sec', muscle: 'core' },
        { name: 'Mountain Climbers', sets: '20–30 reps', muscle: 'cardio' },
        { name: 'Glute Bridge', sets: '15–20 reps', muscle: 'glutes' },
      ]},
      { day: 'SAT', label: 'Active Day (Yoga/Stretching)', color: 'var(--clr-sky-l)', exercises: [
        { name: 'Yoga / Stretching / Sport', sets: '30–45 min', muscle: 'core' },
      ]},
      { day: 'SUN', label: 'Rest or Light Walk', color: 'var(--clr-rose-l)', exercises: [] },
    ],
    tips: [
      'Increase reps or time every week',
      'Reduce rest time between sets over time',
      'Stay consistent and be patient',
      'Focus on form, not speed',
      'Listen to your body — rest if you feel pain',
      'Celebrate small progress',
    ],
    dietTips: [
      'Eat at a calorie deficit — eat less, move more',
      'High protein: dal, eggs, chicken, paneer, soya',
      'More vegetables, fruits & whole foods',
      'Avoid sugar, junk food & soft drinks',
      'Drink plenty of water (2.5–3L daily)',
    ],
  },
]
