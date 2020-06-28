import React, { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);

  const fileLoadHandler = (event) => {
    let loadedFile = event.target.files[0]
    var reader = new FileReader();
    reader.onload = function (event) {
      setFile(event.target.result)
    };
    reader.readAsText(loadedFile);
  };

  return (
    <React.Fragment>
      <div>Hallo Welt</div>
      <div>{JSON.stringify(file)}</div>
      <input type="file" name="file" onChange={fileLoadHandler} />
    </React.Fragment>
  );
}

export default App;
