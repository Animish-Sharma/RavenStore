import { faCheckCircle, faDollar, faDollarSign, faHome } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import styles from "../styles/pages/Success.module.scss"
import { SidebarContext } from '../hocs/Layout'
import { useRouter } from "next/router"
import { parseCookies } from '../lib/parseCookies'
import OrderService from '../services/orderService'
import Head from 'next/head'
import Link from 'next/link'
function success({ data }) {
    const isSide = React.useContext(SidebarContext)
    const router = useRouter()
    const formatDate=(date)=>{
        let i = new Date(date)
        return i.toString().substring(0,16)
    }
    const { payment_intent,payment_intent_client_secret,redirect_status } = router.query;
    if(payment_intent_client_secret) router.push(`/success?payment_intent=${payment_intent}&redirect_status=${redirect_status}`)
    return (
        <div className={`${styles.success} ${!isSide && styles.side}`}>
            <Head>
                <title>Raven | Order Completed</title>
            </Head>
            <h1>Order Completed</h1>
            <FontAwesomeIcon className={styles.tick} icon={faCheckCircle} />
            <h4>Your Order is successfully placed, you can see the details <Link href={`/order/${data.order}`}>here</Link></h4>
            <h4>A Receipt is also sent on your mail of your order, if you want a refund Refund ID is listed below </h4>

            <p>Refund ID:- {data.refund_id}</p>
            <p>Est. Delivery Date:- {formatDate(data.delivery_date)}</p>

            <span>
                <button onClick={()=> router.push("/")}> <FontAwesomeIcon icon={faHome}/> Home</button>
                <button onClick={()=> router.push(`/user/refund?refund_id=${data.refund_id}`)}><FontAwesomeIcon icon={faDollarSign}/> Refund</button>
            </span>
        </div>
    )
}

export async function getServerSideProps({ query,req }){
    const token = parseCookies(req).token
    const { payment_intent } = query
    const res = await OrderService.paymentSucess(token,payment_intent) 
    return {
        props:{
            data: res || ""
        }
    }
}

export default success