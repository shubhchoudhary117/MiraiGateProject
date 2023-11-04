import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import "./LoginPage.css"
import axios from "axios"
import { TokenService } from "../../../services/TokenService.js"
import ClipLoader from 'react-spinners/ClipLoader'
import { Alert } from "@mui/material"

var config = {
    withCredentials: true,
    headers: { 'Content-Type': 'application/json' }
}

// default data object
const defaultData = {
    email: "",
    password: "",
}
const LoginPage = () => {
    const [loginData, setSignpuData] = useState(defaultData)
    const [nameIsEmpty, setNameIsEmpty] = useState(false)
    const [emailIsEmpty, setEmailIsEmpty] = useState(false)
    const [passwordIsEmpty, setPasswordIsEmpty] = useState(false)
    const [cpasswordIsEmpty, setCPasswordIsEmtpy] = useState(false)
    const [allFieldIsEmpty, setAllFieldIsEmpty] = useState(false)
    const [emailIsInvalid, setEmailIsInvalid] = useState(false)
    const [passwordIdInvalid, setPasswordIsInvalid] = useState(false);
    const [emailNotExits, setEmailNotExist] = useState(false);
    const [AlertComponent, setAlertComponent] = useState("");
    const [ActiveAlert, setActiveAlert] = useState(false);
    const [loginProcess, setLoginProcess] = useState(false)

    // create navigate object
    const navigate = useNavigate();


    // notify alert
    const notify = (mssg, alertType) => {
        setActiveAlert(true)
        let myalert = <Alert className='alert' severity={alertType}>{mssg} !</Alert>;
        setAlertComponent(myalert);
    }

    // hide the alert after 3 seconds
    useEffect(() => {
        setTimeout(() => {
            setActiveAlert(false)
        }, 3000);
    }, [AlertComponent])

    // create data object
    const onInputChage = (e) => {
        let key = e.target.id;
        let value = e.target.value;
        setSignpuData({ ...loginData, [key]: value })
    }

    // validate the email
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    // on submit login form
    const onLogin = async () => {
        if (loginData.email != "" && loginData.password != "") {
            if (validateEmail(loginData.email)) {
                // update validation error
                setEmailIsEmpty(false)
                setPasswordIsEmpty(false)
                setAllFieldIsEmpty(false);
                setEmailIsInvalid(false)
                console.log(loginData)
                setLoginProcess(true);
                // call the api
                let URI = "http://localhost:9000/miraigate/login"
                await axios.post(URI, loginData, config)
                    .then((response) => {
                        console.log(response)
                        if (response.data.login) {
                            // set the jwt token
                            setTimeout(() => {
                                notify("login successfylly ", "success")
                                setLoginProcess(false);
                                navigate("/miraigate/joinwithus");
                            }, 2000);
                        }
                        if (response.data.passwordInvalid) {
                            setPasswordIsInvalid(true);
                            setLoginProcess(false);
                        }
                        if (response.data.emailInvalid) {
                            setEmailIsInvalid(true);
                            setLoginProcess(false)
                        }
                        if (response.data.somethingwrong) {
                            notify("something went wrong please try again", "error")
                            setLoginProcess(false)
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                        notify("something went wrong please try again", "error")
                        setLoginProcess(false)
                    })

            } else {
                setEmailIsInvalid(true);
            }
        } else {
            if (loginData.email == "" && loginData.password == "") {
                setAllFieldIsEmpty(true)
            } else {
                setAllFieldIsEmpty(false);
                if (loginData.email == "") { setEmailIsEmpty(true) } else { setEmailIsEmpty(false) }
                if (loginData.password == "") { setPasswordIsEmpty(true) } else { setPasswordIsEmpty(false) }
            }
        }
    }




    return <>
        <section className="login-section">
            {/* alert */}
            <div className="Alert">
                {ActiveAlert ? AlertComponent : ""}
            </div>
            <div className="login-container">
                <div className="login-banner"><img src={process.env.PUBLIC_URL + "/Photos/WebPhotos/AuthIcon.svg"} alt="" /></div>
                <div className="login-box">
                    <div className="login-heading">login</div>
                    <div className="login-form">
                        <div className="form-group">

                            <div className="form-group">
                                <input value={loginData.email} onChange={onInputChage} type="email" id='email' placeholder='your email' />
                                {
                                    allFieldIsEmpty || emailIsEmpty ? <p className="validation">email is required</p> : "" ||
                                        emailIsInvalid ? <p className="validation">email is invalid</p> : "" ||
                                            emailNotExits ? <p className="validation">email is not exist</p> : ""
                                }
                            </div>
                            <div className="form-group">
                                <input value={loginData.password} onChange={onInputChage} type="text" id='password' placeholder='your password' />
                                {
                                    allFieldIsEmpty || passwordIsEmpty ? <p className="validation">password is required</p> : "" ||
                                        passwordIdInvalid ? <p className="validation">password is invalid</p> : ""
                                }
                            </div>
                            <div className="forgot-password"><Link className='link' to='/miraigate/emailsent'>forgot password</Link></div>
                            <div className="account-mssg">not have an account? <Link to='/miraigate/signup' className='link'>signup</Link></div>
                            <div className="login-btn">
                                <button disabled={loginProcess ? true : false} className={loginProcess ? "disabled" : ""} onClick={onLogin}>
                                    {
                                        loginProcess ? <ClipLoader size={25} color='#fff' /> : "login"
                                    }
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </>
}

export default LoginPage
