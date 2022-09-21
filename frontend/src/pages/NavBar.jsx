import React  from 'react'
import {NavLink, useLocation} from "react-router-dom";

export default function NavBar({children}) {
  const { pathname } = useLocation();

  return (
        <div className="col-1 d-flex flex-nowrap b-example-vr no-print">
        <div style={{width: '100%'}} className="d-flex  flex-column flex-shrink-0 bg-light">
          <a href="/" className="d-block link-dark text-center text-decoration-none" title="Icon-only" data-bs-toggle="tooltip" data-bs-placement="right">
            <img src="/logo.png" style={{padding: '1.2rem', maxWidth: '100%', mixBlendMode: 'multiply'}} />
          </a>
          <ul className="nav my-auto nav-pills nav-flush flex-column mb-auto text-center">
            <li className="nav-item">
              <NavLink to="/"  className="nav-link py-3 border-bottom rounded-0" aria-current="page">
                <i style={{fontSize: '1.4rem', marginRight: '0.2rem', marginLeft: '0.2rem'}} className="fa-solid fa-plus" />
                <br />
                Nouvelle Commande
              </NavLink>
            </li>
            <li  className="nav-item">
              <NavLink to="/products" className="nav-link  py-3 border-bottom rounded-0" aria-current="page">
                <i style={{fontSize: '1.4rem', marginRight: '0.2rem', marginLeft: '0.2rem'}} className="fa-solid fa-boxes-stacked" />
                <br />
                Produits
              </NavLink>
            </li>
            <li  className="nav-item">
              <NavLink to="/inventory" className="nav-link  py-3 border-bottom rounded-0" aria-current="page">
                <i style={{fontSize: '1.4rem', marginRight: '0.2rem', marginLeft: '0.2rem'}} className="fa-solid fa-warehouse" />
                <br />
                Catégories
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/orders" className="nav-link py-3 border-bottom rounded-0" aria-current="page">
                <i style={{fontSize: '1.4rem', marginRight: '0.2rem', marginLeft: '0.2rem'}} className="fa-solid fa-list" />
                <br />
                Liste des commandes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/settings" className="nav-link py-3 border-bottom rounded-0" aria-current="page">
                <i style={{fontSize: '1.4rem', marginRight: '0.2rem', marginLeft: '0.2rem'}} className="fa-solid fa-cog" />
                <br />
                Paramétres
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
  )
}
