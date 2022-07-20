import React from 'react'
import { SidebarContext } from '../hocs/Layout'
import styles from "../styles/pages/Cart.module.scss"
import { parseCookies } from "../lib/parseCookies"
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import OrderService from '../services/orderService'
import { faCartShopping, faMinus, faPaperPlane, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import Head from 'next/head'
const Cart = ({ data,token }) => {
    const isSide = React.useContext(SidebarContext)
    const router= useRouter();
    console.log(data)

    const cartActions = async (slug="",action="") =>{
        action === "add" ? await OrderService.addToCart(slug,token)
        : action === "remove" ? await OrderService.removeFromCart(slug,token) 
        : action === "clear" ? await OrderService.clearCart(token)
        : action === "item" ? await OrderService.deleteItem(token,slug)
        :null
        router.replace(router.asPath);
    }
  return (
    <div className={`${styles.cart} ${!isSide && styles.side}`}>
        <Head>
            <title>Raven | Cart </title>
        </Head>
        <h1><FontAwesomeIcon className={styles.icon} icon={faCartShopping}/> Cart</h1>
        {data.items && <div>
            <div>
                <span>
                    <h3>Product </h3>
                    <h3>Quantity </h3>
                    <h3>Total </h3>
                </span>
                {data.items.map((item) =>{
                    const slug = item.product.slug
                    return <span key={item.id}>
                        <img title={item.product.name} onClick={()=>router.push(`/product/${slug}`)} src={`http://localhost:8000${item.product.image}`}/>
                        <span title={item.product.name} onClick={()=>router.push(`/product/${slug}`)} >
                            <h4>{item.product.name} <FontAwesomeIcon onClick={e=>{e.stopPropagation(); cartActions(slug,"item")}} className={styles.deleteIcon} icon={faTrash}/></h4>
                            <p>Price: &#36;{item.product.price}</p>
                            <p>Discount Price: &#36;{item.product.discount_price}</p>
                        </span>
                        <span className={styles.quantity}>
                            <FontAwesomeIcon onClick={()=> cartActions(slug,"remove")} className={styles.mode} icon={faMinus} />
                            <h5>{item.quantity}</h5>
                            <FontAwesomeIcon onClick={()=> cartActions(slug,"add")} className={styles.mode} icon={faPlus} />
                        </span>
                        <span className={styles.total}>
                            <h5>&#36; {item.total_price}</h5>
                            <h5>&#36;&nbsp;-{item.difference}</h5>
                            <h5>&#36; {item.discount_price}</h5>
                        </span>
                    </span>
                })}
                <button onClick={()=> cartActions("","clear")} className={styles.clearCart}><FontAwesomeIcon icon={faPaperPlane}/> Clear Cart</button>
            </div>
            {data.items && <div>
                <h2>Order Summary</h2>
                {data.items.map((item,idx)=>{
                    return <div key={idx}>
                        <h3>{idx + 1}. {item.product.name}</h3>
                        <h5>X {item.quantity}</h5>
                        <p>= $ {item.discount_price || item.total_price}</p>
                    </div>
                })}
                <h5>Est. Total = $ {data.total}</h5>
                <button className={styles.checkoutButton} onClick={()=> router.push("/checkout")}>Proceed to Checkout</button>
            </div>}
        </div>}
        {data.error && <div className={styles.noItem}>
            <img src="/images/cart.svg"/>
            <h4>No items in the cart, why don't you add some?</h4>
            <button onClick={()=> router.push("/")}>Home</button>    
        </div>}
    </div>
  )
}

export async function getServerSideProps({req}){
    const token = parseCookies(req).token
    const response = await OrderService.fetchCart(token)
    return {
        props:{
            data:response,
            token
        }
    }
};

export default Cart