import React from "react";
import { Map, Marker, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

//fixing react-leaflet's broken default marker icon
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapComponent({ cities }) {
  let bounds = null;
  if (cities.length >= 2) {
    bounds = L.latLngBounds();
    cities.forEach((city) => {
      bounds.extend(city);
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
        console.log(city);
        return <Marker position={city} key={index}></Marker>;
      })}
    </Map>
  );
}
export default MapComponent;
