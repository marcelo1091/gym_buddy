"use client"

import {
    confirmPasswordReset,
    getAuth,
    verifyPasswordResetCode,
} from "firebase/auth";
import { useState } from "react";
import { Button, Grid2 as Grid, TextField, Typography } from "@mui/material";
import styles from "./../auth.module.css";
import { firebaseConfig } from "@/app/firebase/clientApp";
import { initializeApp } from "firebase/app";
import { Loading } from "@/components/Loading/Loading";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export const SetNewPassword = () => {
    const [firstPassword, setFirstPassword] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false)

    const router = useRouter();
    const params = useParams<{ oobCode: string }>()
    // const searchParams = useSearchParams()
    // let code: string | null = searchParams.get('oobCode')

    initializeApp(firebaseConfig)

    const auth = getAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const { name, value } = e.target;

        if (name === "password") setFirstPassword(value);
        if (name === "confirm-password") setPassword(value);
    };

    if (params.oobCode) {
        verifyPasswordResetCode(auth, params.oobCode).then(data =>
            console.log(data)
        ).catch(error => {
            console.error(error.message)
            router.push("/auth/signin");
        })
    }

    // Handle user reset password with email
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)

        if (params.oobCode) {
            confirmPasswordReset(auth, params.oobCode, password).then(data => {
                console.log("password changed")
                setLoading(false)
                router.push("/auth/signin");
            }).catch(error => {
                if (error.code === 'auth/invalid-action-code') {
                    alert('Something is wrong; try again later.')
                }
                console.log(error.message)
                setLoading(false)
                return <>Wrong Code</>
            })
        } else {
            console.error('missing code')
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
                        Set New Password
                    </Typography>
                    <form style={{ display: "flex", justifyContent: "center", width: "100%" }} className='signinContainer__box__form' onSubmit={handleSubmit}>
                        <Grid container spacing={2} size={12} flexDirection={"column"} justifyContent={"center"}>
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
                                <Button disabled={password !== firstPassword || !password} variant="contained" type='submit' fullWidth>Set new password</Button>
                            </Grid>

                            {/* <Grid container justifyContent={"center"}>
                                {error && <p>{errorMessage}</p>}
                            </Grid> */}
                        </Grid>
                    </form>
                </Grid >
            </Grid >
            {loading && <Loading />}

        </Grid >

    );
};
