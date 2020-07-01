import React from "react";
import { Map, Marker, Popup, TileLayer} from "react-leaflet";
import Polyline  from 'react-leaflet-arrowheads'
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const circleIcon = new L.Icon({
  iconUrl: require("./doubleCircle.png"),
  iconSize: [16, 16],
});

const circleIconActive = new L.Icon({
  iconUrl: require("./doubleCircleActive.png"),
  iconSize: [16, 16],
});

function MapComponent({ cities, solution, startCity }) {
  let bounds = null;
  if (cities.length >= 2) {
    bounds = L.latLngBounds();
    cities.forEach((city) => {
      bounds.extend([city[0], city[1]]);
    });
  }
  return (
    <Map
      center={[52.521918, 13.413215]}
      bounds={bounds}
      boundsOptions={{ padding: [20, 20] }}
      zoom={3}
      zoomControl={false}
      doubleClickZoom={false}
      scrollWheelZoom={false}
      touchZoom={false}
      dragging={false}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {cities.map((city, index) => {
        return (
          <Marker
            icon={index === startCity ? circleIconActive : circleIcon}
            position={[city[0], city[1]]}
            key={index}
            onMouseOver={(e) => {
              e.target.openPopup();
            }}
            onMouseOut={(e) => {
              e.target.closePopup();
            }}
          >
            {" "}
            <Popup>{city[2]}</Popup>
          </Marker>
        );
      })}
      <Polyline
        positions={solution.map((i) => {
          return cities[i];
        })}
        arrowheads
      ></Polyline>
    </Map>
  );
}
export default MapComponent;
