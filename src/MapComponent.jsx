//necessary react imports
import React from "react";
//import leaflet mapping components
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import Polyline from "react-leaflet-arrowheads";
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

function MapComponent({ cities, solution, startCity, handlePopupClick }) {
  //set the zoom of the map to fit all markers
  let bounds = null;
  if (cities.length >= 2) {
    bounds = L.latLngBounds();
    cities.forEach((city) => {
      bounds.extend([city[0], city[1]]);
    });
  }

  //reder the map
  return (
    <Map
      center={[52.521918, 13.413215]} //default view (germany)
      bounds={bounds}
      boundsOptions={{ padding: [20, 20] }}
      zoom={3}
      zoomControl={false}
      doubleClickZoom={false}
      scrollWheelZoom={true}
      touchZoom={true}
      dragging={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {
        //Place markers  for all cities and create a polyline that corresponds to the current solution
        cities.map((city, index) => {
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
              onclick={() => {
                handlePopupClick(index);
              }}
            >
              {" "}
              <Popup>{city[2]}</Popup>
            </Marker>
          );
        })
      }
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
