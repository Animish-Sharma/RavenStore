import React from 'react'
import styles from "../../styles/components/Layout/Modal.module.scss"
const Modal = (props) => {
    const findByKey = (name)=>
    props.children.map(child=>{
        if(child.key === name) return child
        return null
    });
    const closeModal=(e)=>{
        e.stopPropagation();
        return props.click()
    }

    console.log(findByKey('header'))
return (
    <div className={styles.modal}>
        <div className={styles.wrapper}>
            <div className={styles.container}>
                <div className={styles.header}>
                    {findByKey("header")}
                </div>

                <div className={styles.body}>
                    {findByKey('body')}
                </div>

                <div className={styles.footer}>
                    <button onClick={closeModal} className="modal-close">Close</button>
                    {findByKey('footer')}
                </div>

                
            </div>
        </div>
    </div>
)
}

export default Modal