"use client"

import { Chip, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, Typography } from "@mui/material"
import { useRouter } from "next/navigation";
import DeleteIcon from '@mui/icons-material/Delete';
import { removeFromDb } from "@/app/database/removeFromDb";
import { Loading } from "@/components/Loading/Loading";
import { getAuth } from "firebase/auth";
import { TrainingType } from "../types";
import { useState } from "react";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat"
import { ExercisePlansType } from "../../trainingplans/types";

export const TrainingsList = ({ trainings, trainingPlans }: { trainings?: TrainingType[], trainingPlans?: ExercisePlansType[] }) => {
    const [removedIds, setRemovedIds] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const auth = getAuth();

    const removeTraining = (id: string, event: React.MouseEvent) => {
        event.preventDefault()
        setLoading(true)

        removeFromDb({ collectionName: "trainings", id, notificationText: "Success removed trainin" })
            .then(() => {
                setLoading(false); setRemovedIds(ids => [...ids, id])
            })
            .catch((err: any) => {
                setLoading(false); console.error(err.message)
            })
    }

    const getDate = (date: string): string => {
        dayjs.extend(localizedFormat)
        return dayjs(date).format('LL')
    }

    const checkTrainingIsDone = (training: TrainingType) => {
        if (training.exercises.find(exercise => !exercise.done)) {
            return <Chip size="small" label="No Done" color="error" variant="outlined" />
        } else {
            return <Chip size="small" label="Done" color="success" variant="outlined" />
        }
    }

    if (!trainings || trainings.length === 0) {
        return (
            <Typography textAlign={"start"} color="textPrimary" variant="body1" component="span">
                You don't have a trainings yet, add a new training.
            </Typography>
        )
    }

    return (
        <>
            <List>
                {trainings.map(training => (
                    !removedIds.includes(training.id) && (
                        <div key={training.id}>
                            <ListItem disablePadding style={{ minHeight: 48 }} secondaryAction={
                                <>
                                    <IconButton edge="end" aria-label="delete" onClick={(event) => removeTraining(training.id, event)}>
                                        <DeleteIcon color="error" />
                                    </IconButton>
                                </>
                            }>
                                <ListItemButton
                                    onClick={() => router.push(`/pages/trainings/training?id=${training.id}`)}
                                    style={{ display: "flex", flexDirection: "column", alignItems: "start" }} >
                                    <ListItemText primary={`${getDate(training.date)} | Plan ${trainingPlans?.find(plan => plan.id === training.plan_id)?.plan_name} | ${training.day_name}`} />
                                    {checkTrainingIsDone(training)}
                                </ListItemButton>

                            </ListItem>
                            <Divider />
                        </div>
                    )
                ))}
            </List>
            {loading && <Loading />}
        </>
    )
}