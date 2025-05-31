"use client"

// import L from "leaflet";
// import "leaflet-routing-machine";
import RoutineMachine from "./RoutingMachine";
import { MapContainer, TileLayer } from 'react-leaflet'
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { getFromDb } from "@/app/database/getFromDb";
import { TrainingPlans } from "../trainingplans/trainingPlans";

const Dashboard = () => {

    const [seed, setSeed] = useState(1);
    const [waypoints, setWaypoints] = useState()
    const auth = getAuth()
    const reset = () => {
        setSeed(Math.random());
    }

    useEffect(() => {

        const interval = setInterval(() => getWaypoints(), 60000)

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {

        getWaypoints()
    }, []);

    const getWaypoints = () => {
        if (auth.currentUser?.uid) {
            setTimeout(() => getFromDb({ collectionName: "position" })
                .then(data => { setWaypoints(data.data.map(d => d.data)[0]), reset() })
                .catch((err) => console.error(err.message)), 2000)

        }
    }

    return (
        <>
            <MapContainer
                key={seed}
                style={{ width: '90vw', height: '100vh' }} center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true}
            >
                {/* <TileLayer
                    url="http://openfiremap.org/hytiles/{z}/{x}/{y}.png"
                /> */}
                <TileLayer
                    url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
                />
                <RoutineMachine key={seed} waypoints={waypoints} />
            </MapContainer>
            <TrainingPlans callRefresh={getWaypoints} />
        </>
    )
}

export default Dashboard;