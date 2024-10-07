"use client"

import { useEffect, useState } from "react";
import {
    signInWithEmailAndPassword,
    getAuth,
} from "firebase/auth";
import { useRouter } from "next/navigation";
import React from "react";
import { Button, Grid2 as Grid, Link as MUILink, TextField, Typography } from "@mui/material";
import styles from "./../auth.module.css";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/app/firebase/clientApp";
import { Loading } from "@/components/Loading/Loading";

export const SignIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false)

    initializeApp(firebaseConfig)

    const router = useRouter();

    // Instantiate the auth service SDK
    const auth = getAuth();

    useEffect(() => {
        if (auth.currentUser) {
            router.push("/");
        }
    }, [auth])


    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "email") setEmail(value);
        if (name === "password") setPassword(value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        // Sign in with email and password in firebase auth service
        signInWithEmailAndPassword(
            auth,
            email,
            password
        ).then(item => {
            const data = item.user;
            setLoading(false)
            router.push("/");
        }).catch((err: any) => {
            // Handle Errors here.
            const errorMessage = (err as Error).message;
            const errorCode = err.code;

            setError(true);
            setLoading(false)

            switch (errorCode) {
                case "auth/invalid-email":
                    setErrorMessage("This email address is invalid.");
                    break;
                case "auth/user-disabled":
                    setErrorMessage(
                        "This email address is disabled by the administrator."
                    );
                    break;
                case "auth/user-not-found":
                    setErrorMessage("This email address is not registered.");
                    break;
                case "auth/invalid-credential":
                    setErrorMessage("The password is invalid or the user does not have a password.")
                    break;
                default:
                    setErrorMessage(errorMessage);
                    break;
            }
        });

    };

    return (
        <Grid container spacing={0} className={styles.signinContainer}>
            <Grid size={{ md: 8 }} display={{ xs: "none", md: "block" }}>
                <div className={styles.imageGrid}>image</div>
            </Grid>
            <Grid container size={{ xs: 12, md: 4 }} className={styles.signinLoginContainer}>
                <Grid container size={12} margin={5} spacing={2} marginY={"50%"} flexDirection={"column"} justifyContent={"center"}>
                    <Typography textAlign={"center"} color="textPrimary" variant="h4" component="h3">
                        Sign In
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
                                <Button disabled={!email || !password} variant="contained" type='submit' fullWidth>Sign In</Button>
                            </Grid>
                            <Grid container justifyContent={"center"}>
                                {error && <p>{errorMessage}</p>}
                            </Grid>
                        </Grid>
                    </form>
                    <Grid container justifyContent={"center"} spacing={1}>
                        <Typography textAlign={"center"} color="textPrimary" variant="body2" component="p">
                            Forgot password? <MUILink href="/auth/resetpassword">Reset Password</MUILink>
                        </Typography>
                    </Grid>
                    <Grid container justifyContent={"center"} spacing={1}>
                        <Typography textAlign={"center"} color="textPrimary" variant="body2" component="p">
                            Don't have an account yet? create a new one.
                        </Typography>
                        <Button variant="outlined" onClick={() => router.push("/auth/signup")} fullWidth>
                            Sign Up
                        </Button>
                    </Grid>
                </Grid >
            </Grid >
            {loading && <Loading />}
        </Grid >
    );
};
