import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import styles from '../styles/pages/Checkout.module.scss'
import { SidebarContext } from '../hocs/Layout'
import { parseCookies } from '../lib/parseCookies'
import UserService from "../services/userService";
import OrderService from "../services/orderService";

const Checkout = ({ address,cart,token }) => {
    const isSide = React.useContext(SidebarContext)
    const [coupon,setCoupon] = React.useState("")
    const router= useRouter();
    const parsePhone=(phone)=>{
        const i = phone.substr(phone.length - 10);
        const v = phone.substr(0, (phone.length - i.length))
        return `${v} ${i}`
    }
    const couponAction=async(e,coupon,action)=>{
        if(action === "add") {e.preventDefault(); await OrderService.addCoupon(coupon,token);}
        else if(action === "remove"){e.preventDefault(); await OrderService.removeCoupon(token);}
        else router.push("/cart")
        router.replace(router.asPath);
    }
  return (
    <div className={`${styles.checkout} ${!isSide && styles.side}`}>
        <Head>
            <title>Raven | Checkout</title>
        </Head>
        <h1>Checkout</h1>
        <h3>Total: &#36;{cart.total}</h3>
        <div>
            <span>
                <h2>Deliver To:</h2>
                <h3>{address.street_address}</h3>
                <h4>{address.apartment_address}</h4>
                <h5>{address.city}</h5>
                <p>{address.state}, {address.country} - {address.pincode}</p>
                <p>Phone: {parsePhone(address.phone_no)}</p>
            </span>
            {cart.coupon === "" && <form onSubmit={(e)=>couponAction(e,coupon,"add")}>
                <h2>Add a Coupon</h2>
                <input value={coupon} onChange={e=> setCoupon(e.target.value)} name="coupon" placeholder="Coupon" />
                <button type="submit">Submit</button>    
            </form>}
            {cart.coupon !== "" && <form onSubmit={(e)=>couponAction(e,coupon,"remove")}>
                <h2>Coupon Applied</h2>
                <h4 className={styles.coupon}>Coupon: {cart.coupon}</h4>
                <button  type="submit">Remove</button>
            </form>}
        </div>
        <button onClick={()=> router.push("/payment")}>Proceed to Payment</button>
    </div>
  )
}

export async function getServerSideProps({req}){
    const token = parseCookies(req).token
    const res = await UserService.fetchAddress(token)
    const response = await OrderService.fetchCart(token)
    return {
        props:{
            address: res.success || {},
            cart:response,
            token
        }
    }
};
export default Checkout