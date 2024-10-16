export type SeriesType = {
    load: string
    iterations: string
}

export type SerieseType = {
    id: string
    series: SeriesType
}

export type TrainingExerciseType = {
    ex_id: string
    done: boolean
    seriese?: SerieseType[]
}

export type TrainingType = {
    date: string
    day_id: string
    day_name: string
    id: string
    plan_id: string
    exercises: TrainingExerciseType[]
}