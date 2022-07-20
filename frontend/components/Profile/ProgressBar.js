import React from 'react'
import styles from "../../styles/components/Product/ProgressBar.module.scss"
import { SidebarContext } from '../../hocs/Layout'
const ProgressBar = ({ status,data }) => {
    const isSide = React.useContext(SidebarContext)
    console.log(data)
    const isActive = name =>{
        let arr = data
        let idx = arr.indexOf(name)
        let active_idx = arr.indexOf(status)

        return active_idx >= idx ? styles.active : null
    }
  return (
    <div className={`${styles.progress} ${!isSide && styles.side}`}>
        <div className={styles.container}>
            <ul className={styles.progressbar}>
                {data && data.map(obj=>{
                    return <li className={isActive(obj)}>{obj}</li>
                })}
            </ul>
        </div>
    </div>
  )
}

export default ProgressBar