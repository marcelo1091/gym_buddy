"use client"

import { addToDb } from "@/app/database/addToDb";
import { Button, Grid2 as Grid, TextField, Typography } from "@mui/material"
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Plan } from "./components/plan";

export const AddPlan = () => {
    const [loading, setLoading] = useState(false)
    const [planName, setPlanName] = useState("")
    const [save, setSave] = useState(false)
    const router = useRouter();
    const auth = getAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "plan_name") setPlanName(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        setSave(true);
    };

    return (
        <Grid container spacing={2} size={12} mt={10} display={"flex"} flexDirection={"column"} alignItems={"center"}>
            <Grid spacing={2} size={{ xs: 11, md: 8 }}>
                <form style={{ display: "flex", justifyContent: "center", width: "100%" }} onSubmit={handleSubmit}>
                    <Grid container spacing={2} size={12} >
                        <Grid container size={12}>
                            <Grid size={{ xs: 12, md: 10 }} display={"flex"} gap={5}>
                                <Typography textAlign={"start"} minWidth={170} color="textPrimary" variant="h6" component="h6">
                                    Add Training Plan
                                </Typography>
                                <TextField
                                    required
                                    id="outlined-required"
                                    type='text'
                                    name='plan_name'
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                    value={planName}
                                    label="Plan Name"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 2 }} display={"flex"} gap={5} justifyContent={"end"}>
                                <Button variant="contained" type="submit" size="small" fullWidth>
                                    Save
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid size={12}>
                            <Plan save={save} setSave={setSave} planName={planName} setLoading={setLoading} />
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    )
}