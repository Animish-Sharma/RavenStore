import React from 'react'
import Head from 'next/head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { SidebarContext } from '../../hocs/Layout';
import styles from '../../styles/pages/user/Fav.module.scss'
import { faCartPlus, faDeleteLeft, faHeart, faHeartBroken, faPaperPlane, faTrash } from '@fortawesome/free-solid-svg-icons'
import { parseCookies } from '../../lib/parseCookies';
import UserService from '../../services/userService';
import { useRouter } from 'next/router';
import OrderService from '../../services/orderService';
import toast from 'react-hot-toast';
const fav = ({ data,token }) => {
  const router = useRouter()
  const isSide = React.useContext(SidebarContext);

  const addToCart = async (e,slug,title) =>{
    e.stopPropagation();
    await OrderService.addToCart(slug,token)
    toast.success(`${title} added to cart`)
  }
  const removeItem = async (e,slug) =>{
    e.stopPropagation();
    await UserService.removeFromFav(slug,token)
    router.replace(router.asPath)
  }
  const emptyFav = async (e) =>{
    e.stopPropagation();
    await UserService.clearFav(token)
    router.replace(router.asPath)
  }
  return (
    <div className={`${styles.fav} ${!isSide && styles.side}`}>
        <FontAwesomeIcon className={styles.heart} icon={faHeart}/>
        <h1>My Favorites</h1>
        <Head>
          <title>Raven | Favorites</title>
        </Head>
        {data.items && <div>
          <span>
            <h3>Product </h3>
            <h3>Unit Price</h3>
            <h3>Status</h3>
            <h3></h3>
          </span>
          {data.items.map((item) =>{
            const slug = item.product.slug
            return <span key={item.id}>
                <img title={item.product.name} onClick={()=>router.push(`/product/${slug}`)} src={`http://localhost:8000${item.product.image}`}/>
                <span title={item.product.name} onClick={()=>router.push(`/product/${slug}`)} >
                    <h4>{item.product.name} <FontAwesomeIcon onClick={(e)=> removeItem(e,slug)} className={styles.deleteIcon} icon={faTrash}/></h4>
                </span>
                <span className={styles.price}>
                    {item.product.discount_price && <strike>{item.product.price}</strike>}
                    {item.product.discount_price && <h5>{item.product.discount_price}</h5>}
                    {!item.product.discount_price && <h5>{item.product.price}</h5>}
                </span>
                <span className={styles.total}>
                  <h5>In Stock</h5>
                </span>
                <span onClick={(e)=> addToCart(e,slug,item.product.name)} className={styles.holder}>
                  <button>
                    <FontAwesomeIcon icon={faCartPlus} />
                    Add to Cart
                  </button>
                </span>
            </span>
        })}
        <button onClick={(e)=> emptyFav(e)} className={styles.clearCart}><FontAwesomeIcon icon={faHeartBroken}/>Delete Favorites</button>  
        </div>}
        {data.error && <div className={styles.noItem}>
            <img src="/images/fav.svg"/>
            <h4>No Favorite Items found</h4>
            <button onClick={()=> router.push("/")}>Home</button>    
        </div>}
    </div>
  )
}

export async function getServerSideProps({ req }){
  const token = parseCookies(req).token;
  const data = await UserService.fetchFav(token);
  return {
    props:{
      data,
      token
    }
  }
}

export default fav