import React, { useState } from "react";
import MapComponent from "./MapComponent";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";

function App() {
  const [cities, setCities] = useState([]);
  const [startCity, setStartCity] = useState([]);

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
        alert(
          "Diese Datei kann nicht gelesen werden. Bitte wähle eine andere kompatible Datei."
        );
        return;
      }
      lines.shift(1); //remove first line
      for (let line of lines) {
        let values = line.split(",");
        if (values.length === 8) {
          newCities.push([
            parseFloat(values[6]),
            parseFloat(values[7]),
            `${values[1]} ${values[2]} ${values[3]}`,
          ]);
        }
      }
      setCities(newCities);
    };
    reader.readAsText(loadedFile);
  };

  return (
    <Paper style={{ margin: "1.5vh", overflow: "hidden", height: "97vh" }}>
      <Grid container spacing={0} style={{ height: "100%" }}>
        <Grid item xs={12} sm={8}>
          <MapComponent cities={cities}></MapComponent>
        </Grid>
        <Grid item xs={12} sm={4}>
          <div style={{ height: "100%", padding: "5px" }}>
            <div>
              Diese App wurde als Teil der get-in-IT.de coding challenge
              erstellt: <br />
              Marcus Voß (marcus.voss@campus.tu-berlin.de)
            </div>
            <br />
            <div>
              <div style={{ fontWeight: "bold" }}>Anleitung:</div>
              Wähle eine kompatible .csv Datei. Die App versucht dann die
              kürzeste Reiseroute zu berechnen.
              <div>
                <input
                  type="file"
                  id="fileInput"
                  accept=".csv"
                  onChange={fileLoadHandler}
                  style={{ display: "none" }}
                />
                <div>
                  <label htmlFor="fileInput">
                    <Button
                      variant="contained"
                      color="secondary"
                      component="span"
                      startIcon={<CloudUploadIcon />}
                      style={{ marginTop: 5, marginRight: 10 }}
                    >
                      Dateiauswahl
                    </Button>
                  </label>
                  <Button
                    variant="contained"
                    color="primary"
                    component="span"
                    disabled={!startCity.length}
                    style={{ marginTop: 5 }}
                  >
                    Weg berechnen
                  </Button>
                </div>
                <FormControl style={{ minWidth: 120, marginRight: 10 }}>
                  <InputLabel htmlFor="startCityLabel">Startstadt:</InputLabel>
                  <Select
                    labelId="startCityLabel"
                    disabled={!cities.length}
                    id="startCity"
                    value={startCity.length ? startCity : ""}
                    onChange={(e) => {
                      setStartCity(e.target.value);
                    }}
                  >
                    {cities.map((city) => {
                      return (
                        <MenuItem key={city[2]} value={city}>
                          {city[2]}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default App;
