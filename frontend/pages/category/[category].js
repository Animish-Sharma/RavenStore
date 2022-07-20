import React from 'react'
import Head from 'next/head'
import styles from '../../styles/pages/Category.module.scss'
import Card from '../../components/Product/Card'
import { SidebarContext } from "../../hocs/Layout"
import ProductService from '../../services/productService'
import { parseCookies } from '../../lib/parseCookies'
const Category = ({ data,category,token }) => {
  const isSide = React.useContext(SidebarContext)
  return (
    <div className={`${styles.category} ${!isSide && styles.side}`}>
        <Head>
            <title>Raven | {data.results ? data.results[0].category : category}</title>
        </Head>
        <h1>{data.results ? data.results[0].category : category}</h1>
        {data.results && <Card data={data.results} token={token} side={isSide}/>}
        {!data.results && <div className={styles.noItem}>
            <h2>No Products found of {category}</h2>
            </div>}
    </div>
  )
}

export async function getServerSideProps({ params,req }){
    const res = await ProductService.getCategoryProduct(params.category)
    const token = parseCookies(req).token
    return { 
        props:{
            data: res || {},
            category: params.category,
            token:token ||""
        }
    }
}

export default Category