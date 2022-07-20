import React from 'react'
import Link from 'next/link'
import styles from '../../styles/components/Profile/User.module.scss'
const User = ({ user }) => {
  return (
    <div className={styles.user}>
      <h1>User Profile</h1>
      <img src={"/images/user.svg"} />
      <h3>Welcome, {user.first_name} {user.last_name}</h3>
      <h5>@{user.username}</h5>
      <p>email: {user.email}</p>
      <span>
        <Link href="/user/fav">Favorites</Link>
        <Link href="/user/refund">Refund</Link>
        <Link href="/user/account">Account Settings</Link>
        <Link href="/user/pass">Password Reset</Link>
      </span>
    </div>
  )
}

export default User