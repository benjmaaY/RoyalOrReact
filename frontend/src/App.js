import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Inventory from "./pages/Inventory";
import NavBar from "./pages/NavBar";


function App() {
  return (
    <Router>
      <div className="row">
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/inventory" element={<Inventory/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
