"use client"

import { Button, Grid2 as Grid, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { PlanDays } from "../components/planDays";
import { ExercisePlansType } from "../types";
import { getAuth } from "firebase/auth";
import { getFromDb } from "@/app/database/getFromDb";
import { useRouter } from "next/navigation";

type PlanType = {
    preview?: boolean
}

export const Plan = ({ preview }: PlanType) => {
    const [id, setId] = useState("")
    const [plan, setPlan] = useState<ExercisePlansType>()
    const [planName, setPlanName] = useState("")
    const [isPreview, setIsPreview] = useState(preview)
    const auth = getAuth()
    const router = useRouter();

    useEffect(() => {
        const paramId = window.location.search.split("?id=").pop()
        paramId && setId(paramId)
    }, [])

    useEffect(() => {
        if (auth.currentUser?.uid && id) {
            getFromDb({ collectionName: "training_plans", fieldId: "id", comparisonType: "==", fildValue: id })
                .then(data => data && setPlan(data?.data[0]?.data as ExercisePlansType))
                .catch((err: any) => console.error(err.message))
        }
    }, [id])

    useEffect(() => {
        plan?.plan_name && setPlanName(plan.plan_name)
    }, [plan])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "plan_name") setPlanName(value);
    };

    const onEditMode = () => {
        setIsPreview(false)
    }

    return (
        <Grid container spacing={2} size={12} mt={10} display={"flex"} flexDirection={"column"} alignItems={"center"}>
            <Grid spacing={2} size={{ xs: 11, md: 8 }}>
                <form style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <Grid container spacing={2} size={12} >
                        <Grid container size={12}>
                            {isPreview && (
                                <Grid container size={12}>
                                    <Grid container size={{ xs: 12, md: 6 }}>
                                        <Button variant="outlined" onClick={() => router.push("/pages/trainingplans")} fullWidth disabled={!planName} >
                                            Back
                                        </Button>
                                    </Grid>
                                    <Grid container size={{ xs: 12, md: 6 }}>
                                        <Button variant="contained" onClick={onEditMode} fullWidth disabled={!planName} >
                                            Edit
                                        </Button>
                                    </Grid>
                                </Grid>
                            )}
                            <TextField
                                required
                                id="outlined-required"
                                type='text'
                                name='plan_name'
                                onChange={handleChange}
                                size="small"
                                fullWidth
                                value={planName}
                                label="Plan Name"
                                disabled={isPreview}
                            />

                        </Grid>
                        <Grid size={12}>
                            <PlanDays
                                planName={planName}
                                prevPlanDays={plan?.plan}
                                preview={isPreview} id={id}
                                setPreview={setIsPreview}
                            />
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    )
}