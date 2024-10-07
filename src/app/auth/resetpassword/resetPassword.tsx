"use client"

import {
    getAuth,
    sendPasswordResetEmail
} from "firebase/auth";
import { useState } from "react";
import { Button, Grid2 as Grid, TextField, Typography } from "@mui/material";
import styles from "./../auth.module.css";
import Link from "next/link";
import { firebaseConfig } from "@/app/firebase/clientApp";
import { initializeApp } from "firebase/app";
import { Loading } from "@/components/Loading/Loading";

export const ResetPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, seLoading] = useState(false)
    const [isEmailSend, setIsEmailSend] = useState(false)

    initializeApp(firebaseConfig)

    const auth = getAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target;

        if (name === "email") setEmail(value);
    };

    // Handle user reset password with email
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        seLoading(true)
        console.log(email)
        sendPasswordResetEmail(auth, email)
            .then(() => {
                console.log("email send")
                setIsEmailSend(true);
                seLoading(false)
            })
            .catch((error) => {
                // const errorCode = error.code;
                const errorMessage = error.message;
                console.error(errorMessage)
                seLoading(false)
            });
    };
    if (isEmailSend) {
        return (
            <div style={{ width: "100%", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center" }}>
                <p>Email with password reset link was sent to emai {email} check your mail</p>
            </div>
        )
    }

    return (
        <Grid container spacing={0} className={styles.signinContainer}>
            <Grid size={{ md: 8 }} display={{ xs: "none", md: "block" }}>
                <div className={styles.imageGrid}>image</div>
            </Grid>
            <Grid container size={{ xs: 12, md: 4 }} className={styles.signinLoginContainer}>
                <Grid container size={12} margin={5} spacing={2} marginY={"50%"} flexDirection={"column"} justifyContent={"center"}>
                    <Typography textAlign={"center"} color="textPrimary" variant="h4" component="h3">
                        Reset Password
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
                                <Button disabled={!email} variant="contained" type='submit' fullWidth>Send email to reset</Button>
                            </Grid>

                            {/* <Grid container justifyContent={"center"}>
                                {error && <p>{errorMessage}</p>}
                            </Grid> */}
                        </Grid>
                    </form>
                    <Grid container justifyContent={"center"} spacing={1}>
                        <Button variant="outlined" fullWidth>
                            <Link style={{ width: "100%" }} href="/auth/signin">
                                Back to sign in
                            </Link>
                        </Button>
                    </Grid>
                </Grid >
            </Grid >
            {loading && <Loading />}

        </Grid >

    );
};
