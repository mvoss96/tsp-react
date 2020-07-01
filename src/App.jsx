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
import { LatLng } from "leaflet";

function App() {
  const [cities, setCities] = useState([]);
  const [startCity, setStartCity] = useState(null);
  const [solution, setSolution] = useState([]);
  const [solutionDistance, setSolutionDistance] = useState(null);
  const fileLoadHandler = (event) => {
    let loadedFile = event.target.files[0];
    if (!loadedFile) {
      return;
    }
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

  const calcWay = () => {
    //create an empty matrix of cities.length x cities.length
    let distMatrix = [];
    for (var i = 0; i < cities.length; i++) {
      distMatrix[i] = new Array(cities.length);
    }
    //for each city calcuate the distance to each other city and store it in the matrix
    for (let [i, from] of cities.entries()) {
      for (let [j, to] of cities.entries()) {
        //console.log(`${i}/${from} ${j}/${to}`)
        let pointFrom = new LatLng(from[0], from[1]);
        distMatrix[i][j] = pointFrom.distanceTo(new LatLng(to[0], to[1]));
      }
    }
    console.log(distMatrix);
    //greedy nearest neighbour algorithm for finding a first solution:
    //starting at the startCity always choose the shortest trip to an unvisited city.
    //Do this until all citys are visited
    let solution = [startCity];
    let totalDistance = 0;
    while (solution.length < cities.length) {
      let nearest, shortestDistance;
      let currentCity = solution[solution.length - 1]; //last entry
      for (let [index, distance] of distMatrix[currentCity].entries()) {
        if (
          !solution.includes(index) &&
          (distance < shortestDistance || shortestDistance === undefined)
        ) {
          shortestDistance = distance;
          nearest = index;
        }
      }
      totalDistance += shortestDistance;
      solution.push(nearest);
    }
    //add way back to solution
    totalDistance += distMatrix[solution[solution.length - 1]][startCity];
    solution.push(startCity);

    console.log(solution);
    console.log(totalDistance);
    setSolution(solution);
    setSolutionDistance(totalDistance);
  };

  return (
    <Paper style={{ margin: "1.5vh", overflow: "hidden", height: "97vh" }}>
      <Grid container spacing={0} style={{ height: "100%" }}>
        <Grid item xs={12} sm={8}>
          <MapComponent
            cities={cities}
            solution={solution}
            startCity={startCity}
          ></MapComponent>
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
              Wähle eine kompatible .csv Datei und eine Startstadt. Die App
              versucht dann die kürzeste Reiseroute zu berechnen.
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
                    disabled={startCity === null}
                    style={{ marginTop: 5 }}
                    onClick={calcWay}
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
                    value={startCity !== null ? startCity : ""}
                    onChange={(e) => {
                      setStartCity(e.target.value);
                    }}
                  >
                    {cities.map((city, index) => {
                      return (
                        <MenuItem key={index} value={index}>
                          {cities[index][2]}
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
