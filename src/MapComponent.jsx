import React from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

//fixing react-leaflet's broken default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});



function MapComponent({ cities }) {
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
    </Map>
  );
}
export default MapComponent;
