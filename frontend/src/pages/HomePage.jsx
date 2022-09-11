import React , {useEffect, useState} from 'react'
import {Link} from "react-router-dom";
import axios from "axios"


export default function HomePage() {

    const taxRate = 3;
    function round2Fixed(value) {
        value = +value;
      
        if (isNaN(value))
          return NaN;
      
        // Shift
        value = value.toString().split('e');
        value = Math.round(+(value[0] + 'e' + (value[1] ? (+value[1] + 2) : 2)));
      
        // Shift back
        value = value.toString().split('e');
        return (+(value[0] + 'e' + (value[1] ? (+value[1] - 2) : -2))).toFixed(2);
      }

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState([]);
    const [subTotal, setSubTotal] = useState(0)
    const [totalAmount, setTotalAmount] = useState(0)
    const [query, setQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState(0);
    const [showenProducts, setShowenProducts] = useState([]);



    const fetchProducts = async(p) => {
        const result = await axios.get("products")
        setProducts(await result.data)
        setShowenProducts(await result.data)
    }

    const fetchCategories = async() => {
        const result = await axios.get("categories")
        setCategories(await result.data)
    }

    const addProductToCart = async(product) =>{
        // check if the adding product exist
        let findProductInCart = await cart.find(i=>{
          return i.id === product.id
        });
    
        if(findProductInCart){
          let newCart = [];
          let newItem;
    
          cart.forEach(cartItem => {
            if(cartItem.id === product.id){
              newItem = {
                ...cartItem,
                quantity: cartItem.quantity + 1,
                totalAmount: cartItem.price * (cartItem.quantity + 1)
              }
              newCart.push(newItem);
            }else{
                console.log("cart item")
                console.log(cartItem)
              newCart.push(cartItem);
            }
          });
    
          setCart(newCart);
    
        }else{
            console.log(product)
          let addingProduct = {
            ...product,
            'quantity': 1,
            'totalAmount': 0,
          }
          setCart([...cart, addingProduct]);
          console.log(addingProduct)
        }
    
      }
      function refreshSubtotal(event, p) {
        p.totalAmount = parseInt(event.target.value)
        console.log("single product amount")
        console.log(p.totalAmount)
        let sum = 0;
        cart.forEach(element => {
            sum = sum + (element.totalAmount * element.quantity);
        });
        console.log("subtotal")
        console.log(sum)
        console.log("p")
        console.log(p)
        setSubTotal(sum)
    }

    function refreshQuantity(event, p) {
        p.quantity = parseInt(event.target.value)
        console.log("single product qty")
        console.log(p.quantity)
        let objIndex = cart.findIndex((obj => obj.id === p.id));
        cart[objIndex].quantity = cart[objIndex].quantity
        let sum = 0;
        cart.forEach(element => {
            sum = sum + (element.totalAmount * element.quantity);
        });
        console.log("subtotal")
        console.log(sum)
        console.log("after update")
        console.log(cart)
        setSubTotal(sum)
    }

    let FinalTaxes = subTotal * taxRate / 100;
    useEffect(() => {
        fetchProducts(0)
        fetchCategories()
    }, []);

    useEffect(() => {
        console.log("cart changed")
        console.log(cart)
        cart.map(e => {
            document.getElementById("qty_" + e.id).value = e.quantity
            document.getElementById("price_" + e.id).value = e.totalAmount
            let sum = 0;
        cart.forEach(element => {
            sum = sum + (element.totalAmount * element.quantity);
        });
        console.log("subtotal")
        console.log(sum)
        setSubTotal(sum)
        })
    }, [cart]);

    useEffect(() => {
        console.log(selectedCategory)
        if (selectedCategory === 0) {
            setShowenProducts(products)
        } else {
            setShowenProducts(products.filter((item) => item.category.indexOf(selectedCategory) !== -1))
        }
    }, [selectedCategory])


  return (
    <div className='row col-11'>
        <div className="col-9">
  <div className="demo-content bg-alt">
    <div className="row top-part">
      <div className="col-8" style={{paddingLeft: '10px'}}>
        <h2 style={{fontWeight: 'bold', fontSize: '30px'}}>Bonjour, Youssef!</h2>
        <h5 style={{fontSize: '23px', lineHeight: 0}}>Créez une nouvelle commande</h5>
      </div>
      <div className="col-4" style={{position: 'relative'}}>
        <input onChange={event => setQuery(event.target.value)} className="inputSearch" placeholder="Rechercher ici..." />
        <i className="fa fa-search icon errspan" />
      </div>
    </div>
    <div className="buttons">
        {categories.map(category => {
            return <button key={category.id} onClick={() => {
                setSelectedCategory(category.id)
            }} className={`categoryBtn ${category.id === selectedCategory ? "active" : ""} `}><i className={`fa-solid ${category.icon}`} style={{marginRight: '0.7rem'}} />{category.name}</button>
        })}
    </div>
    <br />
    <div className="row middleContent">
        {showenProducts.filter(post => {
            if (query === '') {
                return post;
            } else if (post.name.toLowerCase().includes(query.toLowerCase())) {
                return post;
            }
        }).map(product => {
            return (
                <div key={product.id} className="flex-container col-3">
                    <div className="image">
                    <img src={product.image} alt="Avatar" className="thumbnail" style={{width: '100%'}} />
                    <div className="productName">
                        {product.name}
                    </div>
                    </div>
                    <div className="middle">
                    <ul onClick={() => {
                        addProductToCart(product)
                        }} className="button">Ajouter à la commande</ul>
                    </div>
                </div>
            );
        })}
    </div>
  </div>
</div>
<div className="col-3 d-flex flex-nowrap b-example-vr">
  <div style={{width: '100%'}} className="d-flex  flex-column flex-shrink-0 bg-light">
    <div className="clearfix">
      <div className="top-part">
        <div className="row">
          <div className="col-12">
            <h2 style={{fontWeight: 'bold', fontSize: '30px', lineHeight: '0.9'}}>Détails de la commande</h2>
          </div>
        </div>
        <table id="container" style={{height: '80vh', width: "100%"}}>
          <tbody><tr>
              <td style={{overflow: 'auto', height: '50px'}} valign="top">
                {cart.map(singleProduct => {
                    return (
                        <div className="singleProduct">
                            <div className style={{maxWidth: '500px'}}>
                                <div className="row g-0" style={{position: 'relative'}}>
                                <div className="col-sm-5">
                                    <img src={singleProduct.image} className="card-img-top h-100" alt="..." />
                                </div>
                                <div className="col-sm-7 text-center">
                                    <div className="card-body">
                                    <div className="row">
                                    </div><table className="tg">
                                        <thead>
                                        <tr>
                                            
                                            <th className="tg-0lax card-title productTitle" style={{padding: '0.5rem'}} colSpan={2}>{singleProduct.name}</th>
                                        </tr>
                                        </thead>
                                        <tbody className="card-body">
                                        
                                        
                                        <tr className="col-5 qtyContainer">
                                            <td className="tg-0lax">Quantité:</td>
                                            <td className="tg-0lax"><input id={"qty_" + singleProduct.id} type="number" defaultValue={singleProduct.quantity} onChange={(evt) => { refreshQuantity(evt, singleProduct); }} className="qty " placeholder="Qty:" /></td>
                                        </tr>
                                        <tr className="col-5 priceContainer">
                                            <td className="tg-0lax">Prix:</td>
                                            <td className="tg-0lax"><input id={"price_" + singleProduct.id} type="number" defaultValue="0" onChange={(evt) => { refreshSubtotal(evt, singleProduct) }} className="qty " placeholder="TND" /></td>
                                        </tr>
                                        </tbody>
                                        <span className="removeProduct" onClick={() => {
                                                const newCart = cart.filter(item => item.id !== singleProduct.id);
                                                console.log("new cart after delete")
                                                console.log(newCart)
                                                let sum = 0;
                                                
                                                setCart(newCart)
                                                setSubTotal(sum)
                                                console.log(subTotal)
                                                cart.forEach(element => {
                                                    console.log("name" + element.name)
                                                    console.log("prix" + element.totalAmount)
                                                    console.log("qty" +element.quantity)
                                                    sum = sum + (element.totalAmount * element.quantity);
                                                });
                                            }}>x</span>
                                    </table>
                                    </div>
                                </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
              </td>
            </tr>
            <tr style={{position: 'sticky', bottom: 0}}>
              <td valign="bottom">
                <div className="calculatrice">
                  <div className="sub">
                    <table style={{width: '100%'}}>
                      <tbody>
                        <tr>
                          <td>&nbsp;Subtotal:</td>
                          <td style={{textAlign: 'right'}}>&nbsp;{subTotal} TND
                          </td>
                        </tr>
                        <tr>
                          <td>&nbsp;Taxes</td>
                          <td style={{textAlign: 'right'}}>&nbsp;{FinalTaxes} TND</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div className="total">
                    <table style={{width: '100%'}}>
                      <tbody>
                        <tr>
                          <td>&nbsp;Total:</td>
                          <td style={{textAlign: 'right'}}>&nbsp;{subTotal + FinalTaxes}TND</td>
                        </tr>
                        <tr>
                        </tr></tbody>
                    </table>
                  </div>
                  <div className="text-center" style={{width: '100%'}}>
                    <button className="buynow">Achetez maintenant</button>
                  </div>
                </div>
              </td>
            </tr>
          </tbody></table>  
      </div>
    </div>
  </div>
</div>
</div>
  )
}
