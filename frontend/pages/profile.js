import React, { useContext, useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/pages/Profile.module.scss'
import User from '../components/Profile/User'
import { SidebarContext } from '../hocs/Layout'
import Update from '../components/Profile/Update'
import Address from '../components/Profile/Address'
import Orders from '../components/Profile/Orders'
import Head from 'next/head'
import { parseCookies } from '../lib/parseCookies'
const Profile = ({ token,currentUser }) => {
    const router= useRouter();
    const isSide = useContext(SidebarContext);
    const [user,setUser] = useState(true);
    const [update,setUpdate] = useState(false);
    const [address,setAddress] = useState(false);
    const [orders,setOrders] = useState(false);
    const { page } = router.query
    React.useEffect(()=>{
        if(page==="user"){
            setUser(true);setUpdate(false);setAddress(false);setOrders(false);
        }else if(page==="update"){
            setUser(false);setUpdate(true);setAddress(false);setOrders(false)
        }else if(page==="address"){
            setUser(false);setUpdate(false);setAddress(true);setOrders(false)
        }else if(page==="orders"){
            setUser(false);setUpdate(false);setAddress(false);setOrders(true)
        }
        else{setUser(true);setUpdate(false);setAddress(false);setOrders(false);}

    },[page])
    const isActive=(title)=>{
        if(title==="user" && user === true){
            return styles.active;
        }
        if(title === "update" && update === true){
            return styles.active;
        }
        if(title === "address" && address === true){
            return styles.active;
        }
        if(title === "orders" && orders === true){
            return styles.active;
        }
        return null;
    }
    const pushPage=name=>{
        router.push(`/profile?page=${name}`);
    }
  return (
    <div className={`${styles.profile} ${!isSide && styles.side}`}>
        <Head>
            <title>Raven | Profile</title>
        </Head>
        <div className={styles.options}>
                <button className={`${isActive("user")} ${styles.bar}`} onClick={()=>pushPage("user")}>USER</button>
                <button className={`${isActive("update")} ${styles.bar}`} onClick={()=>pushPage("update")}>UPDATE</button>
                <button className={`${isActive("address")} ${styles.bar}`} onClick={()=>pushPage("address")}>ADDRESS</button>
                <button className={`${isActive("orders")} ${styles.bar}`} onClick={()=>pushPage("orders")}>ORDERS</button>
            <hr/>
        </div>
        <div className={styles.pages}>
        {user ? <User user={currentUser} /> : update ? <Update /> : address ? <Address token={token} /> : orders ? <Orders token={token}/> : <h1 value="hello world"/>}
        </div>
    </div>
  )
}

export function getServerSideProps({ req }){
    const cookies = parseCookies(req)
    const token = cookies.token;
    const user = JSON.parse(cookies.user);
    return {
        props:{
            token,currentUser:user
        }
    }
}


export default Profile