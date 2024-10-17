import { Button, Checkbox, Divider, FormControl, Grid2 as Grid, IconButton, TextField, Typography } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { TrainingExerciseType } from "../types";
import { TrainingSeries } from "./trainingSeries";

type TrainingExerciseTypeProps = {
    preview?: boolean
    onAddSerie: (prop: string) => void
    onCheck: (prop: string) => void
    handleChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, seriesId: string) => void
    onRemoveSeries: (prop: string) => void
    currentExercise?: string
    isDone?: boolean
    trainingExercise: TrainingExerciseType
    onRemoveExercise: (prop: string) => void
}

export const TrainingExercise = ({ onAddSerie, onCheck, handleChange, onRemoveSeries, currentExercise, preview, isDone, trainingExercise, onRemoveExercise }: TrainingExerciseTypeProps) => {
    return (
        <Grid size={{ xs: 12, sm: 8, md: 8, lg: 8 }} display={"flex"} gap={2} alignItems={"center"} justifyContent={"space-between"}>
            <FormControl variant="outlined" size="small" fullWidth >
                <Grid container size={12} spacing={2} display={"flex"} alignItems={"center"} >
                    <Grid size={12} display={"flex"} flexDirection={"row"} alignItems={"center"}>
                        <Checkbox onChange={() => onCheck(trainingExercise?.ex_id)} checked={isDone} disabled={preview} />
                        {preview || currentExercise !== trainingExercise?.ex_id ?
                            <Typography textAlign={"start"} color="textPrimary" variant="h6" component="h6">
                                {trainingExercise?.ex_name}
                            </Typography>
                            : (
                                <>
                                    <TextField
                                        id="outlined-required"
                                        type='text'
                                        name={`exercise_${trainingExercise?.ex_id}`}
                                        onChange={(event) => handleChange(event, trainingExercise?.ex_id)}
                                        size="small"
                                        value={trainingExercise?.ex_name}
                                        label="Exercise"
                                        placeholder="10"
                                        disabled={preview}
                                    />
                                    <IconButton edge="end" aria-label="delete" onClick={() => onRemoveExercise(trainingExercise.ex_id)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </>
                            )}
                    </Grid>
                    {((!isDone && currentExercise === trainingExercise?.ex_id) || preview) && trainingExercise?.seriese?.map(series => (
                        <TrainingSeries key={series.id} series={series} handleChange={handleChange} onRemoveSeries={onRemoveSeries} preview={preview} />
                    ))}
                    {((
                        currentExercise === undefined || trainingExercise?.ex_id) && !isDone && !preview
                    ) && (
                            <>
                                <Button variant="outlined" onClick={() => onAddSerie(trainingExercise?.ex_id)} fullWidth>
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