import Head from 'next/head'
import styles from '../../styles/pages/auth/Forgot.module.scss'
import React from 'react'
import { LoadingContext, SidebarContext } from '../../hocs/Layout'
import axios from 'axios'
import { useRouter } from "next/router"
const Forgot = () => {
    const router = useRouter();
    const [email,setEmail] = React.useState("");
    const { setLoading } = React.useContext(LoadingContext)
    const isSide = React.useContext(SidebarContext);
    const onSubmit = async(e) =>{
        e.preventDefault()
        setLoading(true)
        const config={headers:{"Content-Type":"application/json"}}
        const body = JSON.stringify({ email })
        await axios.post("http://localhost:8000/api/password/confirm/",body,config)
        setLoading(false)
        router.push("/auth/reset")
    }
  return (
    <div className={`${styles.forgot} ${!isSide && styles.side}`}>
        <Head>
            <title>Raven | Forgot Password</title>
        </Head>
        <h1>Forgot Password</h1>
        <img src="/images/forgot.svg"/>
        <h4>Forgot your password?</h4>
        <input value={email} onChange={(e)=> setEmail(e.target.value)} placeholder="Enter your email" />
        <button onClick={(e)=> onSubmit(e)}>Submit</button>
    </div>
  )
}

export default Forgot