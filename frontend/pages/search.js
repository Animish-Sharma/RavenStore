import { useRouter } from 'next/router';
import { useContext } from 'react';
import Card from '../components/Product/Card';
import { SidebarContext } from '../hocs/Layout';
import ProductService from '../services/productService';
import toast from 'react-hot-toast'
import Head from 'next/head';

const Search = ({ products }) => {
    const router = useRouter();
    const isSide = useContext(SidebarContext)
    const { query } = router.query;
    if(!products.results){
        toast.error("No results",{duration:2000})
    }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: isSide ? "81%" : "100%", transition: "all ease .5s"}}>
        <Head>
            <title>Search for {query}</title>
        </Head>
        <h1 style={{ textAlign:"center", fontFamily: "Inter"}}>Search for "{query}"</h1>
        {products.results && <Card data={products.results} side={isSide}/>}
        {!products.results && <h2 style={{ textAlign:"center", fontFamily:"Rubik" }}>No Products with this term </h2>}
    </div>
  )
}

export async function getServerSideProps(context) {
    const { query } = context.query;
    const products = query && await ProductService.searchProduct(query)
    return { 
        props:{
            products: products || {}
        }
    }
}

export default Search