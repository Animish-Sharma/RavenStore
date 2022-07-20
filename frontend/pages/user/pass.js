import Head from 'next/head';
import React, { useContext } from 'react'
import { useRouter } from 'next/router';
import { SidebarContext } from '../../hocs/Layout';
import { parseCookies } from '../../lib/parseCookies';
import UserService from '../../services/userService';
import styles from "../../styles/pages/user/Pass.module.scss"
import toast from 'react-hot-toast';
const Pass = ({ token }) => {
  const router = useRouter()
  const isSide = useContext(SidebarContext);
  const [data,setData] = React.useState({
    old_password:"",
    password:"",
    re_password:""
  })
  const { old_password,password,re_password } = data
  const onChange = e => setData({...data, [e.target.name]:e.target.value})
  const onSubmit = async e =>{
    e.preventDefault();
    re_password === password ? await UserService.changePassword(token,old_password,password) : toast.error("Passwords are not same");
    router.push('/')
  }
  return (
    <div className={`${styles.pass} ${!isSide && styles.side}`}>
        <h1>Reset your Password</h1>
        <Head>
          <title>Raven | Reset Password</title>
        </Head>
        <div>
            <span>
              <img src="/images/pass.svg"/>
            </span>
            <span>
                <h3>Enter existing and new password here</h3>
                <input onChange={onChange} name="old_password" value={old_password} type="password" placeholder="Old password"/>
                <input onChange={onChange} name="password" value={password} type="password" placeholder="New password"/>
                <input onChange={onChange} name="re_password" value={re_password} type="password" placeholder="Re New password"/>

                <button onClick={onSubmit}>Reset</button>
            </span>
        </div>
    </div>
  )
}

export async function getServerSideProps({ req }){
  const token = parseCookies(req).token;
  return {
    props:{
      token
    }
  }
}

export default Pass