import styles from "../../styles/components/Layout/Navbar.module.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useSelector } from 'react-redux'
import { faMagnifyingGlass,faTimes, faBars } from '@fortawesome/free-solid-svg-icons'
import React from "react"
import { useRouter } from 'next/router'
import Link from "next/link"
const Navbar = (props) => {
    const router= useRouter()
    const [showSearch,setShowSearch] = React.useState(false)
    const isAuthenticated = useSelector(state=> state.auth.isAuthenticated)
    const [showSide,setShowSide] = React.useState(true)
    const [field,setField] = React.useState("")
    React.useEffect(()=>{
        props.side(showSide)
    },[showSide])
    const authLinks =(
        <div>
            <Link href="/auth/logout">Logout</Link>
        </div>
    )
    const guestLinks = (
        <div>
            <Link href="/auth/login">Login &nbsp;</Link>
            <Link href="/auth/signup">Register</Link>
        </div>
    )
    const handleKeyPress = (e) =>{
        if(e.key === 'Enter'){
            router.push(`/search?query=${field}`)
        }
    }
  return (
    <div className={styles.nav}>
        <div >
            <FontAwesomeIcon onClick={(e)=> {e.stopPropagation();setShowSide(!showSide)}} className={styles.side} icon={showSide ? faTimes : faBars}/>
            <h1 onClick={()=> router.push("/")} className={styles.title}>Raven</h1>
        </div>
        <div>
            <span>
                <input onKeyPress={handleKeyPress} value={field} onChange={e=>setField(e.target.value)} className={showSearch ? styles.show : styles.hide} placeholder="Search" />
                <h5 onClick={()=>setShowSearch(!showSearch)}><FontAwesomeIcon icon={faMagnifyingGlass}/></h5>
            </span>
            <span>
                {isAuthenticated ? authLinks : guestLinks}

            </span>
        </div>
    </div>
  )
}

export default Navbar