import Navbar from "../components/Layout/Navbar"
import Sidebar from "../components/Layout/Sidebar"
import { useState,createContext } from "react"
import styles from "../styles/Layout.module.scss"
import Loading from "../components/Layout/Loading"
import { Toaster } from "react-hot-toast"
import Cookies from "js-cookie"

export const LoadingContext = createContext()
export const SidebarContext = createContext()
const Layout = ({children}) => {
  const [isSide,setIsSide] = useState(false)
  const [loading,setLoading] = useState(false)
  const sideBarChange=(data)=>{
    setIsSide(data)
  }
  return (
    <div suppressHydrationWarning className={styles.layout}>
        <Navbar side={sideBarChange}/>
        <div>
          <Sidebar sideBar={isSide}/>
          <SidebarContext.Provider value={isSide} >
            <LoadingContext.Provider value={{loading,setLoading}}>
                {loading ? <Loading/> : children}
                <Toaster />
            </LoadingContext.Provider>
          </SidebarContext.Provider>
        </div>
    </div>
  )
}
export default Layout