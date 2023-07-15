import "./App.css";
import { useGoogleDriveApi } from "./useGoogleApi";

function App() {
  const { doLoad } = useGoogleDriveApi();
  return (
    <div className="App">
      <button onClick={doLoad}>Init 👮‍♀️</button>
    </div>
  );
}

export default App;
