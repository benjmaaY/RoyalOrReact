import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Inventory from "./pages/Inventory";
import NavBar from "./pages/NavBar";
import Products from "./pages/Products";
import Orders from "./pages/Orders";


function App() {
  return (
    <Router>
      <div className="row">
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/inventory" element={<Inventory/>} />
          <Route path="/products" element={<Products/>} />
          <Route path="/orders" element={<Orders/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
