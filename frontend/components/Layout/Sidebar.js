import React from 'react'
import { useRouter } from 'next/router'
import styles from '../../styles/components/Layout/Sidebar.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faCartShopping, faHome, faUser,faMobileButton,faBook,
  faShirt,faUtensils, faPalette,faChessKnight,faTvAlt,faSuitcase } from '@fortawesome/free-solid-svg-icons'
const Sidebar = ({ sideBar }) => {
  const router = useRouter()
  const [showCat,setShowCat] = React.useState(false)
    const to =link=> router.push(`/category/${link}`)
  const allCat = (
    <div className={`${!showCat && styles.hide} ${styles.categories}`}>
      <div onClick={()=>to("tech")}><p><FontAwesomeIcon icon={faMobileButton} /> Technology</p></div>
      <div onClick={()=>to("books")}><p><FontAwesomeIcon icon={faBook} /> Books</p></div>
      <div onClick={()=>to("apparel")}><p><FontAwesomeIcon icon={faShirt} /> Apparel</p></div>
      <div onClick={()=>to("h&k")}><p><FontAwesomeIcon icon={faUtensils} />  Kitchen</p></div>
      <div onClick={()=>to("beauty")}><p><FontAwesomeIcon icon={faPalette} /> Beauty</p></div>
      <div onClick={()=>to("t&g")}><p><FontAwesomeIcon icon={faChessKnight} /> Games</p></div>
      <div onClick={()=>to("home")}><p><FontAwesomeIcon icon={faTvAlt} /> Home</p></div>
      <div onClick={()=>to("luggage")}><p><FontAwesomeIcon icon={faSuitcase} /> Luggage</p></div>
    </div>
  )
  return (
    <div className={`${styles.sidebar} ${!sideBar ? styles.no : styles.show}`}>
      <div>
        <div onClick={()=> router.push("/")}>
          <h2><FontAwesomeIcon icon={faHome} />&nbsp;Home</h2>
        </div>
        <div onClick={()=> router.push("/profile")}>
          <h2><FontAwesomeIcon icon={faUser} /> Profile</h2>
        </div>
        <div onClick={()=> router.push("/cart")}>
          <h2><FontAwesomeIcon icon={faCartShopping} /> Cart</h2>
        </div>
        <div onClick={()=>{setShowCat(!showCat)}}>
          <h2><FontAwesomeIcon icon={faArrowDown} /> Category</h2>
        </div>
      </div>
      {allCat}
    </div>
  )
}

export default Sidebar