import React , {useEffect, useState} from 'react'
import axios from "axios"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Swal from 'sweetalert2'
import {NavLink} from "react-router-dom";





export default function Inventory() {

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
          <h2 style={{fontWeight: 'bold', fontSize: '30px'}}>Gérer vos catégories</h2>
          <h5 style={{fontSize: '23px', lineHeight: 0}}>Ajouter, Supprimer, Editer votre base de donnée</h5>
        </div>
        <div className="col-4" style={{position: 'relative'}}>
          <input className="inputSearch" placeholder="Rechercher ici..." />
          <i className="fa fa-search icon errspan" />
        </div>
      </div>
      <div className="buttons">
        <button onClick={() => {
          Swal.fire({
            title: 'Ajouter une nouvelle catégorie:',
            input: 'text',
            inputAttributes: {
              autocapitalize: 'off'
            },
            showDenyButton: true,
            denyButtonText: 'Annuler',
            showLoaderOnConfirm: true,
            inputPlaceholder: "Nom...",
            preConfirm: (result) => {
              console.log(result)
              return axios.post(`/categories/`, {
                name: result,
                icon: "fa-baseball"
              })
                .then(response => {
                  if (response.status !== 201) {
                    throw new Error(response.statusText)
                  }
                  fetchCategories()
                  return console.log(response.data)
                })
                .catch(error => {
                  Swal.showValidationMessage(
                    `Request failed: ${error}`
                  )
                })
            },
            allowOutsideClick: () => !Swal.isLoading()
          }).then((result) => {
            if (result.isConfirmed) {
              let timerInterval
              Swal.fire({
                icon: "success",
                title: 'Success',
                timer: 1000,
                timerProgressBar: true,
                didOpen: () => {
                  const b = Swal.getHtmlContainer().querySelector('b')
                  timerInterval = setInterval(() => {
                    b.textContent = Swal.getTimerLeft()
                  }, 100)
                },
                willClose: () => {
                  clearInterval(timerInterval)
                }
              })
            }
          })
        }} className="categoryBtn"><i className="fa-solid fa-plus" style={{marginRight: '0.7rem'}} />Ajouter une nouvelle catégorie</button>
      </div>
      <br />
      <div className="row container tableInfos">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Nom du catégorie:</th>
              <th scope="col">Actions:</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(el => {
              console.log(el)
              if (el.id !== 0) {
                
                return (<tr>
                          <td>{el.name}</td>
                          
                          <td><button onClick={() => {
                            Swal.fire({
                              title: 'Modifier nom du catégorie:',
                              input: 'text',
                              inputAttributes: {
                                autocapitalize: 'off'
                              },
                              showDenyButton: true,
                              denyButtonText: 'Annuler',
                              showLoaderOnConfirm: true,
                              inputValue: el.name,
                              preConfirm: (result) => {
                                console.log(result)
                                return axios.put(`/categories/` + el.id, {
                                  name: result,
                                  icon: "fa-baseball"
                                })
                                  .then(response => {
                                    if (response.status !== 200) {
                                      throw new Error(response.statusText)
                                    }
                                    fetchCategories()
                                    return console.log(response.data)
                                  })
                                  .catch(error => {
                                    Swal.showValidationMessage(
                                      `Request failed: ${error}`
                                    )
                                  })
                              },
                              allowOutsideClick: () => !Swal.isLoading()
                            }).then((result) => {
                              if (result.isConfirmed) {
                                let timerInterval
                                Swal.fire({
                                  icon: "success",
                                  title: 'Success',
                                  timer: 1000,
                                  timerProgressBar: true,
                                  didOpen: () => {
                                    const b = Swal.getHtmlContainer().querySelector('b')
                                    timerInterval = setInterval(() => {
                                      b.textContent = Swal.getTimerLeft()
                                    }, 100)
                                  },
                                  willClose: () => {
                                    clearInterval(timerInterval)
                                  }
                                })
                              }
                            })
                          }} className="tableButton">Modifier</button><button className="tableButton" onClick={() => {
                            Swal.fire({
                              title: 'Etes-vous sur?',
                              text: "Vous ne pourrez pas revenir en arrière !",
                              icon: 'warning',
                              showCancelButton: true,
                              confirmButtonColor: '#3085d6',
                              cancelButtonColor: '#d33',
                              confirmButtonText: 'Oui, supprimez-le !',
                              preConfirm: (result) => {
                                console.log(result)
                                return axios.delete(`/categories/` + el.id)
                                  .then(response => {
                                    if (response.status !== 200) {
                                      throw new Error(response.statusText)
                                    }
                                    fetchCategories()
                                    return console.log(response.data)
                                  })
                                  .catch(error => {
                                    Swal.showValidationMessage(
                                      `Request failed: ${error}`
                                    )
                                  })
                              },
                            }).then((result) => {
                              if (result.isConfirmed) {
                                let timerInterval
                                Swal.fire({
                                  icon: "success",
                                  title: 'Supprimé!',
                                  timer: 1000,
                                  timerProgressBar: true,
                                  didOpen: () => {
                                    const b = Swal.getHtmlContainer().querySelector('b')
                                    timerInterval = setInterval(() => {
                                      b.textContent = Swal.getTimerLeft()
                                    }, 100)
                                  },
                                  willClose: () => {
                                    clearInterval(timerInterval)
                                  }
                                })
                              }
                            })
                          }} style={{marginLeft: '0.3rem'}}>Supprimer</button></td>
                        </tr>)
              }
            })}
          </tbody>
        </table>  
      </div>
    </div>
  </div>
</div>

  )
}
