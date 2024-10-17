"use client"

import { Button, Grid2 as Grid, Typography } from "@mui/material"
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TrainingType } from "./types";
import { getFromDb } from "@/app/database/getFromDb";
import { TrainingsList } from "./components/trainingList";
import { ExercisePlansType } from "../trainingplans/types";

export const Trainings = () => {
    const [trainings, setTrainings] = useState<{ data: TrainingType, id: string }[]>()
    const [trainingPlans, setTrainingPlans] = useState<ExercisePlansType[]>()
    const router = useRouter();
    const auth = getAuth()

    useEffect(() => {
        if (auth.currentUser?.uid) {
            getFromDb({ collectionName: "trainings", fieldId: "user_id", comparisonType: "==", fildValue: auth.currentUser?.uid })
                .then(data => setTrainings(data.data.map(d => ({ data: d.data as TrainingType, id: d.id }))))
                .catch((err: any) => console.error(err.message))
        }
    }, [])

    useEffect(() => {
        getTrainingPlans()
    }, [auth])

    const getTrainingPlans = () => {
        if (auth.currentUser?.uid) {
            getFromDb({
                collectionName: "training_plans",
                fieldId: "user_id",
                comparisonType: "==",
                fildValue: auth.currentUser?.uid
            })
                .then(data => {
                    const mapData: ExercisePlansType[] = data.data.map(item => ({ ...item.data as ExercisePlansType }))
                    setTrainingPlans(mapData);
                })
                .catch((err: any) => console.error(err.message))
        }
    }

    return (
        <Grid container spacing={2} size={12} mt={10} display={"flex"} flexDirection={"column"} alignItems={"center"}>
            <Grid size={{ xs: 11, md: 8 }}>
                <Grid size={12} display={"flex"} justifyContent={"space-between"}>
                    <Typography textAlign={"start"} color="textPrimary" variant="h6" component="h6">
                        Trainings
                    </Typography>
                    <Button variant="contained" onClick={() => router.push("/pages/trainings/addtraining")}>
                        Start Training
                    </Button>
                </Grid>
                <Grid size={12} mt={4}>
                    <TrainingsList trainings={trainings?.map(training => training.data)} trainingPlans={trainingPlans} />
                </Grid>
            </Grid>
        </Grid>
    )
}