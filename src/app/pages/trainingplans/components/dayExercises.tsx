import { Button, FormControl, Grid2 as Grid, InputAdornment, InputLabel, OutlinedInput, Stack, TextField, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { ExerciseType } from "../types";

type DayExercisesType = {
    addExercise: (exercises: ExerciseType[]) => void
    preview?: boolean
    prevExercises?: ExerciseType[]
}

export const DayExercises = ({ addExercise, preview, prevExercises }: DayExercisesType) => {
    const [exercises, setExercises] = useState<ExerciseType[]>([{ id: `ex_1`, exercise: "" }])

    useEffect(() => {
        preview && prevExercises && setExercises(prevExercises)
    }, [prevExercises])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, id: string) => {
        const { value } = e.target;
        const exercise: ExerciseType = { id: id, exercise: value }

        setExercises(item => [...item.map(ex => ex.id === id ? exercise : ex)]);
    };

    const addExercises = () => {
        const exercise: ExerciseType = { id: `ex_${exercises.length + 1}`, exercise: "" }
        setExercises(item => [...item, exercise]);
    }

    const removeExercises = (id: string) => {
        setExercises(item => [...item.filter(ex => ex.id !== id)]);
    }

    useEffect(() => {
        !preview && addExercise(exercises)
    }, [exercises])

    return (
        <Grid container spacing={2} size={12} mt={1} display={"flex"} flexDirection={"column"} alignItems={"center"} >
            <Grid container spacing={2} size={12}>
                <Stack
                    spacing={{ xs: 1, sm: 2 }}
                    direction="row"
                    useFlexGap
                    sx={{ flexWrap: 'wrap' }}
                    width={"100%"}
                >
                    {exercises.map((item, i) =>
                        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }} display={"flex"} gap={2} alignItems={"center"} justifyContent={"space-between"}>
                            <FormControl variant="outlined" size="small" fullWidth >
                                <InputLabel htmlFor="outlined-adornment-password">{`Exercise ${i + 1}`}</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={'text'}
                                    endAdornment={
                                        !preview && (
                                            <InputAdornment position="end">
                                                {exercises.length > 1 ?
                                                    <DeleteIcon onClick={() => removeExercises(item.id)} color="error" style={{ cursor: "pointer" }} /> :
                                                    <DeleteIcon color="disabled" />
                                                }
                                            </InputAdornment>
                                        )
                                    }
                                    label={`Exercise ${i + 1}`}
                                    onChange={(event) => handleChange(event, item.id)}
                                    name={`exercise${i + 1}`}
                                    fullWidth
                                    value={item.exercise}
                                    required
                                    disabled={preview}
                                />
                            </FormControl>
                        </Grid>

                    )}
                    {!preview && (
                        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }} display={"flex"} gap={2} alignItems={"center"} justifyContent={"space-between"}>
                            <Button variant="outlined" onClick={addExercises} style={{ height: 40 }} fullWidth startIcon={<AddIcon />}>
                                Add Exercise
                            </Button>
                        </Grid>
                    )}
                </Stack>


            </Grid>
        </Grid>
    )
}