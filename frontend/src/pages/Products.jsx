import React , {useEffect, useState} from 'react'
import axios from "axios"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Swal from 'sweetalert2'
import {NavLink} from "react-router-dom";
import Select from 'react-select';
import withReactContent from 'sweetalert2-react-content'
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterListIcon from '@mui/icons-material/FilterList';
import { visuallyHidden } from '@mui/utils';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import { Button, Skeleton } from '@mui/material';
import { red } from '@mui/material/colors';


const MySwal = withReactContent(Swal)

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'id',
    numeric: false,
    disablePadding: true,
    label: 'ID Produit',
  },
  {
    id: 'name',
    numeric: false,
    disablePadding: false,
    label: 'Nom',
  },
  {
    id: 'image',
    numeric: false,
    disablePadding: false,
    label: 'Image',
  },
  {
    id: 'category',
    numeric: false,
    disablePadding: false,
    label: 'Catégorie',
  },
  {
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: 'Actions:',
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}


export default function Inventory() {

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectValue, setSelectValue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };



  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };


  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - products.length) : 0;

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
      setIsLoading(false)
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
        </div>
      <br />
      <div className="row container tableInfos">
      <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size="small"
            
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={products.length}
            />
            <TableBody>
              {isLoading ? 
                <TableRow
                tabIndex={-1}
                key={-1}
                  >
                    <TableCell
                      id='-1'
                      component="th"
                      scope="row"
                      padding="normal"
                    >
                      <Skeleton variant="rectangular" width={"100%"} /> 
                    </TableCell>
                    <TableCell> <Skeleton variant="rectangular" width={"100%"} /> </TableCell>
                    <TableCell><Skeleton variant="circular" width={"100px"} /> </TableCell>
                    <TableCell><Skeleton variant="rectangular" width={"100%"} /></TableCell>
                    <TableCell> 
                      <button style={{border: "none", backgroundColor: "white", cursor: "default", width: "25%"}}>
                        <Skeleton variant="rectangular" width={"100%"} style={{borderRadius: "25px", marginRight: "0.2rem"}} />
                      </button>
                      <button style={{border: "none", backgroundColor: "white", cursor: "default", width: "25%"}}>
                        <Skeleton variant="rectangular" width={"100%"} style={{borderRadius: "25px"}} />
                      </button>
                    </TableCell>
                  </TableRow> : 
                    <div>
                      
                    </div>
                  }
              {stableSort(products, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.name}
                      selected={isItemSelected}
                    >
                      <TableCell
                        component="th"
                        id={labelId}
                        scope="row"
                        padding="normal"
                      >
                        {row.id}
                      </TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell><img style={{width: "100px", borderRadius: "100%"}} src={row.image} /></TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell> 
                        <Button style={{borderRadius: "25px", marginRight: "5px", backgroundColor: "#FFCA40", boxShadow: "none"}} variant="contained" startIcon={<ModeEditIcon />} onClick={() => {
                          let defaultValue = []
                          let nameToSubmit
                          let imageToSubmit
                          let selectToSubmit
                          row.category.forEach(res => {
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
                                  <input onChange={e => {nameToSubmit = e.target.value}} id="name" defaultValue={row.name} className="form-control" placeholder="Nom..."/>   
                                  <br />                                
                                </div>
                                <div class="form-group">
                                  <label htmlFor="exampleInputPassword1">Lien de l'image:</label>
                                  <input onChange={e => {imageToSubmit = e.target.value}} id="imgLink" defaultValue={row.image} className="form-control" placeholder="https://..."/>
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
                            
                            allowOutsideClick: () => !Swal.isLoading()
                          })
                        }}>
                          Modifier
                        </Button> 
                        <Button style={{borderRadius: "25px"}} variant="contained" endIcon={<DeleteIcon />} color="error" >
                          Supprimer
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box> 
      </div>
    </div>
  </div>
</div>

  )
}
