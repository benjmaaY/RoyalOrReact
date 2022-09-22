import React , {useEffect, useState, useMemo, useCallback} from 'react'
import axios from "axios"
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Swal from 'sweetalert2'
import {NavLink} from "react-router-dom";
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import { Skeleton } from '@mui/material';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.action.hover,
      color: theme.palette.common.black,
      fontWeight: "700",
      fontSize: "1.2rem",
      fontFamily: "Gilroy"
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        fontFamily: "Gilroy"
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

function Row(props) {
    const { row } = props;
    const [open, setOpen] = React.useState(false);
    

    return (
      <React.Fragment>
        <StyledTableRow  sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            {row.id}
          </TableCell>
          <TableCell align="right">{row.client}</TableCell>
          <TableCell align="right">{row.date}</TableCell>
          <TableCell align="right">{row.subtotal}</TableCell>
          <TableCell align="right">{row.taxes}</TableCell>
          <TableCell align="right">{row.total}</TableCell>
          <TableCell align="right"><NavLink to={"/orders/" + row.id} className="btn btn-warning">Afficher</NavLink></TableCell>
        </StyledTableRow>
        <StyledTableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1 }}>
                <Typography variant="h6" gutterBottom component="div">
                  Contenus de la commande:
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell># Produit</TableCell>
                      <TableCell>Nom</TableCell>
                      <TableCell align="right">Quantité</TableCell>
                      <TableCell align="right">Prix total:</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.content.map((contentRow) => (
                      <TableRow key={contentRow.id}>
                        <TableCell component="th" scope="row">
                          {contentRow.id}
                        </TableCell>
                        <TableCell>{contentRow.name}</TableCell>
                        <TableCell align="right">
                            {contentRow.quantity}
                        </TableCell>
                        <TableCell align="right">
                            {contentRow.totalAmount}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </StyledTableRow>
      </React.Fragment>
    );
  }



export default function Inventory() {

  const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
  
  const fetchOrders = async() => {
      const result = await axios.get("orders")
      setOrders(await result.data)
      setIsLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, []);

  

  return (
    <div className="row col-11">
  <div className="col-12">
    <div className="demo-content bg-alt">
      <div className="row top-part">
        <div className="col-8" style={{paddingLeft: '10px'}}>
          <h2 style={{fontWeight: 'bold', fontSize: '30px'}}>Gérer vos commandes</h2>
          <h5 style={{fontSize: '23px', lineHeight: 0}}>Ajouter, Supprimer, Editer votre base de donnée</h5>
        </div>
        <div className="col-4" style={{position: 'relative'}}>
          <input className="inputSearch" placeholder="Rechercher ici..." />
          <i className="fa fa-search icon errspan" />
        </div>
      </div>
      <br />
      <div className="row container tableInfos">
        
        <TableContainer component={Paper}>
        <Table aria-label="collapsible table" size="small">
            <TableHead>
            <TableRow>
                <StyledTableCell />
                <StyledTableCell>#</StyledTableCell>
                <StyledTableCell align="right">Client:</StyledTableCell>
                <StyledTableCell align="right">Date:</StyledTableCell>
                <StyledTableCell align="right">Subtotal:</StyledTableCell>
                <StyledTableCell align="right">Taxes:</StyledTableCell>
                <StyledTableCell align="right">Total:</StyledTableCell>
                <StyledTableCell align="right">Facture:</StyledTableCell>
            </TableRow>
            </TableHead>
            <TableBody>
            {isLoading ? <StyledTableRow  sx={{ '& > *': { borderBottom: 'unset' } }}>
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
            >
              <KeyboardArrowDownIcon />
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            <Skeleton variant="rectangular" width={"100%"} />
          </TableCell>
          <TableCell align="right"><Skeleton variant="rectangular" width={"100%"} /></TableCell>
          <TableCell align="right"><Skeleton variant="rectangular" width={"100%"} /></TableCell>
          <TableCell align="right"><Skeleton variant="rectangular" width={"100%"} /></TableCell>
          <TableCell align="right"><Skeleton variant="rectangular" width={"100%"} /></TableCell>
          <TableCell align="right"><Skeleton variant="rectangular" width={"100%"} /></TableCell>
          <TableCell align="right"><Skeleton variant="rectangular" width={"100%"} /></TableCell>
        </StyledTableRow> : <div></div>}
                {orders.map(el => {
                    return  <Row key={el.id} row={el} />
                })}
            
            </TableBody>
        </Table>
        </TableContainer>
      </div>
    </div>
  </div>
  
</div>

  )
}
