import React from 'react'
import ProductService from "../../services/productService"
import styles from '../../styles/pages/Product.module.scss'
import Carousel from '../../components/Product/Carousel'
import Head from 'next/head'
import { SidebarContext,LoadingContext } from '../../hocs/Layout'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartShopping, faCreditCardAlt, faHeart } from '@fortawesome/free-solid-svg-icons'
import Review from '../../components/Product/Review'
import OrderService from '../../services/orderService'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import UserService from '../../services/userService'
const Product = ({ product,reviews }) => {
    const isSide = React.useContext(SidebarContext)
    const router = useRouter()
    const isAuth = useSelector(state=> state.auth.isAuthenticated)
    const token = isAuth && useSelector(state=> state.auth.token)
    const { setLoading } = React.useContext(LoadingContext)
    const getOff = (discount=0,price)=>{
        let i = price-discount
        return Math.round((i*100)/price)
    }
    const getDescription=()=>{
        return {__html: product.description}
    }
    const bN =async (slug) =>{
        setLoading(true)
        const res = await OrderService.buyNow(token,slug);
        setLoading(false)
        res && toast("Item Added to Cart and Redirected to Checkout",{style:{textAlign:"center"}})
        router.push("/checkout")
    }
    const addToCart =async (slug) => await OrderService.addToCart(slug,token);
    const addToFav =async (slug) => await UserService.addToFav(slug,token);
  return (
    <div className={`${styles.product} ${!isSide && styles.side}`}>
        <Head>
            <title>Raven | {product.name}</title>
        </Head>
        <h1>
            {product.name}
            <FontAwesomeIcon onClick={()=> addToFav(product.slug)} className={styles.heart} icon={faHeart}/>
        </h1>
        <div>
            <Carousel product={product}/>
            <div>
                <span>
                    {product.discount_price ? <strike>Price:- &#36;{product.price}</strike>: <p>Price:- &#36;{product.price}</p>}
                    <p className={styles.off}>{getOff(product.discount_price,product.price)}% off</p>
                </span>
                <span>
                    {product.discount_price && <p>Discount Price:- &#36;{product.discount_price}</p>}
                    <p>Category:- {product.category}</p>
                </span>
                <div className={styles.description} dangerouslySetInnerHTML={getDescription()}/>
                <div className={styles.buttons}>
                    <button onClick={()=> bN(product.slug)}>
                        <FontAwesomeIcon icon={faCreditCardAlt}/> Buy Now
                    </button>
                    <button onClick={()=> addToCart(product.slug)}>
                        <FontAwesomeIcon icon={faCartShopping}/> Add to Cart
                    </button>
                </div>
            </div>
        </div>
        <Review product={product} reviews={reviews} />
    </div>
  )
}
export async function getStaticPaths(){
    const paths =  await ProductService.fetchProductPaths();
    return { paths,fallback:false }
}
export async function getStaticProps({ params }) {
    const data = await ProductService.fetchProduct(params.slug)
    return { props: { product:data.product,reviews:data.reviews } }
}

export default Product