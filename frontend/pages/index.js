import Head from 'next/head'
import { useContext } from 'react'
import { SidebarContext } from '../hocs/Layout'
import styles from '../styles/Home.module.scss'
import { faMobileButton,faBook,faShirt,faUtensils, faPalette,faChessKnight,faTvAlt,faSuitcase } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { faInstagram } from '@fortawesome/free-brands-svg-icons'
import { faReddit } from '@fortawesome/free-brands-svg-icons'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faSnapchat } from '@fortawesome/free-brands-svg-icons'
export default function Home() {
  const router = useRouter()
  const isSide = useContext(SidebarContext);
  const isAuth = useSelector(state => state.auth.isAuthenticated)
  const user = isAuth && JSON.parse(useSelector(state => state.auth.user))
  const name = user ? `${user.first_name} ${user.last_name}` : "Visitor"

  const categories = [{name:"Technology", link:"tech",icon:faMobileButton},{name:"Books",link:"books",icon:faBook},
    {name:"Apparel",link:"apparel",icon:faShirt},{name:"Kitchen",link:"h&k",icon:faUtensils},
    {name:"Beauty",link:"beauty",icon:faPalette},{name:"Games",link:"t&g",icon:faChessKnight},
    {name:"Home",link:"home",icon:faTvAlt},{name:"Luggage",link:"luggage",icon:faSuitcase}]
  
  const price = [{title:"Below $5", price:5},{title:"Below $10", price:10},
    {title:"Below $50", price:50},{title:"Below $100", price:100},
    {title:"Below $500", price:500},{title:"Below $1000", price:1000},
    {title:"Below $5000", price:5000},{title:"Below $10000", price:10000},]

  const links = [{title:"Instagram", link:"https://www.instagram.com/iamanimish",icon:faInstagram},
  {title:"Github",link:"https://github.com/Animish-Sharma",icon: faGithub},
  {title:"Reddit", link:"https://reddit.com/u/iamanimish",icon:faReddit},
  {title:"Snapchat",link:"https://snapchat.com/add/iamanimish",icon:faSnapchat},
]
  return (
    <div className={`${styles.container} ${!isSide && styles.side}`}>
      <Head>
        <title>Raven | Home</title>
      </Head>
      <div className={styles.full}>
        <section className={styles.one}>
          <h1>Raven Store</h1>
          <h3>Buy everyting you want, </h3>
          <h3>At a Price you can </h3>
          <h4>"Nothing haunts us like the things we didn't buy"</h4>
        </section>
        <section className={styles.two}>
          <div>
            <h2>What are we providing</h2>
            <p>Raven Shop is trying it's best in providing the best items
              at the lowest prices. As of right now Raven Shop is operating in X countries and
              coming to your country soon (if not available). We employs over X no of employes in
              X no of countries. Raven Shop is also currently donating it's 90% earning in various NGOs and
              movements. We belive in the betterment of the world through various ways. Raven Shop also supports
              BLM officially without any hesitations. This the official Website of Raven Store, we never had or will have 
              anoy other website than this. To know more about your visions and terms and conditions we guarantee on this website, 
              Please visit the following link below to know more</p>
              <span>
                <a href="/terms">Terms and Conditions</a>
                <a target="_blank" href="https://www.github.com/Animish-Sharma">Github</a>
              </span>
          </div>
          <div>
            <h2>Explore</h2>
            <div>
              <span>
                <h3>By Categories</h3>
                <div>
                  {categories.map((cat,idx)=>{
                    return <span onClick={()=>router.push(`/category/${cat.link}`)} className={styles.cat}>
                      <h5><FontAwesomeIcon icon={cat.icon}/> {cat.name}</h5>
                    </span>
                  })}
                </div>
              </span>
              <span>
                <h3>By Price Range</h3>
                {price.map((pr,idx)=>{
                    return <span onClick={()=>router.push(`/search?query=${pr.price}`)} className={styles.pr}>
                      <h5>{pr.title}</h5>
                    </span>
                  })}
              </span>
            </div>
          </div>
        </section>
        <section className={styles.three}>
          <h1>About Dev</h1>
          <div>
            <div>
              <img src="https://avatars.githubusercontent.com/u/70955160?v=4"/>
              <span>
                  {links.map(link=>{
                    return <div onClick={()=> router.push(link.link)} className={styles.link}>
                      <h4><FontAwesomeIcon className={styles.icon} icon={link.icon} /> {link.title}</h4>
                    </div>
                  })}
              </span>
            </div>
            <div>
              <h2>Hi! {name}, <br/> 
              My name is Animish Sharma, the sole devloper of this website. I am a devloper from India and 
              I have created other projects, so check them out too. Visit my Github Profile from Social Media links or from <b style={{ color:"#3a86ff",cursor:"pointer" }} onClick={()=>router.push(links[1].link)}><u>here</u>&nbsp;</b> 
              and there you will see all my projects I've made. If you want to share your experience about this project or some other one,
              you can contact me at animish2096@gmail.com. <br/> Yours Sincerely, <br/> Animish Sharma
              </h2>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
