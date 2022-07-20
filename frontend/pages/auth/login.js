import Head from 'next/head'
import styles from '../../styles/pages/auth/Login.module.scss'
import { useState,useContext, useEffect } from 'react'
import { LoadingContext, SidebarContext } from '../../hocs/Layout'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { login } from '../../redux/reducers/auth' 
import { useDispatch } from 'react-redux'
import { parseCookies } from '../../lib/parseCookies'

const Login = ({ token }) => {
    const isSide = useContext(SidebarContext)
    const { setLoading } = useContext(LoadingContext)
    const dispatch = useDispatch()
    const router = useRouter();
    const [data,setData] = useState({
        username:"as",
        password:"password"
    })
    const { username,password } = data
    const onChange = (e) => setData({...data,[e.target.name]:e.target.value});
    const onSubmit = async e =>{
        e.preventDefault();
        setLoading(true)
        dispatch(login({ username,password }))
        setLoading(false)
        setTimeout(() => {
            router.reload()
        }, 1000);
    }
    useEffect(()=>{
        if(token){
            router.push("/")
        }
    },[token])
  return (
      <div className={`${styles.login} ${!isSide && styles.side}`}>
        <h1>Login</h1>
        <Head>
            <title>Raven | Login</title>
        </Head>
        <div>
            <div>
                <img title="BRUH! Login" alt={"Login Pic"} src={"/images/login.svg"} />
            </div>
            <div className={styles.formContainer}>
                <h3>Login to your account</h3>
                <form onSubmit={onSubmit}>
                    <div>
                        <label htmlFor="username">Username</label>
                        <input value={username} onChange={onChange} name="username" id="username" placeholder="Username" />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input value={password} onChange={onChange} type="password" name="password" id="password" placeholder="Password" />
                    </div>
                    <button type="submit">Login</button>
                </form>
                <p>Don't have an account? <Link href="/auth/register">Register</Link></p>
                <p>Forgot your password? <Link href="/auth/forgot">Reset Password</Link></p>
            </div>
        </div>
    </div>
  )
}

export function getServerSideProps({ req }){
    const token = parseCookies(req).token || ""
    return {
        props:{
            token
        }
    }
}

export default Login