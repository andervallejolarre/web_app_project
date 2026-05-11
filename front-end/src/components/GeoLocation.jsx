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

    if (isGeolocationAvailable && isGeolocationEnabled && coords) {
        return coords;
    }
    return null;
};

export default GeoLocation;