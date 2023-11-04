import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./Homepage.css"
import Navbar from '../../Components/Navbar/Navbar'

const Homepage = () => {
   

  

    return <>
        <Navbar/>
        <section className="home-section">
            <div className="background-section">
                <div className="bk-container">
                    <div className="bk-content">
                        <div className="bk-heading">Better solutions for your bussiness</div>
                        <div className="bk-text">we are team of telented designers making websites with MERN Stack</div>
                        <button>get started</button>
                    </div>
                    <div className="bk-banner" >
                        <img src={process.env.PUBLIC_URL + "/Photos/WebPhotos/bussiness.gif"} alt="" />
                    </div>
                </div>
            </div>
        </section >

    </>
}

export default Homepage
