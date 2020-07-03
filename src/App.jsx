//necessary react imports
import React, { useState } from "react";
import MapComponent from "./MapComponent";

//UI-components from material-UI
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
  //array of city data [latitude (float),longitude (float), address (string)]
  const [cities, setCities] = useState([]);
  //index of the start city in city array (int)
  const [startCity, setStartCity] = useState(null);
  //array containing solution (indizes from city array)
  const [solution, setSolution] = useState([]);
  //matrix coantaining precalculated distances from each city to each other city
  const [distMatrix, setDistMatrix] = useState([]);

  //load and aprse a user input file.
  //if valid load data into city state array
  const fileLoadHandler = (event) => {
    let loadedFile = event.target.files[0];
    //check if a file was submitted
    if (!loadedFile) {
      return;
    }
    var reader = new FileReader();
    reader.onload = function (event) {
      let result = event.target.result;
      let newCities = [];
      let lines = result.split("\n");
      //check if file is valid
      if (
        lines[0] !==
        "Nummer,msg Standort,Straße,Hausnummer,PLZ,Ort,Breitengrad,Längengrad"
      ) {
        alert(
          "Diese Datei kann nicht gelesen werden. Bitte wähle eine andere kompatible Datei."
        );
        return;
      }
      //remove first line
      lines.shift(1);
      //parse .csv data
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

  //funtion for setting a new start city
  const changeStartCity = (city) => {
    setStartCity(city);
    setSolution([]);
  };

  //generate a first Solution using the Nearest-Neighbor method
  const calcSolution = () => {
    //create an empty matrix of size: cities.length x cities.length
    let distMatrix = [];
    for (var i = 0; i < cities.length; i++) {
      distMatrix[i] = new Array(cities.length);
    }
    //for each city calcuate the distance to each other city and store it in the matrix
    for (let [i, from] of cities.entries()) {
      for (let [j, to] of cities.entries()) {
        let pointFrom = new LatLng(from[0], from[1]);
        distMatrix[i][j] = pointFrom.distanceTo(new LatLng(to[0], to[1]));
      }
    }

    //greedy nearest neighbour algorithm for finding a first solution:
    //starting at the startCity then always choose the shortest trip to an unvisited city.
    //do this until all citys are visited
    let solution = [startCity];
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
      solution.push(nearest);
    }
    //add way back to solution to coplete the tour
    solution.push(startCity);
    setSolution(solution);
    setDistMatrix(distMatrix);
  };

  //optimize solution using the 2-opt algorithm
  const optSolution = () => {
    //copy state varaibele to allow for modification
    let newSolution = [...solution];
    let iterations = 0;
    //2-opt algorithm: try to find the optimal entries i and j from the solution,
    //so that the connection from i to j and i+1 to j+1 is shorter then the connection from i to i+1 and from j to j+1.
    //Continue until no further optimization can be found or 100 iterations were reached.
    while (true) {
      let minI,
        minJ,
        minChange = 0;
      for (let i = 1; i < newSolution.length - 2; i++) {
        for (let j = i + 2; j < newSolution.length - 1; j++) {
          let change =
            distMatrix[newSolution[i]][newSolution[j]] +
            distMatrix[newSolution[i + 1]][newSolution[j + 1]] -
            distMatrix[newSolution[i]][newSolution[i + 1]] -
            distMatrix[newSolution[j]][newSolution[j + 1]];
          if (change < minChange) {
            minI = i;
            minJ = j;
            minChange = change;
          }
        }
      }
      //break if no improvement was found or iterations get very high
      //(prevent the site from geting unresponsive when the optimization takes to long for larger amounts of cities)
      if (minChange >= 0 || iterations > 100) {
        break;
      }
      iterations++;
      //apply optimization
      console.log(`found optimization: ${minI} ${minJ} ${minChange}`);
      newSolution.splice(
        minI + 1,
        minJ - minI,
        ...newSolution.slice(minI + 1, minJ + 1).reverse()
      );
    }
    //sanity check that no subtours are present
    for (let i = 0; i < newSolution.length; i++) {
      for (let j = 0; j < newSolution.length; j++) {
        if (
          newSolution[i] === newSolution[j] &&
          i !== j &&
          i !== 0 &&
          i !== solution.length - 1
        ) {
          alert(
            `Achtung: Beim Lösen ist ein Fehler aufgetreten: Einträge ${i} und ${j} sind identisch)`
          );
        }
      }
    }
    //apply found optimization to solution
    setSolution(newSolution);
  };

  //calculate the total distance of the current solution
  const calcDistance = () => {
    let distance = 0;
    for (let i = 0; i < solution.length - 1; i++) {
      distance += distMatrix[solution[i]][solution[i + 1]];
    }
    return distance;
  };

  //render the app
  return (
    <Paper style={{ margin: "1.5vh", height: "97vh", overflow: "hidden" }}>
      <Grid container spacing={0} style={{ height: "100%" }}>
        <Grid item xs={12} sm={8}>
          <MapComponent
            cities={cities}
            solution={solution}
            startCity={startCity}
            handlePopupClick={changeStartCity}
          ></MapComponent>
        </Grid>
        <Grid item xs={12} sm={4} style={{ height: "100%" }}>
          <div
            style={{
              height: "100%",
              padding: "5px",
              display: "flex",
              flexDirection: "column",
              overflow: "auto",
            }}
          >
            <div>
              Diese App wurde als Teil der get-in-IT.de coding challenge
              erstellt: <br />
              Kontakt: Marcus Voß (marcus.voss@campus.tu-berlin.de)
            </div>
            <br />
            <div style={{ fontWeight: "bold" }}>Anleitung:</div>
            DATEIAUSWAHL: Lade eine kompatible .csv Datei. <br />
            SCHNELLE LÖSUNG: Generiere eine erste Lösung mittels
            "Nearest-Neighbor-Heuristik". Hierzu muss zunächst eine Startstadt
            ausgewählt werden. Entweder über die Liste oder mittels Klicken auf
            der Karte <br />
            OPTIMIEREN: Optimiere die Lösung mittels 2-opt-Verfahren.
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
                style={{ marginTop: 5, marginRight: 5 }}
                onClick={calcSolution}
              >
                Schnelle Lösung
              </Button>
              <Button
                variant="contained"
                color="primary"
                component="span"
                disabled={solution.length === 0}
                style={{ marginTop: 5 }}
                onClick={optSolution}
              >
                Optimieren
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
                  changeStartCity(e.target.value);
                }}
              >
                {cities.map((city, index) => {
                  return (
                    <MenuItem key={index} value={index}>
                      {`${index}) ${cities[index][2]}`}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <div>
              <span style={{ fontWeight: "bold" }}>Weglänge:</span>{" "}
              {(calcDistance() / 1000).toFixed(2)}km
            </div>
            <div style={{ wordWrap: "break-word" }}>
              {solution.map((destination, index) => {
                return destination + (index < solution.length - 1 ? "->" : "");
              })}
            </div>
          </div>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default App;
