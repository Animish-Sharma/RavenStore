import React from 'react'
import { CountryDropdown,RegionDropdown } from 'react-country-region-selector'
import { faCheckCircle,faHomeUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import UserService from "../../services/userService"
import styles from "../../styles/components/Profile/Address.module.scss"
import { LoadingContext } from "../../hocs/Layout"
import { useRouter } from 'next/router'
const Address = ({ token }) => {
  const [address,setAddress] = React.useState([])
  const [message,setMessage] = React.useState(false);
  const { setLoading } = React.useContext(LoadingContext)
  const [edit,setEdit] = React.useState(false);
  const router = useRouter()
  const [country,setCountry] = React.useState("")
  const [state,setStateS] = React.useState("")
  const [deliveryMode,setDeliveryMode] = React.useState("Standard")
  const [data,setData] = React.useState({
    street_address:"",
    apartment_address:"",
    city:"",
    pincode:"",
    phone_no:""
  })
  const { street_address,apartment_address,city,pincode,phone_no } = data
  const onChange = e => setData({...data,[e.target.name]:e.target.value})
  const selectCountry = val=> setCountry(val)
  const selectState = val=> setStateS(val)
  React.useEffect(()=>{
    const getData= async()=>{
      const res = await UserService.fetchAddress(token)
      res.success ? setAddress(res.success) : res.message ? setMessage(true) : null
    }
    getData()
  },[]);
  const addressActions = async (street_address,apartment_address,city,pincode,phone_no,state,country,action) => {
    setLoading(true)
    action === "delete" ? await UserService.deleteAddress(token) :
    action === "create" ? await UserService.createAddress(token,street_address,apartment_address,city,pincode,phone_no,state,country):
    action === "update" ? await UserService.updateAddress(token,street_address,apartment_address,city,pincode,phone_no,state,country) : null
    setLoading(false)
  }
  const deliveryChange = async(delivery) =>{
    setLoading(true);
    await UserService.changeDeliveryMode(token,delivery)
    setLoading(false);
  }
  const parsePhone=(phone)=>{
    const i = phone.substr(phone.length - 10);
    const v = phone.substr(0, (phone.length - i.length))
    return `${v} ${i}`
  }
  return (
    <div className={styles.address}>
      <h1>Address</h1>
      {address.street_address && <div>
        <div className={styles.card}>
          <h2>{address.street_address}</h2>
          <h3>{address.apartment_address}</h3>
          <h4>{address.city}</h4>
          <h5>{address.state}, {address.country} - {address.pincode}</h5>
          {address.phone_no && <p>Phone: {parsePhone(address.phone_no.toString())}</p>}
          <span>
            <button onClick={()=> setEdit(!edit)}>Edit</button>
            <button onClick={()=> addressActions(null,null,null,null,null,null,null,"delete")}>Delete</button>
          </span>
        </div>
      </div>}
      <form className={`${edit || message ? styles.showModal : styles.hideModal} ${styles.modal}`}>
        <h2>{edit ? "Edit your address" : message ? "Create your address" :""} </h2>
        <input onChange={onChange} name="street_address" value={street_address} placeholder="Street Address"/>
        <input onChange={onChange} name="apartment_address" value={apartment_address} placeholder="Apartment Address"/>
        <input onChange={onChange} name="city" value={city} placeholder="City"/>
        <span>
          <CountryDropdown valueType='short' className={styles.drop} onChange={val=> selectCountry(val)} value={country}/>
          <RegionDropdown countryValueType="short" className={styles.drop} country={country} onChange={val=> selectState(val)} value={state}/>
        </span>
        <input onChange={onChange} name="pincode" value={pincode} placeholder="Pincode"/>
        <input onChange={onChange} name="phone_no" value={phone_no} placeholder="Phone No"/>

        <button onClick={()=> edit ? addressActions(street_address,apartment_address,city,pincode,phone_no,state,country,"update") : addressActions(street_address,apartment_address,city,pincode,phone_no,state,country,"create")} type="submit">
          {edit && <FontAwesomeIcon icon={faCheckCircle} />}
          {message && <FontAwesomeIcon icon={faHomeUser} />}
          &nbsp;{edit? "Edit" : message ? "Create" : ""}
        </button>
      </form>
      {address.street_address && <div className={styles.deliveryType}>
        <h2>Select Delivery Type</h2>
        <h3>Current Delivery Type: {address.delivery_type}</h3>  
        <select defaultValue={deliveryMode} onChange={(e)=> {setDeliveryMode(e.target.value);}}>
          <option value="Standard">Standard -$2</option>
          <option value="Same Day">Same Day -$6</option>
          <option value="Overnight">Overnight -$10</option>
          <option value="Speed Post">Speed Post -$30</option>
        </select>
        <button onClick={()=>deliveryChange(deliveryMode)}>Submit</button>
      </div>}
    </div>
  )
}

export default Address