import axios from 'axios'
import Head from 'next/head'
import React from 'react'
import { useRouter } from 'next/router'
import { LoadingContext, SidebarContext } from '../../hocs/Layout'
import styles from '../../styles/pages/auth/Reset.module.scss'
const Reset = () => {
    const isSide = React.useContext(SidebarContext)
    const { setLoading } = React.useContext(LoadingContext)
    const router=  useRouter()
    const [data,setData] = React.useState({
        email:"",
        code:"",
        password:"",
        re_password:"",
    })
    const { email,code,password,re_password } = data;
    const onChange = (e) => setData({...data,[e.target.name]:e.target.value})

    const onSubmit=async(e)=>{
        e.preventDefault()
        setLoading(true)
        const config = {headers:{"Content-Type":"application/json"}}
        const body = JSON.stringify({ email,code,password,re_password })
        const res = await axios.post("http://localhost:8000/api/password/reset/",body,config);
        setLoading(false)
        router.push("/")
    }
  return (
    <div className={`${styles.reset} ${!isSide && styles.side}`}>
        <Head>
            <title>Raven | Reset Password</title>
        </Head>
        <h1>Reset Password</h1>
        <div>
            <span>
                <img src="/images/reset.svg"/>
            </span>
            <span>
                <h4>Reset your password</h4>
                <input type="email" onChange={onChange} value={email} name="email" placeholder="Email"/>
                <input type="number" onChange={onChange} value={code} name="code" placeholder="Code"/>
                <input type="password" onChange={onChange} value={password} name="password" placeholder="Password"/>
                <input type="password" onChange={onChange} value={re_password} name="re_password" placeholder="Re password"/>
                <button onClick={e=>onSubmit(e)}>Reset</button>
            </span>
        </div>
    </div>
  )
}

export default Reset