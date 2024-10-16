"use client"

import { getFromDb } from "@/app/database/getFromDb";
import { Button, Grid2 as Grid, Stack } from "@mui/material"
import { useEffect, useMemo, useState } from "react";
import { ExercisePlansType } from "../../trainingplans/types";
import { getAuth } from "firebase/auth";
import { v4 as uuidv4 } from "uuid";
import { Loading } from "@/components/Loading/Loading";
import { addToDb } from "@/app/database/addToDb";
import { updateDb } from "@/app/database/updateDb";
import { TrainingHeader } from "../components/trainingHeader";
import { TrainingExerciseType, SerieseType, TrainingType } from "../types";
import { TrainingExercise } from "../components/trainingExercise";
import { useRouter } from "next/navigation";

type TrainingTypeProps = {
    preview?: boolean
}

export const Training = ({ preview }: TrainingTypeProps) => {
    const [id, setId] = useState<string | undefined>(undefined)
    const [loading, setLoading] = useState(false)
    const [trainingPlan, setTrainingPlan] = useState<ExercisePlansType>()
    const [currentExercise, setCurrentExercise] = useState<string | undefined>()
    const [trainingDate, setTrainingDate] = useState<string | undefined>(undefined)
    const [dayId, setDayId] = useState<string | undefined>(undefined)
    const [dayName, setDayName] = useState<string | undefined>(undefined)
    const [exercises, setExercises] = useState<TrainingExerciseType[] | undefined>(undefined)
    const [seriese, setSeriese] = useState<SerieseType[] | undefined>(undefined)
    const auth = getAuth()
    const router = useRouter();

    useEffect(() => {
        const paramId = window.location.search.split("?id=").pop()
        paramId && paramId.length > 0 && setId(paramId)
    }, [])

    const planDay = useMemo(() => {
        return trainingPlan?.plan.find(planDay => planDay.id === dayId)
    }, [dayId, trainingPlan])

    useEffect(() => {
        if (!exercises) {
            setExercises(planDay?.exercises?.map(exercise => ({ ex_id: exercise.id, done: false, seriese: [] })))
        }
        setSeriese(undefined)
        setCurrentExercise(undefined)
    }, [planDay])

    useEffect(() => {
        if (exercises) {
            setExercises(exercise => exercise && exercise.map(e => e.ex_id === currentExercise ? ({ ...e, seriese: seriese }) : e))
        }
    }, [seriese])

    useEffect(() => {
        dayId && setDayName(`Day ${dayId.slice(4, 100)}`)
    }, [dayId])

    useEffect(() => {
        if (auth.currentUser?.uid) {
            getFromDb({
                collectionName: "training_plans",
                fieldId: "user_id",
                comparisonType: "==",
                fildValue: auth.currentUser?.uid,
                secFieldId: "active",
                secComparisonType: "==",
                secFildValue: true
            })
                .then(data => setTrainingPlan(data.data[0].data as ExercisePlansType))
                .catch((err: any) => console.error(err.message))
        }
    }, [])

    useEffect(() => {
        if (auth.currentUser?.uid && id) {
            getFromDb({ collectionName: "trainings", fieldId: "id", comparisonType: "==", fildValue: id })
                .then(data => {
                    const training = data?.data[0]?.data as TrainingType
                    setTrainingDate(training.date)
                    setDayId(training.day_id)
                    setDayName(training.day_name)
                    setExercises(training.exercises)
                })
                .catch((err: any) => console.error(err.message))
        }
    }, [id])

    const onAddSerie = (id: string) => {
        if (currentExercise !== id) {
            setCurrentExercise(id)
            setSeriese([{ id: `series_1`, series: { load: '', iterations: '' } }])
        } else {
            setSeriese(seriese => seriese && [...seriese, { id: `series_${seriese.length + 1}`, series: { load: '', iterations: '' } }])
        }
    }

    const onRemoveSeries = (id: string) => {
        setSeriese(seriese => seriese && seriese.filter(series => series.id !== id))
    }

    const onCheck = (ex_id: string) => {
        if (exercises?.find(exercise => exercise.ex_id === ex_id)?.done) {
            setExercises(exercise => exercise && exercise.map(e => e.ex_id === ex_id ? ({ ...e, done: false }) : e))
            setCurrentExercise(ex_id)
            setSeriese(exercises.find(exercise => exercise.ex_id === ex_id)?.seriese)
        } else {
            if (id === undefined) {
                onSaveNewTraining(ex_id)
            } else {
                onUpdateTraining(ex_id)
            }
        }

    }

    const onSaveNewTraining = (id: string) => {
        const tempId = uuidv4()
        setId(tempId)
        setLoading(true)
        if (auth.currentUser) {
            addToDb({
                collectionName: "trainings", id: tempId, data: {
                    date: trainingDate,
                    day_id: dayId,
                    day_name: dayName,
                    id: tempId,
                    plan_id: trainingPlan?.id,
                    user_id: auth.currentUser.uid,
                    exercises: exercises?.map(e => e.ex_id === id ? ({ ...e, done: true }) : e)
                }
            })
                .then(() => {
                    setLoading(false)
                    setExercises(exercise => exercise && exercise.map(e => e.ex_id === id ? ({ ...e, done: true }) : e))
                    setCurrentExercise(undefined)
                })
                .catch((err: any) => {
                    setLoading(false)
                    console.log(err.message)
                })
        }
    }

    const onUpdateTraining = (ex_id: string) => {
        if (auth.currentUser && id) {
            updateDb({
                collectionName: "trainings", id: id, data: {
                    date: trainingDate,
                    day_id: dayId,
                    day_name: dayName,
                    id: id,
                    plan_id: trainingPlan?.id,
                    user_id: auth.currentUser.uid,
                    exercises: exercises?.map(e => e.ex_id === ex_id ? ({ ...e, done: true }) : e)
                }
            })
                .then(() => {
                    setLoading(false)
                    setExercises(exercise => exercise && exercise.map(e => e.ex_id === ex_id ? ({ ...e, done: true }) : e))
                    setCurrentExercise(undefined)
                })
                .catch((err: any) => {
                    setLoading(false)
                    console.log(err.message)
                })
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, seriesId: string) => {
        const { name, value } = e.target;

        if (name === `load_${seriesId}`) {
            setSeriese(seriese => seriese && seriese.map(e => e.id === seriesId ? ({ ...e, series: { load: value, iterations: e.series.iterations } }) : e))
        }
        if (name === `iterations_${seriesId}`) {
            setSeriese(seriese => seriese && seriese.map(e => e.id === seriesId ? ({ ...e, series: { load: e.series.load, iterations: value } }) : e))
        }
    };



    return (
        <Grid container spacing={2} size={12} margin={2} mt={8} display={"flex"} flexDirection={"column"} alignItems={"center"} >
            <Button variant="outlined" onClick={() => router.push("/pages/trainings")} fullWidth>
                Back to list
            </Button>
            <Grid container spacing={2} size={12} display={"flex"} justifyContent={"center"} mt={2}>
                <TrainingHeader
                    setDayId={setDayId}
                    setTrainingDate={setTrainingDate}
                    trainingPlan={trainingPlan}
                    id={id}
                    preview={preview}
                    trainingDate={trainingDate}
                    trainingDayId={dayId}
                />
                <Stack
                    spacing={{ xs: 1, sm: 2 }}
                    direction="column"
                    useFlexGap
                    alignItems={"center"}
                    sx={{ flexWrap: 'wrap' }}
                    width={"100%"}
                >
                    {planDay?.exercises?.map((item, i) => (
                        <TrainingExercise
                            key={item.id}
                            trainingPlanExercise={item}
                            currentExercise={currentExercise}
                            onAddSerie={onAddSerie}
                            onCheck={onCheck}
                            handleChange={handleChange}
                            onRemoveSeries={onRemoveSeries}
                            preview={preview}
                            trainingExercise={exercises?.find(exercise => exercise.ex_id === item.id)}
                            isDone={exercises?.find(exercise => exercise.ex_id === item.id)?.done ?? false}
                        />
                    ))}
                </Stack>
            </Grid>
            {loading && <Loading />}
        </Grid>
    )
}