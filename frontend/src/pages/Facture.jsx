import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./Facture.css"
import axios from "axios"
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import PrintIcon from '@mui/icons-material/Print';


const Facture = () => {
    const params = useParams()
    const id = params.id
    const [order, setOrder] = useState({});
    const [content, setContent] = useState([]);
    const [clientName, setClientName] = useState("")

    const fetchOrder = async() => {
        const result = await axios.get("http://localhost:5000/orders/" + id)
        setOrder(await result.data)
        setContent(await result.data.content)
        setClientName(await result.data.client)
    }
  
    useEffect(() => {
      fetchOrder()
    }, []);
    
    return (
        <div className="row col-11">
  <div className="col-12">
    <div className="demo-content bg-alt">
      <div className="container">
      
      <div className="invoice-box">
    <input onChange={(e) => setClientName(e.target.value)} className="clientName no-print" placeholder="Changer Nom De Client Ici Si Vous Voulez ...." />
  <table cellPadding={0} cellSpacing={0}>
    <tbody><tr className="top">
        <td colSpan={2}>
          <table>
            <tbody><tr>
                <td className="title">
                  <img src="/logo.png" style={{maxWidth: '100px'}} />
                </td>
                <td>
                  Facture num: #{order.id}<br />
                  Date: {order.date}<br />
                </td>
              </tr>
            </tbody></table>
        </td>
      </tr>
      <tr className="information">
        <td colSpan={2}>
          <table>
            <tbody><tr>
                <td>
                  Royal OR<br />
                  Bled ARBI, bled<br />
                  Sfax, Tunisie
                </td>
                <td>
                  Client:<br />
                  {clientName}<br />
                </td>
              </tr>
            </tbody></table>
        </td>
      </tr>
      <tr className="heading">
        <td>Produit</td>
        <td>Prix</td>
      </tr>
      {content.map(el => {
        return (
                <tr className="item">
                    <td>{el.name}</td>
                    <td>{el.totalAmount} TND</td>
                </tr>
        )
      })}
      <tr className="total">
        <td />
        
        <td>
            <span style={{fontWeight: "normal", fontSize: "1rem"}}>
            Subtotal: {order.subtotal}
            <br/>
            Taxes: {order.taxes}
            <br/>
            </span>
            Total: {order.total}
        </td>
      </tr>
      <br/>
    <Button className="no-print" onClick={() => window.print()} style={{backgroundColor: "#FFCA40", borderRadius: "25px", color: "black"}} variant="contained" endIcon={<PrintIcon />}>Imprimer la facture</Button>
    </tbody></table>
</div>

      </div>
    </div>
  </div>
</div>
    );
}

export default Facture;
