import React from "react";
import { useGeolocated } from "react-geolocated";

const GeoLocation = () => {
    const { coords, isGeolocationAvailable, isGeolocationEnabled } =
        useGeolocated({
            positionOptions: {
                enableHighAccuracy: false,
            },
            userDecisionTimeout: 5000,
        });

    return coords;
};

export default GeoLocation;