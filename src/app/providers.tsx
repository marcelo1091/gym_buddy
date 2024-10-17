"use client"

import { Header } from "@/components/Header/Header";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { getAuth, User } from "firebase/auth";
import { firebaseConfig } from "./firebase/clientApp";
import { initializeApp } from "firebase/app";
import { createTheme, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ToastContainer } from "react-toastify";

export const Providers = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>()
    const router = useRouter();
    const pathname = usePathname()
    const auth = getAuth();

    initializeApp(firebaseConfig)

    const excludePaths = !pathname.includes("resetpassword") &&
        !pathname.includes("setnewpassword") &&
        !pathname.includes("signup") &&
        !pathname.includes("signin") &&
        !pathname.includes("completeprofile")

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (user) {
                setUser(user)
            } else {
                setUser(undefined)
                if (excludePaths)
                    router.push("/auth/signin");
            }
        })
    }, [auth])

    const theme = createTheme({
        palette: {
            primary: { main: "#6b75ff", },
            error: { main: "#ff5858", }
        }

    });

    if (user && pathname.includes("completeprofile")) {
        return (<ThemeProvider theme={theme}><div style={{ marginTop: "8px" }}>{children}</ div></ThemeProvider>)
    }

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                {user ? (<><Header /><div style={{ marginTop: "8px" }}>{children}</div></>) : excludePaths ? <></> : children}
            </LocalizationProvider>
            <ToastContainer position="bottom-right" />
            <p style={{ position: "fixed", right: 10, bottom: 10 }}>Version: 0.1</p>
        </ThemeProvider>
    )
}