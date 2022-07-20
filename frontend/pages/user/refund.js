import React from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head';
import styles from "../../styles/pages/user/Refund.module.scss"
import { SidebarContext } from '../../hocs/Layout';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import OrderService from '../../services/orderService';
const refund = () => {
  const router = useRouter();
  const isSide = React.useContext(SidebarContext)
  const token = useSelector(state=> state.auth.token)
  const { id } = router.query
  const [data,setData] = React.useState({
      refund_id: id || "",
      email:"",
      reason:""
  });
  const onChange = (e) => setData({...data,[e.target.name]:e.target.value});
  const { refund_id,email,reason } = data;
  const onSubmit = async(e)=>{
    e.preventDefault();
    if(refund_id.length !== 0) {
        const io = await OrderService.requestRefund(token,refund_id,reason,email)
        if(io === true) {toast.success("Refund Successful"); setTimeout(() => {
            router.push('/')
        }, 1500);} else if(io === false) toast.error("Some Error Occurred")
    } else toast.error("Refund ID can't be empty")
  }
  return (
    <div className={`${styles.refund} ${!isSide && styles.side}`}>
        <Head>
            <title>Raven | Refund</title>
        </Head>
        <h1>Refund</h1>
        <p>Refund your order here {id && `, Order ID:- ${id}`}</p>
        <form onSubmit={onSubmit}>
            <input onChange={onChange} value={refund_id} name="refund_id" placeholder='Refund ID' />
            <textarea onChange={onChange} value={reason} name="reason" placeholder="Reason for Refund" />
            <input onChange={onChange} value={email} name="email" placeholder='Your Email' />
            <button>Refund</button>
        </form>
    </div>
  )
}

export default refund