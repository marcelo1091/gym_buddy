"use client"

import { getFromDb } from "@/app/database/getFromDb"
import { getAuth } from "firebase/auth"
import { useEffect, useState } from "react"
import { ExerciseByDayType, ExercisePlansType } from "../types"
import { Box, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import { Grid2 as Grid } from "@mui/material"
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export const Plan = () => {
    const [id, setId] = useState("")
    const [plan, setPlan] = useState<ExercisePlansType>()
    const auth = getAuth()

    useEffect(() => {
        const paramId = window.location.search.split("?id=").pop()
        paramId && setId(paramId)
    }, [])

    useEffect(() => {
        if (auth.currentUser?.uid) {
            getFromDb({ collectionName: "training_plans", fieldId: "id", comparisonType: "==", fildValue: id })
                .then(data => data && setPlan(data?.data[0]?.data as ExercisePlansType))
                .catch((err: any) => console.error(err.message))
        }
    }, [id])
    console.log(plan)
    console.log(id)

    return (
        <Grid container spacing={2} size={12} mt={10} display={"flex"} flexDirection={"column"} alignItems={"center"}>
            <Typography variant="h6" gutterBottom component="div">
                {plan?.plan_name}
            </Typography>
            <TableContainer>
                <Table aria-label="collapsible table">
                    <TableHead style={{ backgroundColor: "lightgray" }}>
                        <TableRow >
                            <TableCell width={10} />
                            <TableCell align="left">
                                <Typography variant="h6" gutterBottom component="div">
                                    Days
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {plan && plan.plan.map((planDay, i) => (
                            <Row key={planDay.id} row={planDay} day={`Day ${i + 1}`} />

                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    )
}

function Row({ row, day }: { row: ExerciseByDayType, day: string }) {

    const [open, setOpen] = useState(false);
    console.log(row)
    return (
        <>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                <TableCell align="left">{day}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                {day}
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead style={{ backgroundColor: "lightgray" }}>
                                    <TableRow>
                                        <TableCell>Exercises</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row?.exercises && row?.exercises?.length > 0 && row.exercises.map((exercise) => (
                                        <TableRow key={exercise.id}>
                                            <TableCell align="left">{exercise.exercise}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
}