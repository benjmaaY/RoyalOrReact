import React , {useEffect, useState} from 'react'
import axios from "axios"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Swal from 'sweetalert2'
import {NavLink} from "react-router-dom";
import Select from 'react-select';
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)








export default function Inventory() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectValue, setSelectValue] = useState([]);


  const fetchCategories = async() => {
      const result = await axios.get("categories")
      let toWorkOnCategories = await result.data
      let finalCategories = []
      toWorkOnCategories.map(el => {
        if (el.id != 0) {
          let toAdd = {
            value: el.id,
            label: el.name
          }
          finalCategories.push(toAdd)
        }
      })
      setCategories(finalCategories)
      console.log(categories)
  }

  const fetchProducts = async() => {
      const result = await axios.get("products")
      setProducts(await result.data)
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, []);
  
  function toArrayOfObject(arr) {
    return arr.map(a => ({value: a, label: a}));
  }

  function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].value === nameKey) {
            return myArray[i];
        }
    }
  }
  

  return (
    <div className="row col-11">
  <div className="col-12">
    <div className="demo-content bg-alt">
      <div className="row top-part">
        <div className="col-8" style={{paddingLeft: '10px'}}>
          <h2 style={{fontWeight: 'bold', fontSize: '30px'}}>Gérer vos produits</h2>
          <h5 style={{fontSize: '23px', lineHeight: 0}}>Ajouter, Supprimer, Editer votre base de donnée</h5>
        </div>
        <div className="col-4" style={{position: 'relative'}}>
          <input className="inputSearch" placeholder="Rechercher ici..." />
          <i className="fa fa-search icon errspan" />
        </div>
      </div>
      <div className="buttons">
        <button onClick={() => {
          let defaultValue = []
          let nameToSubmit
          let imageToSubmit
          let selectToSubmit
          categories.forEach(res => {
            console.log(res)
            console.log(categories)
            if (search(res, categories) == undefined) {

            } else {
              defaultValue.push(
                {
                  value: res,
                  label: search(res, categories).label
                }
              )
            }
            console.log(defaultValue)
          })
          MySwal.fire({
            title: 'Ajouter produit:',
            customClass: 'swal-height',
            html: <div>
                <div class="form-group">
                  <label htmlFor="exampleInputEmail1">Nom du produit:</label>
                  <input onChange={e => {nameToSubmit = e.target.value}} id="name" className="form-control" placeholder="Nom..."/>   
                  <br />                                
                </div>
                <div class="form-group">
                  <label htmlFor="exampleInputPassword1">Lien de l'image:</label>
                  <input onChange={e => {imageToSubmit = e.target.value}} id="imgLink" className="form-control" placeholder="https://..."/>
                  <br />
                </div>
                <div className="form-group">
                  <label htmlFor="exampleInputPassword1">Catégorie(s):</label>
                  <Select
                    menuPlacement="top"
                    isMulti
                    name="colors"
                    options={categories}
                    className="basic-multi-select"
                    classNamePrefix="select"
                    onChange={(val) => {
                      let toPushVal = []
                      val.forEach(valueVal => {
                        toPushVal.push(valueVal.value)
                      })
                      selectToSubmit = toPushVal
                    }}
                  />
                  <br />
                </div>
              </div>
            ,
            showDenyButton: true,
            denyButtonText: 'Annuler',
            showLoaderOnConfirm: true,
            preConfirm: () => {
              console.log("/////////")
              if (nameToSubmit == undefined) {
                throw new Error("Nom pas défini")
              }
              if (imageToSubmit == undefined) {
                throw new Error("Image pas définie")
              }
              if (selectToSubmit == undefined) {
                throw new Error("Catégorie pas définie")
              }
              return axios.post(`/products/`, {
                name: nameToSubmit,
                image: imageToSubmit,
                category: selectToSubmit
              })
                .then(response => {
                  if (response.status !== 201) {
                    throw new Error(response.statusText)
                  }
                  fetchProducts()
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
        }} className="categoryBtn"><i className="fa-solid fa-plus" style={{marginRight: '0.7rem'}} />Ajouter un nouveau produit</button>
        <NavLink to="/inventory">
          <a style={{textDecoration: 'none', color: 'black'}} className="categoryBtn active"><i className="fa-solid fa-gear" style={{marginRight: '0.7rem'}} />Gérer vos catégories</a>
        </NavLink>
        </div>
      <br />
      <div className="row container tableInfos">
        <table className="table table-striped">
          <thead>
            <tr>
              <th scope="col">Image:</th>
              <th scope="col">Nom:</th>
              <th scope="col">Catégorie:</th>
              <th scope="col">Actions:</th>
            </tr>
          </thead>
          <tbody>
            {products.map(el => {
              
                return (<tr>
                          <td><img src={el.image} alt="Avatar" style={{width: "150px"}}/></td>
                          <td>{el.name}</td>
                          <td>{el.category.map((e, i, row) => {
                            if (i + 1 === row.length) {
                              return e
                            } else {
                              return e + ", "
                            }
                            
                          })}</td>
                          
                          <td><button onClick={() => {
                            let defaultValue = []
                            let nameToSubmit
                            let imageToSubmit
                            let selectToSubmit
                            el.category.forEach(res => {
                              console.log(res)
                              console.log(categories)
                              if (search(res, categories) == undefined) {

                              } else {
                                defaultValue.push(
                                  {
                                    value: res,
                                    label: search(res, categories).label
                                  }
                                )
                              }
                              console.log(defaultValue)
                            })
                            
                            MySwal.fire({
                              title: 'Modifier produit:',
                              customClass: 'swal-height',
                              html: <div>
                                  <div class="form-group">
                                    <label htmlFor="exampleInputEmail1">Nom du produit:</label>
                                    <input onChange={e => {nameToSubmit = e.target.value}} id="name" defaultValue={el.name} className="form-control" placeholder="Nom..."/>   
                                    <br />                                
                                  </div>
                                  <div class="form-group">
                                    <label htmlFor="exampleInputPassword1">Lien de l'image:</label>
                                    <input onChange={e => {imageToSubmit = e.target.value}} id="imgLink" defaultValue={el.image} className="form-control" placeholder="https://..."/>
                                    <br />
                                  </div>
                                  <div className="form-group">
                                    <label htmlFor="exampleInputPassword1">Catégorie(s):</label>
                                    <Select
                                      menuPlacement="top"
                                      defaultValue={defaultValue}
                                      isMulti
                                      name="colors"
                                      options={categories}
                                      className="basic-multi-select"
                                      classNamePrefix="select"
                                      onChange={(val) => {
                                        let toPushVal = []
                                        val.forEach(valueVal => {
                                          toPushVal.push(valueVal.value)
                                        })
                                        selectToSubmit = toPushVal
                                      }}
                                    />
                                    <br />
                                  </div>
                                </div>
                              ,
                              showDenyButton: true,
                              denyButtonText: 'Annuler',
                              showLoaderOnConfirm: true,
                              preConfirm: () => {
                                console.log(el.name)
                                console.log(el.image)
                                console.log("/////////")
                                if (nameToSubmit == undefined) {
                                  nameToSubmit = el.name
                                }
                                if (imageToSubmit == undefined) {
                                  imageToSubmit = el.image
                                }
                                if (selectToSubmit == undefined) {
                                  selectToSubmit = el.category
                                }
                                return axios.put(`/products/` + el.id, {
                                  name: nameToSubmit,
                                  image: imageToSubmit,
                                  category: selectToSubmit
                                })
                                  .then(response => {
                                    if (response.status !== 200) {
                                      throw new Error(response.statusText)
                                    }
                                    fetchProducts()
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
                                return axios.delete(`/products/` + el.id)
                                  .then(response => {
                                    if (response.status !== 200) {
                                      throw new Error(response.statusText)
                                    }
                                    fetchProducts()
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
            })}
          </tbody>
        </table>  
      </div>
    </div>
  </div>
</div>

  )
}
