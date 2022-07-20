import React from 'react'
import UserService from '../../services/userService';
import { useRouter } from 'next/router'
import styles from "../../styles/components/Profile/Orders.module.scss"
const Orders = ({ token }) => {
  const [orders,setOrders] = React.useState([])
  const router = useRouter()
  React.useEffect(()=>{
    const getData= async()=>{
      const res = await UserService.fetchOrders(token);
      setOrders(res.orders)
    }
    getData()
  },[]);
  const formatDate=(date)=>{
    let i = new Date(date)
    return i.toString().substring(0,16)
}
  return (
    <div className={styles.orders}>
      <h1>My Orders</h1>
      {orders && orders.map((order,idx)=>{
        return <span onClick={()=>router.push(`/order/${order.id}`)}>
          <h3>&nbsp;{idx + 1}.</h3>
          <img src={order.items[0] && `http://localhost:8000${order.items[0].product.image}`}/>
          <h3>Ordered on {formatDate(order.ordered_date)}</h3>

          <button onClick={()=> router.push(`http://localhost:8000${order.receipt}`)}>Download Receipt</button>
        </span>
      })}
    </div>
  )
}

export default Orders