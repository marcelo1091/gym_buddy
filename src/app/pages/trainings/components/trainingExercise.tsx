import { Button, Checkbox, Divider, FormControl, Grid2 as Grid, Typography } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import { ExerciseType } from "../../trainingplans/types";
import { TrainingExerciseType } from "../types";
import { TrainingSeries } from "./trainingSeries";

type TrainingExerciseTypeProps = {
    preview?: boolean
    onAddSerie: (prop: string) => void
    onCheck: (prop: string) => void
    handleChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, seriesId: string) => void
    onRemoveSeries: (prop: string) => void
    trainingPlanExercise: ExerciseType
    currentExercise?: string
    isDone?: boolean
    trainingExercise?: TrainingExerciseType
}

export const TrainingExercise = ({ onAddSerie, onCheck, handleChange, onRemoveSeries, trainingPlanExercise, currentExercise, preview, isDone, trainingExercise }: TrainingExerciseTypeProps) => {
    return (
        <Grid size={{ xs: 12, sm: 8, md: 8, lg: 8 }} display={"flex"} gap={2} alignItems={"center"} justifyContent={"space-between"} key={trainingPlanExercise.id}>
            <FormControl variant="outlined" size="small" fullWidth >
                <Grid container size={12} spacing={2} display={"flex"} alignItems={"center"} >
                    <Grid size={12} display={"flex"} flexDirection={"row"} alignItems={"center"}>
                        <Checkbox onChange={() => onCheck(trainingPlanExercise.id)} checked={isDone} disabled={preview} />
                        <Typography textAlign={"start"} color="textPrimary" variant="h6" component="h6">
                            {trainingPlanExercise.exercise}
                        </Typography>
                    </Grid>
                    {((!isDone && currentExercise === trainingPlanExercise.id) || preview) && trainingExercise?.seriese?.map(series => (
                        <TrainingSeries key={series.id} series={series} handleChange={handleChange} onRemoveSeries={onRemoveSeries} preview={preview} />
                    ))}
                    {((
                        currentExercise === undefined || currentExercise === trainingPlanExercise.id) && !isDone && !preview
                    ) && (
                            <>
                                <Button variant="outlined" onClick={() => onAddSerie(trainingPlanExercise.id)} fullWidth>
                                    <AddIcon /> Add Serie
                                </Button>
                            </>
                        )}
                </Grid>
                <Divider style={{ marginTop: 14 }} />
            </FormControl>
        </Grid>
    )
}