import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ClipLoader from 'react-spinners/ClipLoader'
import { TokenService } from '../../services/TokenService'
import "./Navbar.css"
import axios from "axios"
import { Alert } from '@mui/material'

// pass the headers in axios
var config = {
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
}

const Navbar = () => {
    const [AlertComponent, setAlertComponent] = useState("");
    const [ActiveAlert, setActiveAlert] = useState(false);
    const [logoutProcessing, setLogoutProcessing] = useState(false);
    const navigate = useNavigate()

     // notify alert
     const notify = (mssg, alertType) => {
        setActiveAlert(true)
        let myalert = <Alert severity={alertType} className='alert'>{mssg}</Alert>
        setAlertComponent(myalert);
    }

     // hide the alert after 3 seconds
     useEffect(() => {
        setTimeout(() => {
            setActiveAlert(false)
        }, 3000);
    }, [AlertComponent])

    // doing logout the user
    const Logout =async () => {
        setLogoutProcessing(true);
        let URI = "http://localhost:9000/miraigate/logout"
        await axios.get(URI,config)
        .then((response)=>{
            if(response.data.logout){
                setTimeout(() => {
                    navigate("/miraigate/login");
                    setLogoutProcessing(false);
                }, 1000);
                notify("logout successfully ","success")
            }
            else{
                setLogoutProcessing(false);
                navigate("/miraigate/login")
            }
            // if server error then show alert
            if(response.data.somethingwrong){
                notify("internal server error please try again","error")
            }
        })
        .catch((error)=>{
            console.log(error);
            setLogoutProcessing(false);
            notify("internal server error please try again","error")
        })
    
    }
    return <>

        <header>
            <nav>
                <div className="buttons">
                    <button className='login'><Link className='link' to="/miraigate/login">Login</Link></button>
                    <button onClick={Logout} disabled={logoutProcessing ? true : false} className={logoutProcessing ? "logout disabled" : "logout"}>
                        {logoutProcessing ?
                            <ClipLoader size={25} color='#fff' /> : "logout"}
                    </button>
                </div>
                <div className="menu-links">
                    <ul>
                        <li><Link to="/" className='link'>home</Link></li>
                        <li><Link to="/miraigate/joinwithus" className='link'>join with us</Link></li>

                    </ul>
                </div>
            </nav>
             {/* alert */}
             <div className="Alert">
                {ActiveAlert ? AlertComponent : ""}
            </div>
        </header>

    </>
}

export default Navbar
