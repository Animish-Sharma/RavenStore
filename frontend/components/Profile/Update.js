import React from 'react'
import styles from "../../styles/components/Profile/Update.module.scss"
import { useDispatch } from 'react-redux';
import { update } from '../../redux/reducers/auth';
import { useRouter } from 'next/router';
const Update = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [data,setData] = React.useState({
    first_name:"",
    last_name:"",
    username:"",
    email:"",
    old_password:"",
    password:"",
  });
  const [checked,setChecked] = React.useState(false);
  const { first_name,last_name,username,email,old_password,password } = data;
  const onChange = e=> setData({...data, [e.target.name]: e.target.value});
  const onSubmit = e =>{
    e.preventDefault();
    dispatch(update({ first_name,last_name,username,email,old_password,password }))
    setTimeout(() => {
      router.reload()
  }, 2000);
  }
  return (
    <div className={styles.update}>
      <h1>Update</h1>
      <div>
        <span>
          <img src="/images/update.svg"/>
        </span>
        <form onSubmit={onSubmit}>
          <p>Update your Profile</p>

          <input onChange={onChange} value={first_name} name="first_name" placeholder="First Name"/>
          <input onChange={onChange} value={last_name} name="last_name" placeholder="Last Name"/>
          <input onChange={onChange} type="email" value={email} name="email" placeholder="Email"/>
          <input onChange={onChange} value={username} name="username" placeholder="Username"/>
          <input onChange={onChange} type={`${checked ? "text": "password"}`} value={old_password} name="old_password" placeholder="Old Password"/>
          <input onChange={onChange} type={`${checked ? "text": "password"}`} value={password} name="password" placeholder="New Password"/>
    
          <label htmlFor="check">Show Passwords</label>
          <input onChange={()=>setChecked(!checked)} type="checkbox" name="check" id="check" value={checked}/>
          <button className={styles.submit} type="submit">Update</button>
        </form>
      </div>
    </div>
  )
}

export default Update