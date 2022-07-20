import Head from 'next/head'
import React, { useContext } from 'react'
import { logout } from '../../redux/reducers/auth'
import { useDispatch, useSelector } from 'react-redux'
import styles from "../../styles/pages/auth/Logout.module.scss"
import { SidebarContext } from '../../hocs/Layout'
import { useRouter } from 'next/router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome,faUserSlash } from '@fortawesome/free-solid-svg-icons'
import { setAlert } from '../../redux/reducers/alert'
const Logout = () => {
    const isSide = useContext(SidebarContext)
    const isAuthenticated = useSelector(state=> state.auth.isAuthenticated)
    const dispatch = useDispatch()
    const router = useRouter();
    React.useEffect(()=>{
        if(!isAuthenticated){
          router.push("/auth/login")
        }
    },[isAuthenticated])
  return (
    <div className={`${styles.logout} ${!isSide && styles.side}`}>
        <Head>
            <title>Raven | Logout</title>
        </Head>
        <h1>Logout</h1>
        <img src="/images/logout.svg"/>
        <h3>Are you sure you want to log out?</h3>
        <span>
            <button onClick={()=> router.push("/")}>
              <FontAwesomeIcon icon={faHome} />
              &nbsp;Home
            </button>
            <button onClick={()=> {dispatch(logout());dispatch(setAlert({message:"Logout Successful",type:"success"}))}}>
              <FontAwesomeIcon icon={faUserSlash}/>
              &nbsp;Logout  
            </button>
        </span>
    </div>
  )
}

export default Logout