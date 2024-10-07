"use client"

import { Button, Grid2 as Grid, Typography } from "@mui/material"
import { useRouter } from "next/navigation";

export const Trainings = () => {
    const router = useRouter();

    return (
        <Grid container spacing={2} size={12} mt={10} display={"flex"} flexDirection={"column"} alignItems={"center"}>
            <Grid spacing={2} size={{ xs: 11, md: 8 }}>
                <Grid size={12} display={"flex"} justifyContent={"space-between"}>
                    <Typography textAlign={"start"} color="textPrimary" variant="h6" component="h6">
                        Trainings
                    </Typography>
                    <Button variant="contained" color="info" onClick={() => router.push("/pages/trainings/addtraining")}>
                        New Training
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}