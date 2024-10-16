import { Grid2 as Grid, IconButton, TextField, Typography } from "@mui/material"
import { SerieseType } from "../types";
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';

type TrainingSeriesType = {
    preview?: boolean
    handleChange: (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>, seriesId: string) => void
    series: SerieseType
    onRemoveSeries: (prop: string) => void
}

export const TrainingSeries = ({ handleChange, series, onRemoveSeries, preview }: TrainingSeriesType) => {
    return (
        <Grid container key={series.id} size={{ xs: 12, sm: 12, md: 6, lg: 4 }} spacing={0} display={"flex"} justifyContent={"space-between"} alignItems={"center"} gap={1}>
            <Grid size={4}>
                <TextField
                    id="outlined-required"
                    type='text'
                    name={`load_${series.id}`}
                    onChange={(event) => handleChange(event, series.id)}
                    size="small"
                    value={`${series.series.load}`}
                    label="Load"
                    placeholder="5kg"
                    disabled={preview}
                />
            </Grid>
            <Typography textAlign={"start"} color="textPrimary" variant="h6" component="h6">
                <Grid size={1}>
                    <CloseIcon />
                </Grid>
            </Typography>
            <Grid size={4}>
                <TextField
                    id="outlined-required"
                    type='text'
                    name={`iterations_${series.id}`}
                    onChange={(event) => handleChange(event, series.id)}
                    size="small"
                    value={series.series.iterations}
                    label="Iterations"
                    placeholder="10"
                    disabled={preview}
                />
            </Grid>
            {!preview && (
                <Grid size={1}>
                    <IconButton onClick={() => onRemoveSeries(series.id)}>
                        <DeleteIcon color="error" />
                    </IconButton>

                </Grid>
            )}
        </Grid>
    )
}