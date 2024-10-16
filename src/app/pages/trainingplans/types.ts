export type ExerciseType = {
    id: string,
    exercise: string
}

export type ExerciseByDayType = {
    id: string,
    exercises?: ExerciseType[]
}

export type ExercisePlansType = {
    id: string
    user_id: string
    plan_name: string
    plan: ExerciseByDayType[]
    active: boolean
}