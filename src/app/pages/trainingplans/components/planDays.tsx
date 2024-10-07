import { useEffect, useState } from "react"

import { Button, Divider, Grid2 as Grid, Typography } from "@mui/material"
import { getAuth } from "firebase/auth"
import { addToDb } from "@/app/database/addToDb"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Loading } from "@/components/Loading/Loading"
import { ExerciseByDayType, ExercisePlansType, ExerciseType } from "../types"
import { DayExercises } from "./dayExercises"
import { updateDb } from "@/app/database/updateDb"

type PlanDaysType = {
    planName: string;
    preview?: boolean
    prevPlanDays?: ExerciseByDayType[]
    id?: string
    setPreview: (prop: boolean) => void
}

export const PlanDays = ({ planName, preview, prevPlanDays, id, setPreview }: PlanDaysType) => {
    const [loading, setLoading] = useState(false)
    const [planDays, setPlanDays] = useState<ExerciseByDayType[]>(prevPlanDays || [{ id: `day_1` }])
    const [prevPlan, setPrevPlan] = useState(prevPlanDays)
    const auth = getAuth();
    const router = useRouter();

    useEffect(() => {
        if (prevPlanDays) {
            setPlanDays(prevPlanDays)
            setPrevPlan(prevPlanDays)
        }
    }, [prevPlanDays])

    const addDay = () => {
        const exercise: ExerciseByDayType = { id: `day_${planDays.length + 1}` }
        setPlanDays(item => [...item, exercise]);
    }

    const removeDay = (id: string) => {
        setPlanDays(item => [...item.filter(ex => ex.id !== id)]);
    }

    const addExercise = ({ exercises, day_id }: { exercises: ExerciseType[], day_id: string }) => {
        const dayPlan: ExerciseByDayType = { id: day_id, exercises: exercises }
        setPlanDays(item => [...item.filter(ex => ex.id !== day_id), dayPlan]);
    }

    const newPlanId = uuidv4()

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        if (auth.currentUser) {
            addToDb({ collectionName: "training_plans", id: newPlanId, data: { id: newPlanId, user_id: auth.currentUser.uid, plan_name: planName, plan: planDays } })
                .then(() => {
                    console.log("success")
                    setLoading(false)
                    router.push("/pages/trainingplans")
                })
                .catch((err: any) => {
                    setLoading(false)
                    console.log(err.message)
                })
        }
    };

    const handleSaveEdit = async (e: React.FormEvent, id: string) => {
        e.preventDefault();
        setLoading(true)
        if (auth.currentUser) {
            updateDb({ collectionName: "training_plans", id: id, data: { id: id, user_id: auth.currentUser.uid, plan_name: planName, plan: planDays } })
                .then(() => {
                    console.log("success")
                    setLoading(false)
                    setPrevPlan(planDays)
                    setPreview(true)
                })
                .catch((err: any) => {
                    setLoading(false)
                    console.log(err.message)
                })
        }
    };

    const onCancel = () => {
        if (prevPlan) {
            setPlanDays(prevPlan)
            setPreview(true)
        } else {
            router.push("/pages/trainingplans")
        }
    }

    return (
        <Grid container spacing={2} size={12} mt={1} display={"flex"} flexDirection={"column"} alignItems={"center"}>
            <Grid container spacing={2} size={12}>
                {planDays.map((item, i) =>
                    <Grid container spacing={2} size={12} key={i} display={"flex"} alignItems={"center"} >
                        <Typography textAlign={"start"} color="textPrimary" variant="h6" component="h6">
                            Day {i + 1}
                        </Typography>
                        {!preview && (
                            planDays.length > 1 ?
                                <DeleteIcon onClick={() => removeDay(item.id)} color="error" style={{ cursor: "pointer" }} /> :
                                <DeleteIcon color="disabled" />
                        )}
                        <Grid size={12}>
                            <DayExercises addExercise={(exercises) => addExercise({ exercises, day_id: item.id })} preview={preview} prevExercises={item.exercises} />
                        </Grid>
                        <Grid size={12}>
                            <Divider />
                        </Grid>

                    </Grid>
                )}
                {!preview && (
                    <Grid container size={12} display={"flex"} gap={2} justifyContent={"space-between"} mb={4}>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Button variant="contained" onClick={addDay} fullWidth startIcon={<AddIcon />} >
                                Add Next Day
                            </Button>
                        </Grid>
                        <Grid container spacing={2} size={{ xs: 12, md: 6 }}>
                            <Grid size={{ xs: 6, md: 6 }}>
                                <Button variant="outlined" onClick={onCancel} fullWidth >
                                    Cancel
                                </Button>
                            </Grid>
                            <Grid size={{ xs: 6, md: 6 }}>
                                <Button variant="contained" onClick={(event) => id ? handleSaveEdit(event, id) : handleSave(event)} fullWidth disabled={!planName || prevPlan === planDays} >
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                )}
            </Grid>

            {loading && <Loading />}
        </Grid>
    )
}