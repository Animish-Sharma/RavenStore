import { faCartPlus, faHeart } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { useRouter } from 'next/router'
import styles from "../../styles/components/Product/Card.module.scss"
import OrderService from '../../services/orderService'
import UserService from '../../services/userService'
const Card = ({ data,side,token }) => {
    
    const router = useRouter()
    const getOff = (discount,price)=>{
        let i = price-discount
        return Math.round((i*100)/price)
    }
    const addToCart = async (e,slug) =>{
        e.stopPropagation();
        await OrderService.addToCart(slug,token)
        router.replace(router.asPath);
    }
    const addToFav = async (e,slug) =>{
        e.stopPropagation();
        await UserService.addToFav(slug,token)
        router.replace(router.asPath);
    }
    function getItems() {
        let list = [];
        let listResult = [];
        data.map((item) => {
            return list.push(
                <div onClick={()=> router.push(`/product/${item.slug}`)} title={item.name} key={item.id} className={styles.item}>
                    <img src={`http://localhost:8000${item.image}`} />
                    <h2>{item.name}</h2>
                    <div onClick={(e)=> addToFav(e,item.slug)} title="Add to Favorites">
                        <FontAwesomeIcon className={styles.heart} icon={faHeart}/>
                    </div>
                    <span>
                        {item.discount_price ? <strike>&#36;{item.price}</strike>: <p>&#36;{item.price}</p>}
                        <p>Category:- {item.category}</p>
                    </span>
                    <span>
                        {item.discount_price && <p>&#36;{item.discount_price}</p>}
                        <p className={styles.off}>{getOff(item.discount_price,item.price)}% off</p>
                    </span>
                    <button onClick={e=>addToCart(e,item.slug)}>
                        <FontAwesomeIcon icon={faCartPlus} />
                        Add To Cart
                    </button>
                </div>
            )
        });
        for(let i = 0; i < list.length; i+= 3){
            listResult.push(
                <div key={i} className={`${styles.card} ${side && styles.isSide}`}>
                    <div className={list[i+2] ? styles.three : list[i+1] ? styles.two : list[i] && styles.one}>
                        {list[i]}
                    </div>
                    <div className={list[i+2] ? styles.three : list[i+1] && styles.two}>
                        {list[i+1] ? list[i+1] : null}
                    </div>
                    <div className={list[i+2] ? styles.three : styles.two}>
                        {list[i+2] ? list[i+2] : null}
                    </div>
                </div>
            );
        }
        return listResult;
    }
  return (
    <div>{getItems()}</div>
  )
}

export default Card