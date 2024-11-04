import React, { useState, useEffect } from 'react'

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false)

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true)
        } else {
            setIsVisible(false)
        }
    }

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility)
        return () => {
            window.removeEventListener('scroll', toggleVisibility)
        }
    }, [])

    return (
        <div className={`scroll-to-top ${isVisible ? 'visible' : ''}`}>
            {isVisible && (
                <div onClick={scrollToTop} className="scroll-button item-center">
                    <i className="fa-solid fa-up-long"></i>
                </div>
            )}
        </div>
    )
}

export default ScrollToTop
