"use client"

import { useState } from "react";
import {
    getAuth,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import React from "react";
import { Button, Grid2 as Grid, Link as MUILink, TextField, Typography } from "@mui/material";
// import styles from "./../auth.module.css";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/app/firebase/clientApp";
import { Loading } from "@/components/Loading/Loading";
import { Label } from "@mui/icons-material";
import { addToDb } from "../database/addToDb";
import { v4 as uuidv4 } from "uuid";

export const CompleteProfile = () => {
    const [name, setName] = useState("")
    const [city, setCity] = useState("")
    const [gym, setGym] = useState("")
    const [loading, setLoading] = useState(false)

    initializeApp(firebaseConfig)

    const router = useRouter();

    // Instantiate the auth service SDK
    const auth = getAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "name") setName(value);
        if (name === "city") setCity(value);
        if (name === "gym") setGym(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)

        if (auth.currentUser) {
            addToDb({
                collectionName: "profiles", id: auth.currentUser.uid, data: {
                    id: uuidv4(),
                    name: name,
                    city: city,
                    gym: gym
                }
            })
                .then(() => {
                    console.log("success")
                    router.push("/pages/dashboard")
                })
                .catch((err: any) => console.log(err.message))
        }
    };

    return (
        <Grid container size={12} mt={20} width={"100%"} display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <form style={{ display: "flex", justifyContent: "center", width: "100%" }} className='signinContainer__box__form' onSubmit={handleSubmit}>
                <Grid container spacing={2} size={12} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                    <Typography textAlign={"center"} color="textPrimary" variant="h6" component="h6">
                        Complete Profile
                    </Typography>
                    <Grid container justifyContent={"center"} width={300}>
                        <TextField
                            id="outlined-required"
                            type='text'
                            name='name'
                            onChange={handleChange}
                            size="small"
                            fullWidth
                            value={name}
                            label="Firstname"
                            required
                        />
                    </Grid>
                    <Grid container justifyContent={"center"} width={300}>
                        <TextField
                            id="outlined-required"
                            size="small"
                            type='text'
                            name='city'
                            onChange={handleChange}
                            fullWidth
                            value={city}
                            label="Your City"
                            required
                        />
                    </Grid>
                    <Grid container justifyContent={"center"} width={300}>
                        <TextField
                            id="outlined-required"
                            size="small"
                            type='text'
                            name='gym'
                            onChange={handleChange}
                            fullWidth
                            value={gym}
                            label="Your Gym"
                            required
                        />
                    </Grid>
                    <Grid container justifyContent={"center"} width={300}>
                        <Button disabled={!name || !city || !gym} variant="contained" type='submit' fullWidth>Save Profile</Button>
                    </Grid>
                </Grid>
            </form>
            {loading && <Loading />}
        </Grid>
    );
};
