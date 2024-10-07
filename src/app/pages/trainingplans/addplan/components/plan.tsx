import { useEffect, useState } from "react"
import { PlanDay } from "./planDay"
import { Button, Divider, Grid2 as Grid, Typography } from "@mui/material"
import { ExerciseByDayType, ExerciseType } from "../../types"
import { getAuth } from "firebase/auth"
import { addToDb } from "@/app/database/addToDb"
import { useRouter } from "next/navigation"
import { v4 as uuidv4 } from "uuid";

type PlanType = {
    save: boolean
    setSave: (props: boolean) => void
    planName: string;
    setLoading: (props: boolean) => void
}

export const Plan = ({ save, setSave, planName, setLoading }: PlanType) => {
    const [planDays, setPlanDays] = useState<ExerciseByDayType[]>([{ id: `day_1` }])
    const auth = getAuth();
    const router = useRouter();

    useEffect(() => {
        if (save) {
            if (auth.currentUser) {
                addToDb({ collectionName: "training_plans", id: uuidv4(), data: { id: uuidv4(), user_id: auth.currentUser.uid, plan_name: planName, plan: planDays } })
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

            setSave(false)
        }
    }, [save])

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

    return (
        <Grid container spacing={2} size={12} mt={1} display={"flex"} flexDirection={"column"} alignItems={"center"}>
            <Grid container spacing={2} size={12}>
                {planDays.map((item, i) =>
                    <Grid container spacing={2} size={12} key={i} >
                        <Grid size={12} display={"flex"} justifyContent={"space-between"}>
                            <Typography textAlign={"start"} color="textPrimary" variant="h6" component="h6">
                                Day {i + 1}
                            </Typography>
                            <Button variant="contained" size="small" color="error" onClick={() => removeDay(item.id)}>
                                Remove Day
                            </Button>
                        </Grid>
                        <Grid size={12}>
                            <PlanDay addExercise={(exercises) => addExercise({ exercises, day_id: item.id })} />
                        </Grid>
                        <Grid size={12}>
                            <Divider />
                        </Grid>

                    </Grid>
                )}
                <Button variant="contained" size="small" onClick={addDay} >
                    Add Next Day
                </Button>
            </Grid>
        </Grid>
    )
}