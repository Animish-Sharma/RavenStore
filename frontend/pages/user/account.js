import React from 'react'
import { SidebarContext } from '../../hocs/Layout';
import { faHome,faTrash } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Head from "next/head"
import styles from "../../styles/pages/user/Account.module.scss";
import { useDispatch, useSelector } from 'react-redux';
import { deleteAcc } from '../../redux/reducers/auth';
import toast from 'react-hot-toast';
const Account = () => {
    const isSide = React.useContext(SidebarContext)
    const token = useSelector(state=> state.auth.token)
    const [password,setPassword] = React.useState("")
    const dispatch = useDispatch()
    const router = useRouter()
    const onSubmit = async e =>{
        if (password !== ""){
            dispatch(deleteAcc({ token,password }))
        } else {
            toast.error("Password cannot be empty")
        }
    }
  return (
    <div className={`${styles.account} ${!isSide && styles.side}`}>
        <Head>
            <title>Raven | Delete Account</title>
        </Head>
        <h1>Delete Account</h1>
        <img src="/images/delete.svg"/>
        <h4>Enter your password and delete your account</h4>
        <input value={password} onChange={(e)=> setPassword(e.target.value)} placeholder="Password" name="password" />
        <span>
            <button onClick={()=> router.push("/")}><FontAwesomeIcon icon={faHome}/> Home</button>
            <button onClick={(e)=> onSubmit(e)}><FontAwesomeIcon icon={faTrash}/> Delete</button>
        </span>
    </div>
  )
}

export default Account