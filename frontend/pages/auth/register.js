import Head from "next/head"
import { useRouter } from "next/router"
import Link from "next/link"
import { register } from "../../redux/reducers/auth"
import { useDispatch } from "react-redux"
import { useContext, useState } from "react"
import styles from '../../styles/pages/auth/Register.module.scss'
import { SidebarContext } from '../../hocs/Layout'
const Register = () => {
    const router = useRouter()
    const isSide = useContext(SidebarContext)
    const dispatch = useDispatch()
    const [data,setData] = useState({
        first_name:"",
        last_name:"",
        username:"",
        email:"",
        password:"",
        re_password:""
    })
    const { first_name,last_name,username,password,email,re_password } = data
    const onChange = (e) => setData({...data,[e.target.name]:e.target.value});
    const onSubmit = (e) =>{
        e.preventDefault();
        dispatch(register({first_name,last_name,username,email,password}))
        router.reload()
        router.push("/")
    }
  return (
    <div className={`${styles.register} ${!isSide && styles.side}`}>
        <h1>Register</h1>
        <Head>
            <title>Raven | Register</title>
        </Head>
        <div>
            <span>
                <img src="/images/register.svg"/>
            </span>
            <span>
                <h3>Create a new account</h3>
                <form onSubmit={onSubmit}>
                    <input value={first_name} onChange={onChange} name="first_name" id="first_name" placeholder="First Name" />
                    
                    <input value={last_name} onChange={onChange} name="last_name" id="last_name" placeholder="Last Name" />
                    
                    <input value={username} onChange={onChange} name="username" id="username" placeholder="Username" />
                    
                    <input value={email} onChange={onChange} type="email" name="email" id="email" placeholder="Email" />
                    
                    <input value={password} onChange={onChange} type="password" name="password" id="password" placeholder="Password" />
                    
                    <input value={re_password} onChange={onChange} type="password" name="re_password" id="re_password" placeholder="Re Password" />

                    <button type="submit">Register</button>
                </form>
                <p>Already have an account? <Link href="/auth/login">Login</Link></p>
                <p>Forgot your password? <Link href="/auth/forgot">Reset Password</Link></p>
            </span>
        </div>
    </div>
  )
}

export default Register