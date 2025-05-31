"use client"

import React from "react";
import { getFromDb } from "@/app/database/getFromDb";
import { Button, Grid2 as Grid, Typography } from "@mui/material"
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ExercisePlansType } from "./types";
import { PlansList } from "./components/plansList";
import { Loading } from "@/components/Loading/Loading";
import { updateDb } from "@/app/database/updateDb";
import { point } from "leaflet";

type PositionSpecyficType = {
    log: number,
    lat: number
}

type PositionType = {
    lon: number,
    lat: number
    time: number,
    numberOfValidPoints: number
}

export const TrainingPlans = ({ callRefresh }: { callRefresh?: () => void }) => {
    // const [lon, setLon] = useState<number | null>()
    // const [lat, setLat] = useState<number | null>()
    const [timeBetweenGetWaypoint, setTimeBetweenGetWaypoint] = useState(1000)
    const [pointsToAnalize, setPointsToAnalize] = useState(10)
    const [tolerancja, setTolerancja] = useState(10)
    const [recordRoute, setRecordRoute] = useState(false)
    const [plans, setPlans] = useState<{ data: ExercisePlansType, id: string }[]>()
    const [position, setPosition] = useState<PositionType[]>([])
    const [tempPosition, setTempPosition] = useState<PositionSpecyficType[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter();
    const auth = getAuth()


    // setInterval(() => navigator.geolocation.getCurrentPosition(getPosition), 10000)

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (recordRoute) {
            timer = setTimeout(() => navigator.geolocation.getCurrentPosition(getPosition), 2000);

        }

        const getPosition = (pos: GeolocationPosition) => {
            const log = pos.coords.longitude
            const lat = pos.coords.latitude

            setTempPosition(pos => [...[...new Set(pos)], { log, lat }])

            clearTimeout(timer);
            timer = setTimeout(() => {
                if (!recordRoute) return;
                navigator.geolocation.getCurrentPosition(getPosition)
            }, timeBetweenGetWaypoint);

            // setTimeout(() => navigator.geolocation.getCurrentPosition(getPosition), 10000);
            // console.log(position);
            // console.log(lon, lat);

        }

        return () => clearTimeout(timer)

    }, [recordRoute]);

    useEffect(() => {
        console.log(tempPosition);
        if (tempPosition.length >= pointsToAnalize) {
            const { latRef, lngRef } = calculateGeoReferencePoint(tempPosition);

            let validPoints: PositionSpecyficType[] = tempPosition

            // tempPosition.forEach((point) => {
            //     const isOk = isWithinDistanceTolerance(
            //         point.lat,
            //         point.log,
            //         latRef,
            //         lngRef,
            //         tolerancja // tolerancja w metrach
            //     );

            //     if (isOk) {
            //         validPoints.push(point)
            //     }
            //     // console.log(isOk ? "✅ Punkt jest w promieniu 100m" : "❌ Punkt poza zakresem");
            // })

            let logSum = 0;
            let latSum = 0;

            validPoints.forEach(point => {
                logSum += point.log;
                latSum += point.lat;
            }
            )

            // const logCenter = logSum / validPoints.length
            // const latCenter = latSum / validPoints.length
            // console.log('valid points length:', validPoints.length);
            // console.log(logCenter, latCenter);

            const center = findCenter(validPoints)

            if (validPoints.length > 0) {
                setPosition(points => [...points, { lat: center.lat, lon: center.log, time: Date.now(), numberOfValidPoints: validPoints.length }])
                callRefresh && callRefresh()
                // validPoints = []
                setTempPosition([])
            }
        }
    }, [tempPosition])

    function findCenter(points: PositionSpecyficType[]) {
        const total = points.reduce(
            (acc, point) => {
                acc.x += point.lat;
                acc.y += point.log;
                return acc;
            },
            { x: 0, y: 0 }
        );

        const count = points.length;
        return {
            lat: total.x / count,
            log: total.y / count
        };
    }


    useEffect(() => {

        if (auth.currentUser && position.length > 1) {
            updateDb({
                collectionName: "position", id: "OGnjV3CFHirEjkxkaRsh", data: {
                    position: position
                },
                notificationText: "Position Saved"
            })
                .then(() => {
                    setLoading(false)
                })
                .catch((err: any) => {
                    setLoading(false)
                    console.log(err.message)
                })
        }
    }, [position])




    useEffect(() => {
        if (auth.currentUser?.uid) {
            getFromDb({ collectionName: "training_plans", fieldId: "user_id", comparisonType: "==", fildValue: auth.currentUser?.uid })
                .then(data => setPlans(data.data.map(d => ({ data: d.data as ExercisePlansType, id: d.id }))))
                .catch((err: any) => console.error(err.message))
            // getFromDb({ collectionName: "position" })
            //     .then(data => setPosition(data.data.map(d => d.data as PositionType)))
            //     .catch((err: any) => console.error(err.message))
        }
    }, [])



    function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number) {
        const R = 6371000; // promień Ziemi w metrach
        const toRad = (angle: number) => (angle * Math.PI) / 180;

        const dLat = toRad(lat2 - lat1);
        const dLng = toRad(lng2 - lng1);

        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLng / 2) ** 2;

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    function isWithinDistanceTolerance(lat: number, lng: number, latRef: number, lngRef: number, toleranceMeters = 1) {
        const distance = haversineDistance(lat, lng, latRef, lngRef);
        console.log(distance);
        return distance <= toleranceMeters;
    }

    function calculateGeoReferencePoint(points: PositionSpecyficType[]) {
        const total = points.reduce(
            (acc, point) => {
                acc.lat += point.lat;
                acc.lng += point.log;
                return acc;
            },
            { lat: 0, lng: 0 }
        );

        const count = points.length;
        return {
            latRef: total.lat / count,
            lngRef: total.lng / count
        };
    }

    return (
        <Grid container spacing={2} size={12} mt={10} display={"flex"} flexDirection={"column"} alignItems={"center"}>
            <h6>czas między pobraniem lokalizacji</h6>
            <input type="text" value={timeBetweenGetWaypoint} onChange={(event) => setTimeBetweenGetWaypoint(Number(event.target.value))} />
            <h6>ilość punktów do analizy</h6>
            <input type="text" value={pointsToAnalize} onChange={(event) => setPointsToAnalize(Number(event.target.value))} />
            <h6>tolerancja</h6>
            <input type="text" value={tolerancja} onChange={(event) => setTolerancja(Number(event.target.value))} />
            <Button variant="contained" onClick={() => setTempPosition([])}>
                Clear temp points
            </Button>
            <Button variant="contained" onClick={() => setPosition([])}>
                Clear positions
            </Button>
            <Button variant="contained" onClick={() => setRecordRoute(state => !state)}>
                {recordRoute ? "Stop" : "Start"}
            </Button>
            <br />
            <br /><br /><br />
            {[...new Set(position)].map(pos => (
                <>
                    <p>Lon: {pos.lon}</p>
                    <p>Lat: {pos.lat}</p>
                    <p>Time: {new Date(pos.time).toLocaleTimeString()}</p>
                    <hr />
                    <br />
                </>
            ))}
            {/* <Grid spacing={2} size={{ xs: 11, md: 8 }}>
                <Grid size={12} display={"flex"} justifyContent={"space-between"}>
                    <Typography textAlign={"start"} color="textPrimary" variant="h6" component="h6">
                        Training Plans
                    </Typography>
                    <Button variant="contained" onClick={() => { setLoading(true); router.push("/pages/trainingplans/addplan") }}>
                        Add New
                    </Button>
                </Grid>
                <Grid size={12}>
                    {!plans || plans.length === 0 ?
                        (
                            <Typography textAlign={"start"} color="textPrimary" variant="h6" component="h6">
                                You don't have a plan yet, add a new plan.
                            </Typography>
                        )
                        :
                        (
                            <PlansList plans={plans.map(plan => ({ id: plan.id, planName: plan.data.plan_name, active: plan.data.active }))} />
                        )
                    }

                </Grid>
            </Grid> */}
            {loading && <Loading />}
        </Grid>
    )
}