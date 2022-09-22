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
import Facture from "./pages/Facture";
import Settings from "./pages/Settings";


function App() {
  return (
    <Router>
      <div className="row">
        <NavBar />
        <Routes>
          <Route path="/" element={<HomePage/>} />
          <Route path="/inventory" element={<Inventory/>} />
          <Route path="/products" element={<Products/>} />
          <Route path="/orders" element={<Orders/>} exact/>
          <Route path="/orders/:id" element={<Facture/>} exact/>
          <Route path="/settings" element={<Settings/>} exact/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
