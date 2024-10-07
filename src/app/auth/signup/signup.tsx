"use client"

import {
    createUserWithEmailAndPassword,
    getAuth
} from "firebase/auth";
import { useState } from "react";
import { UserType } from "./../types";
import { Button, Grid2 as Grid, TextField, Typography } from "@mui/material";
import styles from "./../auth.module.css";
import Link from "next/link";
import { firebaseConfig } from "@/app/firebase/clientApp";
import { initializeApp } from "firebase/app";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/Loading/Loading";

export const SignUp = () => {
    const [email, setEmail] = useState("");
    const [firstPassword, setFirstPassword] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, seLoading] = useState(false)

    const router = useRouter();

    initializeApp(firebaseConfig)

    const auth = getAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target;

        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
        if (name === "confirm-password") setFirstPassword(value);
    };

    // Handle user sign up with email and password
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        seLoading(true)

        try {
            // create a new user with email and password
            createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            seLoading(false)
            router.push("/completeprofile");

        } catch (err: any) {
            // Handle errors here
            const errorMessage = (err as Error).message;
            const errorCode = err.code;

            console.log(errorCode)
            setError(true);
            seLoading(false)

            switch (errorMessage) {
                case "Firebase: Password should be at least 6 characters (auth/weak-password).":
                    setErrorMessage("The password is too weak, schould have at least 6 characters");
                    break;
                case "Firebase: Error (auth/email-already-in-use).":
                    setErrorMessage(
                        "This email address is already in use by another account."
                    );
                    break;
                case "Firebase: Error (auth/invalid-email).":
                    setErrorMessage("This email address is invalid.");
                    break;
                case "Firebase: Error (auth/operation-not-allowed)":
                    setErrorMessage("Email/password accounts are not enabled.");
                    break;
                default:
                    setErrorMessage(errorMessage);
                    break;
            }
        }
    };

    return (
        <Grid container spacing={0} className={styles.signinContainer}>
            <Grid size={{ md: 8 }} display={{ xs: "none", md: "block" }}>
                <div className={styles.imageGrid}>image</div>
            </Grid>
            <Grid container size={{ xs: 12, md: 4 }} className={styles.signinLoginContainer}>
                <Grid container size={12} margin={5} spacing={2} marginY={"50%"} flexDirection={"column"} justifyContent={"center"}>
                    <Typography textAlign={"center"} color="textPrimary" variant="h4" component="h3">
                        Sign Up
                    </Typography>
                    <form style={{ display: "flex", justifyContent: "center", width: "100%" }} className='signinContainer__box__form' onSubmit={handleSubmit}>
                        <Grid container spacing={2} size={12} flexDirection={"column"} justifyContent={"center"}>
                            <Grid container justifyContent={"center"}>
                                <TextField
                                    id="outlined-required"
                                    label="E-mail"
                                    type='email'
                                    placeholder='Email'
                                    name='email'
                                    onChange={handleChange}
                                    size="small"
                                    fullWidth
                                />
                            </Grid>
                            <Grid container justifyContent={"center"} >
                                <TextField
                                    id="outlined-required"
                                    label="Password"
                                    size="small"
                                    type='password'
                                    placeholder='Password'
                                    name='password'
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid container justifyContent={"center"} >
                                <TextField
                                    id="outlined-required"
                                    label="Confirm password"
                                    size="small"
                                    type='password'
                                    placeholder='Password'
                                    name='confirm-password'
                                    onChange={handleChange}
                                    fullWidth
                                />
                            </Grid>
                            <Grid container justifyContent={"center"} >
                                <Button disabled={password !== firstPassword || !password || !email} variant="contained" type='submit' fullWidth>Sign Up</Button>
                            </Grid>

                            <Grid container justifyContent={"center"}>
                                {error && <p>{errorMessage}</p>}
                            </Grid>
                        </Grid>
                    </form>
                    <Grid container justifyContent={"center"} spacing={1}>
                        <Typography textAlign={"center"} color="textPrimary" variant="body2" component="p">
                            Do you already have an account?
                        </Typography>
                        <Button variant="outlined" onClick={() => router.push("/auth/signin")} fullWidth>
                            Sign In
                        </Button>
                    </Grid>
                </Grid >
            </Grid >
            {loading && <Loading />}
        </Grid >

    );
};
