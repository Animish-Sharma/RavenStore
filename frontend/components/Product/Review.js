import { faPlus, faThumbsDown, faThumbsUp,faPencil,faTrash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import React from 'react'
import styles from '../../styles/components/Product/Review.module.scss'
import Modal from '../Layout/Modal'
import ReactStars from 'react-stars'
import ProductService from '../../services/productService'

const Review = ({ reviews,product }) => {
  const router = useRouter()
  const token = useSelector(state=> state.auth.token);
  const user = JSON.parse(useSelector(state=> state.auth.user));
  const [data,setData] = React.useState({
    title:"",
    description:"",
    rating:5
  })
  const { title, description,rating } = data

  const [likes,setLikes] = React.useState([])
  const onChange = e=> setData({...data, [e.target.name]: e.target.value});
  const onStarChange = val => setData({...data, rating: val})

  const [showModal,setShowModal] = React.useState(false)
  const [showEditModal,setShowEditModal] = React.useState(false)
  let config = {headers:{"Content-Type": "application/json", "Authorization": `Bearer ${token}`}}
  
  
  const slug = product.slug
  React.useEffect(()=>{
    async function getData(){
      const res = await axios.get(`http://localhost:8000/api/reviews/likes/?slug=${slug}`,config)
      setLikes(res.data.results)
    }
    getData()
  },[])
  const reviewAction = async (id,action) => {
    action === "like" ? await ProductService.likeReview(id,token)
    : action === "dislike" ? await ProductService.disLikeReview(id,token)
    : null
    setInterval(() => {
      router.reload()
    }, 1000);
  }
  const reviewChange = async (action,review_id="") =>{
    action === "create" ? await ProductService.createReview(token,title,description,rating,slug)
    : action === "edit" ? await ProductService.editReview(token,title,description,rating,slug)
    : action === "delete" ? await ProductService.deleteReview(review_id,token)
    : null
    setShowEditModal(false);setShowModal(false)
    setTimeout(() => {
      router.replace(router.asPath)
    }, 1000);
  }
  return (
    <div className={styles.reviews}>
        <h2>Reviews &nbsp;<FontAwesomeIcon onClick={()=>setShowModal(true)} className={styles.header} icon={faPlus}/></h2>
        {showEditModal || showModal ? <Modal click={()=> {setShowEditModal(false);setShowModal(false)}}>
            <React.Fragment key="header">
              <h3>{showModal ? "Create a Review" : showEditModal ? "Edit your Review" : "NONE"}</h3>
            </React.Fragment>  
            <React.Fragment key="body">
              <p>{showModal ? "Add a feedback" : showEditModal ? "Edit your feedback" : "NONE"}</p>
              <input value={title} onChange={onChange} name="title" placeholder="Title"/>
              <textarea value={description} onChange={onChange} name="description" placeholder="Description"/>
              <ReactStars value={rating} onChange={val=>onStarChange(val)} name="rating" half={false} count={5}/>
            </React.Fragment>
            <React.Fragment key="footer">
              <button onClick={()=> showModal ? reviewChange("create") : showEditModal ? reviewChange("edit") : null}>Submit</button>
            </React.Fragment>
        </Modal> : null}
        {reviews.count >= 1 && reviews.results.map((review,idx)=>{
          let ob = likes.map(like=> like.choice==="like" ? "like" : like.choice==="dislike" ? "dislike" : null)[idx]
          let you = user.username === review.user ? true: false
          return <div className={styles.card} key={review.id}>
            <p>User:- {review.user}{you && '(YOU)'}
              {you && <FontAwesomeIcon onClick={()=> setShowEditModal(true)} className={styles.icon} icon={faPencil} />}
              {you && <FontAwesomeIcon onClick={()=> reviewChange("delete",review.id)} className={styles.icon} icon={faTrash} />}
            </p>
            <h3>{review.title}</h3>
            <h5>{review.description}</h5>
            <ReactStars edit={false} className={styles.stars} onChange={()=>{}} count={5} value={parseInt(review.rating)}/>
            <b>{review.likes}</b>
            <span>
              <FontAwesomeIcon onClick={()=> reviewAction(review.id,"dislike")} className={`${styles.icons} ${ob === "dislike"? styles.dislike : null}`} icon={faThumbsDown}/>
              <FontAwesomeIcon onClick={()=> reviewAction(review.id,"like")} className={`${styles.icons} ${ob === "like"? styles.like : null}`} icon={faThumbsUp}/>
            </span>
          </div>
        })}
    </div>
  )
}

export default Review