import React , {useEffect, useState} from 'react'
import axios from "axios"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Swal from 'sweetalert2'
import {NavLink} from "react-router-dom";





export default function Settings() {

  const [categories, setCategories] = useState([]);


  const fetchCategories = async() => {
      const result = await axios.get("categories")
      setCategories(await result.data)
  }

  useEffect(() => {
    fetchCategories()
  }, []);

  

  return (
    <div className="row col-11">
  <div className="col-12">
    <div className="demo-content bg-alt">
      <div className="row top-part">
        <div className="col-8" style={{paddingLeft: '10px'}}>
          <h2 style={{fontWeight: 'bold', fontSize: '30px'}}>Liste des paramétres:</h2>
          <h5 style={{fontSize: '23px', lineHeight: 0}}>Modifier vos parametres facilement ici</h5>
        </div>
      </div>
      <br />
      <div className="row container tableInfos">
      <div class="mb-4">
                <h6 className=" text-uppercase">Information de la société:</h6>
                <hr dataContent="AND" className="hr-text"/>
            </div>
      <form>
        <div className="form-group row">
          <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Nom:</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="inputEmail3" placeholder="Entrer nom..." />
          </div>
        </div>
        <br />
        <div className="form-group row">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Addresse:</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="inputPassword3" placeholder="Enter addresse..." />
          </div>
        </div>
        <br />
        <div className="form-group row">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Ville:</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" id="inputPassword3" placeholder="Enter ville..." />
          </div>
        </div>
        <br />
        <div className="form-group row">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Logo:</label>
          <div className="col-sm-10">
            <input type="file" className="form-control" id="inputPassword3" placeholder="" />
          </div>
        </div>
        <br />
        <div className="form-group row">
          <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Pourcentage de TVA:</label>
          <div className="col-sm-10">
            <input type="number" className="form-control" id="inputPassword3" placeholder="Enter % de taxes..." />
          </div>
        </div>
        <br />
        <div className="form-group row">
          <div className="col-sm-10">
            <button type="submit" className="btn btn-warning">Enregistrer</button>
          </div>
        </div>
      </form>


      </div>
    </div>
  </div>
</div>

  )
}
