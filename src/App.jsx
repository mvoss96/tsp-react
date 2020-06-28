import React, { useState } from "react";
import MapComponent from "./MapComponent";

function App() {
  const [cities, setCities] = useState([]);

  const fileLoadHandler = (event) => {
    let loadedFile = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
      let result = event.target.result;
      let newCities = [];
      let lines = result.split("\n");
      if (
        lines[0] !==
        "Nummer,msg Standort,Straße,Hausnummer,PLZ,Ort,Breitengrad,Längengrad"
      ) {
        console.log("unsupported file");
        return;
      }
      lines.shift(1); //remove first line
      for (let line of lines) {
        let values = line.split(",");
        if (values.length === 8) {
          newCities.push([parseFloat(values[6]), parseFloat(values[7])]);
        }
      }
      setCities(newCities);
    };
    reader.readAsText(loadedFile);
  };

  return (
    <React.Fragment>
      <div>Hallo Welt</div>
      <input type="file" accept=".csv" onChange={fileLoadHandler} />
      <MapComponent cities={cities}></MapComponent>
    </React.Fragment>
  );
}

export default App;
