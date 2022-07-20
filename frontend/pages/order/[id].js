import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import Map from '../../components/Profile/Map'
import ProgressBar from '../../components/Profile/ProgressBar'
import { SidebarContext } from '../../hocs/Layout'
import { parseCookies } from '../../lib/parseCookies'
import UserService from '../../services/userService'
import styles from "../../styles/pages/Order.module.scss"

const Order = ({ data }) => {
    const router = useRouter()
    const isSide = React.useContext(SidebarContext)
    console.log(data)
    let address = data.delivery.address
    const parsePhone=(phone)=>{
        const i = phone.substr(phone.length - 10);
        const v = phone.substr(0, (phone.length - i.length))
        return `${v} ${i}`
    }
    const formatDate=(date)=>{
        let i = new Date(date)
        return i.toString().substring(0,16)
    }
    const formatDelDate=(date)=>{
        let i = new Date(date)
        return i.toString().substring(3,10)
    }
    const title = status =>{
        return status === "Order Received" ? "We are processing your order" :
        status === "Processed" ? "Waiting for Shipping Process":
        status === "Shipped" ? "Item Shipped, will be out for delivery":
        status === "Out for Delivery" ? "Arriving Soon" :
        status === "Delivered" ? "You have the product":
        status === "Refund Asked" ? "OnGoing Refund Process" :
        status === "Refunded" ? "Item Refunded" :
        "IDK"
    }
    const getData=()=>{
        let progress;
        data.status === "Refund Asked" || data.status === "Refund Asked" ? progress = ["Refund Asked","Refunded"] :
        progress = ["Order Received","Processed","Shipped","Out for Delivery","Delivered"]
        return progress
    }
    const determinePrice = (price,quantity) => {
        return price * quantity;
    }
    const determineSubtotal = (total,delivery) => {
        return Math.round((parseFloat(total)-parseFloat(delivery))*100) /100
    }   
    console.log(data)
  return (
    <div className={`${styles.order} ${!isSide && styles.side}`}>
        <Head>
            <title>Raven | Order # {data.order_id}</title>
        </Head>
        <h1>Order # {data.order_id}</h1>
        <p>Ordered Date:- {formatDate(data.ordered_date)}</p>
        <Map delivery={data.delivery}/>

        <div className={styles.status}>
            <h4>Delivery in Process</h4>
            <h2>{title(data.status)}</h2>
            <span className={styles.actions}>
                <p onClick={()=> router.push(`/user/refund?id=${data.refund_id}`)}>Refund Order</p>&nbsp;
                <a href={data.receipt} download="receipt">Download Receipt</a>
            </span>
            <br/>
            <h3>{address.street_address}</h3>
            <h4>{address.apartment_address} - {address.city}</h4>
            <h5>{address.state}, {address.country} - {address.pincode}</h5>
            <p>{parsePhone(address.phone_no)}</p>

            <ProgressBar status={data.status} data={getData()}/>
            <p className={styles.est}>{formatDelDate(data.delivery.delivery_date)}</p>
            <p className={styles.ordered}>{formatDelDate(data.ordered_date)}</p>

            {data.items && data.items.map(item=>{
                const product = item.product
                const prefix = "http://localhost:8000"
                return <span className={styles.item}>
                    <img src={`${prefix}${item.product.image}`}/>
                    <span>
                        <h3 onClick={()=> router.push(`/product/${product.slug}`)}>{product.name}</h3>
                        <p>{product.category}</p>
                        <button>Buy Again</button>
                    </span>
                    <p>Qty: {item.quantity}</p>
                    <p>&#36;{determinePrice(product.discount_price || item.price, item.quantity)}</p>
                </span>
            })}
        </div>

        <div className={styles.receipt}>
            <div>
                <span>
                    <h5>Subtotal</h5>
                    <h5>&#36;{determineSubtotal(data.total_price,data.delivery.delivery_charge)}</h5>
                </span>
                <span>
                    <h5>Delivery</h5>
                    <h5>&#36;{data.delivery.delivery_charge}</h5>
                </span>
                <span>
                    <h4>Total</h4>
                    <h4>&#36;{data.total_price}</h4>
                </span>
            </div>
        </div>

    </div>
  )
}

export async function getServerSideProps({ req,params }) {
    const token = parseCookies(req).token
    const res = await UserService.getOrders(token,params.id)

    return {
        props:{
            data:res || {}
        }
    }
}

export default Order