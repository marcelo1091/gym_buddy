"use client"

import { getFromDb } from "@/app/database/getFromDb";
import { createControlComponent } from "@react-leaflet/core";
import L from "leaflet";
import "leaflet-routing-machine";
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import { useState } from "react";
// import { createControlComponent } from "react-leaflet";

const createRoutineMachineLayer = ({ waypoints }) => {
  const way = waypoints?.position ?? []
  console.log(way);

  const icon = L.icon({
    iconUrl:
      "/icons/location-pin.png",
    iconSize: [40, 40],
    iconAnchor: [19, 38],
  });

  const filteredWay = removeGeoOutliers(way, 2)

  function haversineDistance(p1, p2) {
    const R = 6371; // Promień Ziemi w kilometrach
    const toRad = deg => deg * (Math.PI / 180);
    const dLat = toRad(p2.lat - p1.lat);
    const dLon = toRad(p2.lon - p1.lon);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(p1.lat)) * Math.cos(toRad(p2.lat)) *
      Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  function removeGeoOutliers(points, threshold = 2) {
    // Oblicz średni punkt (środek masy)
    const avg = points.reduce((acc, p) => {
      acc.lat += p.lat;
      acc.lon += p.lon;
      return acc;
    }, { lat: 0, lon: 0 });

    avg.lat /= points.length;
    avg.lon /= points.length;

    // Oblicz odległości Haversine od średniego punktu
    const distances = points.map(p => haversineDistance(p, avg));

    // Oblicz średnią i odchylenie standardowe odległości
    const meanDist = distances.reduce((a, b) => a + b, 0) / distances.length;
    const stdDev = Math.sqrt(
      distances.reduce((sum, d) => sum + (d - meanDist) ** 2, 0) / distances.length
    );

    // Filtruj punkty, które są w granicach [mean ± threshold * stdDev]
    return points.filter((p, i) =>
      Math.abs(distances[i] - meanDist) <= threshold * stdDev
    );
  }

  const instance = L.Routing.control({
    // waypoints: [
    //   L.latLng(53.500394, 19.350369),
    //   L.latLng(53.501588, 19.350400),
    //   L.latLng(53.501807, 19.347889),
    //   L.latLng(53.502420, 19.348331),
    //   L.latLng(53.502511, 19.350204)
    // ],
    waypoints: filteredWay,
    lineOptions: {
      styles: [{ color: "#c600e7", weight: 5 }]
    },
    addWaypoints: false,
    routeWhileDragging: false,
    draggableWaypoints: true,
    fitSelectedRoutes: true,
    showAlternatives: false,
    // waypointMode: "snap",
    plan: L.Routing.plan(filteredWay, {
      createMarker: function (i, wp) {
        return L.marker(wp.latLng, {
          draggable: true,
          icon
        });
      },
      routeWhileDragging: true
    })
  });


  return instance;
};

const RoutingMachine = createControlComponent(createRoutineMachineLayer);

export default RoutingMachine;
