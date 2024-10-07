"use client"

import React from "react";
import { getFromDb } from "@/app/database/getFromDb";
import { Button, Grid2 as Grid, Typography } from "@mui/material"
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ExercisePlansType } from "./types";
import { PlansList } from "./components/plansList";

export const TrainingPlans = () => {
    const [plans, setPlans] = useState<{ data: ExercisePlansType, id: string }[]>()
    const router = useRouter();
    const auth = getAuth()
    console.log(plans)
    useEffect(() => {
        if (auth.currentUser?.uid) {
            getFromDb({ collectionName: "training_plans", fieldId: "user_id", comparisonType: "==", fildValue: auth.currentUser?.uid })
                .then(data => setPlans(data.data.map(d => ({ data: d.data as ExercisePlansType, id: d.id }))))
                .catch((err: any) => console.error(err.message))
        }
    }, [])

    return (
        <Grid container spacing={2} size={12} mt={10} display={"flex"} flexDirection={"column"} alignItems={"center"}>
            <Grid spacing={2} size={{ xs: 11, md: 8 }}>
                <Grid size={12} display={"flex"} justifyContent={"space-between"}>
                    <Typography textAlign={"start"} color="textPrimary" variant="h6" component="h6">
                        Training Plans
                    </Typography>
                    <Button variant="contained" onClick={() => router.push("/pages/trainingplans/addplan")}>
                        Add New
                    </Button>
                </Grid>
                <Grid size={12}>
                    {!plans || plans.length === 0 ?
                        (
                            <Typography textAlign={"start"} color="textPrimary" variant="h6" component="h6">
                                You don't have a plan yet, add a new plan.
                            </Typography>
                        )
                        :
                        (
                            // <PlanTable plans={plans} />
                            <PlansList plans={plans.map(plan => ({ id: plan.data.id, planName: plan.data.plan_name }))} />
                        )
                    }

                </Grid>
            </Grid>

        </Grid>
    )
}