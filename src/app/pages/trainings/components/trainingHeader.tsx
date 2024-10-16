"use client"

import { FormControl, Grid2 as Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from "dayjs";
import { ExercisePlansType } from "../../trainingplans/types";
import { Dispatch, SetStateAction } from "react";

type TrainingHeaderType = {
    preview?: boolean
    id?: string
    trainingPlan?: ExercisePlansType
    trainingDate?: string
    trainingDayId?: string
    setDayId: Dispatch<SetStateAction<string | undefined>>
    setTrainingDate: Dispatch<SetStateAction<string | undefined>>
}

export const TrainingHeader = ({ trainingPlan, id, preview, setTrainingDate, setDayId, trainingDate, trainingDayId }: TrainingHeaderType) => {
    return (
        <Grid container spacing={2} size={{ xs: 12, sm: 12, md: 8, lg: 8 }} display={"flex"} flexDirection={"row"} alignItems={"center"} >
            <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }} display={"flex"} justifyContent={"space-between"} flexDirection={"row"} alignItems={"center"} gap={2}>
                <Typography textAlign={"start"} color="textPrimary" variant="h6" component="h6" minWidth={150}>
                    Training date
                </Typography>
                {preview ?
                    <DatePicker label="Select training date" value={dayjs(trainingDate)} onChange={(date) => setTrainingDate(date?.toString())} disabled={preview} />
                    :
                    <DatePicker label="Select training date" onChange={(date) => setTrainingDate(date?.toString())} disabled={preview} />
                }

            </Grid>
            {(trainingDate || preview) && (
                <Grid size={{ xs: 12, sm: 12, md: 6, lg: 6 }} display={"flex"} justifyContent={"space-between"} flexDirection={"row"} alignItems={"center"} gap={2}>
                    <Typography textAlign={"start"} color="textPrimary" variant="h6" component="h6" minWidth={150}>
                        Select day
                    </Typography>
                    <FormControl fullWidth disabled={id !== undefined || preview} required>
                        <InputLabel id="training_day">Day</InputLabel>
                        <Select
                            labelId="training_day"
                            value={trainingDayId ?? ''}
                            label="Day"
                            onChange={event => setDayId(event.target.value as string)}
                        >
                            {trainingPlan?.plan.sort(function (a, b) {
                                return - (b.id.localeCompare(a.id));
                            }).map(ex => (

                                <MenuItem key={ex.id} value={ex.id}>{`Day ${ex.id.slice(4, 100)}`}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
            )}
        </Grid>
    )
}