import Head from 'next/head'
import React from 'react'
import toast from 'react-hot-toast'
import { LoadingContext } from '../../hocs/Layout'
import styles from "../../styles/components/Layout/Loading.module.scss"

const Loading = () => {
  const isSide = React.useContext(LoadingContext)
  return (
    <div className={`${styles.loading} ${!isSide && styles.side}`}>
        <Head>
            <title>Any Shop | Loading</title>
        </Head>
        <div className={styles.loader}></div>
        <h2>Loading....</h2>
    </div>
  )
}

export default Loading