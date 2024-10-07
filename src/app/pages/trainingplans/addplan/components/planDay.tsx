import { Button, Grid2 as Grid, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { ExerciseType } from "../../types"
import DeleteIcon from '@mui/icons-material/Delete';

type PlanDay = {
    addExercise: (exercises: ExerciseType[]) => void
}

export const PlanDay = ({ addExercise }: PlanDay) => {
    const [exercises, setExercises] = useState<ExerciseType[]>([{ id: `ex_1`, exercise: "" }])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: string) => {
        const { value } = e.target;
        const exercise: ExerciseType = { id: id, exercise: value }

        setExercises(item => [...item.filter(ex => ex.id !== id), exercise]);
    };

    const addExercises = () => {
        const exercise: ExerciseType = { id: `ex_${exercises.length + 1}`, exercise: "" }
        setExercises(item => [...item, exercise]);
    }

    const removeExercises = (id: string) => {
        setExercises(item => [...item.filter(ex => ex.id !== id)]);
    }

    useEffect(() => {
        addExercise(exercises)
    }, [exercises])

    return (
        <Grid container spacing={2} size={12} mt={1} display={"flex"} flexDirection={"column"} alignItems={"center"} >
            <Grid container spacing={2} size={12}>
                <Stack
                    spacing={{ xs: 1, sm: 2 }}
                    direction="row"
                    useFlexGap
                    sx={{ flexWrap: 'wrap' }}
                >

                    {exercises.map((item, i) =>
                        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }} display={"flex"} gap={2} alignItems={"center"} justifyContent={"space-between"}>
                            <Typography textAlign={"start"} color="textPrimary" variant="h6" component="h6">
                                {i + 1}.
                            </Typography>
                            <TextField
                                id="outlined-required"
                                type='text'
                                name={`exercise${i + 1}`}
                                onChange={(event) => handleChange(event, item.id)}
                                size="small"
                                fullWidth
                                value={item.exercise ?? ""}
                                label="Exercise"
                            // style={{ maxWidth: 300 }}
                            />
                            <DeleteIcon onClick={() => removeExercises(item.id)} color="error" />
                        </Grid>

                    )}
                </Stack>
                <Button variant="contained" size="small" onClick={addExercises} fullWidth >
                    Add Exercise
                </Button>
            </Grid>
        </Grid>
    )
}