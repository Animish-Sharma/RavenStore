import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from "../../styles/components/Product/Carousel.module.scss"
import { faArrowLeft,faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { SidebarContext } from '../../hocs/Layout'
const Carousel = ({ product }) => {
    const isSide = React.useContext(SidebarContext)
    const data = [
        {image: product.image},
        product.image_1 && {image: product.image_1},
        product.image_2 && {image: product.image_2},
        product.image_3 && {image: product.image_3},
        product.image_4 ? {image: product.image_4} : {image:""}
    ]
    const [current, setCurrent] = useState(0);
    const length = data.length
    const nextSlide = (e) => {
      e.stopPropagation()
        setCurrent(current === length - 1 ? 0 : current + 1);
      };
    const prevSlide = (e) => {
      e.stopPropagation()
        setCurrent(current === 0 ? length - 1 : current - 1);
      };
    
      if (!Array.isArray(data) || data.length <= 0) {
        return null;
    }
  return (
    <section className={`${styles.carousel} ${isSide && styles.side}`}>
      {data.map((slide, index) => {
          return (
              <div
              className={index === current ? styles.active : styles.slide}
              key={index}
              >
            {index === current && (
                <img src={slide.image} alt={product.name} className='image' />
                )}
          </div>
        );
    })}
    <div className={styles.buttons}>
        <FontAwesomeIcon icon={faArrowLeft} className={styles.icon} onClick={prevSlide} />
        <FontAwesomeIcon icon={faArrowRight} className={styles.icon} onClick={nextSlide} />
    </div>
    </section>
  )
}

export default Carousel