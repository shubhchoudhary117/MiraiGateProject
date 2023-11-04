import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from "axios"
import "./SignupPage.css"
import ClipLoader from "react-spinners/ClipLoader"
import {Alert} from "@mui/material"

// default data object
const myHeaders = new Headers({
    'ContentType': 'application/json'
})

const defaultData = {
    name: "",
    email: "",
    password: "",
    cpassword: ""

}
const SignupPage = () => {
    const [signupData, setSignpuData] = useState(defaultData)
    const [nameIsEmpty, setNameIsEmpty] = useState(false)
    const [emailIsEmpty, setEmailIsEmpty] = useState(false)
    const [passwordIsEmpty, setPasswordIsEmpty] = useState(false)
    const [cpasswordIsEmpty, setCPasswordIsEmtpy] = useState(false)
    const [allFieldIsEmpty, setAllFieldIsEmpty] = useState(false)
    const [emailIsInvalid, setEmailIsInvalid] = useState(false)
    const [emailIsExist, setEmailIsExist] = useState(false);
    const [SignupProcess,setSignupProcess]=useState(false)
    const [AlertComponent,setAlertComponent]=useState("");
    const [ActiveAlert,setActiveAlert]=useState(false)
    // create navigate
    const navigate=useNavigate();
    // create data object
    const onInputChage = (e) => {
        let key = e.target.id;
        let value = e.target.value;
        setSignpuData({ ...signupData, [key]: value })
    }

    // notify alert
    const notify=(mssg,alertType)=>{
        setActiveAlert(true)
        let myalert=<Alert className='alert' onClose={() => {setActiveAlert(!ActiveAlert)}} severity={alertType}>{mssg} !</Alert>;
        setAlertComponent(myalert);
    }

    // hide the alert after 3 seconds
    useEffect(()=>{
        setTimeout(() => {
            setActiveAlert(false)
        }, 3000);
    },[AlertComponent])
  

    // validate the email
    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    // on submit signup form
    const onSignup =async () => {
        if (signupData.name != "" && signupData.email != "" && signupData.password != "" && signupData.cpassword != "") {
            if (validateEmail(signupData.email)) {
                if (signupData.password === signupData.cpassword) {
                    // update validation error
                    setNameIsEmpty(false)
                    setEmailIsEmpty(false)
                    setPasswordIsEmpty(false)
                    setCPasswordIsEmtpy(false)
                    setAllFieldIsEmpty(false);
                    setEmailIsInvalid(false);
                    setEmailIsExist(false);
                    setSignupProcess(true);
                    // call the api
                    let URI = "http://localhost:9000/miraigate/signup"
                 await   axios.post(URI, signupData, myHeaders)
                        .then((response) => {
                            let Response = response.data;
                            if (Response.emailIsExist) {
                                setEmailIsExist(true);
                                setSignupProcess(false);
                            }
                            //if signup successfull navigate to login
                            if(Response.signupsuccess){
                                setTimeout(() => {
                                    setSignupProcess(false);
                                    setSignpuData(defaultData);
                                    navigate("/miraigate/login")
                                }, 2000);
                                notify("signup succesfully ","success");
                            }
                            if(Response.somethingwrong){
                                setSignupProcess(false);
                                notify("something went wrong please try again ","error")
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            setSignupProcess(false);
                            notify("something went wrong please try again","error")
                        })
                } else {
                    setCPasswordIsEmtpy(true)
                }
            } else {
                setEmailIsInvalid(true)
            }
        } else {
            if (signupData.name == "" && signupData.email == "" && signupData.password == "" && signupData.cpassword == "") {
                setAllFieldIsEmpty(true)
            } else {
                setAllFieldIsEmpty(false);
                if (signupData.name == "") { setNameIsEmpty(true) } else { setNameIsEmpty(false) }
                if (signupData.email == "") { setEmailIsEmpty(true) } else { setEmailIsEmpty(false) }
                if (signupData.password == "") { setPasswordIsEmpty(true) } else { setPasswordIsEmpty(false) }
                if (signupData.cpassword == "") { setCPasswordIsEmtpy(true) } else { setCPasswordIsEmtpy(false) }
            }
        }
    }

    return <>

        <section className="signup-section">
            {/* alert */}
            <div className="Alert">
                {ActiveAlert?AlertComponent:""}
            </div>
            <div className="signup-container">
                <div className="signup-banner"><img src={process.env.PUBLIC_URL + "/Photos/WebPhotos/AuthIcon.svg"} alt="" /></div>
                <div className="singup-box">
                    <div className="signup-heading">singup</div>
                    <div className="signup-form">
                        <div className="form-group">
                            <div className="form-group">
                                <input value={signupData.name} type="text" onChange={onInputChage} id='name' placeholder='your name' />
                                {
                                    allFieldIsEmpty || nameIsEmpty ? <p className="validation">name is required</p> : ""
                                }

                            </div>
                            <div className="form-group">
                                <input value={signupData.email} onChange={onInputChage} type="email" id='email' placeholder='your email' />
                                {
                                    allFieldIsEmpty || emailIsEmpty ? <p className="validation">email is required</p> : "" ||
                                        emailIsInvalid ? <p className="validation">email is invalid</p> : ""||
                                        emailIsExist?<p className='validation'>email is already exist</p>:""
                                }
                            </div>
                            <div className="form-group">
                                <input value={signupData.password} onChange={onInputChage} type="text" id='password' placeholder='your password' />
                                {
                                    allFieldIsEmpty || passwordIsEmpty ? <p className="validation">password is required</p> : ""
                                }
                            </div>
                            <div className="form-group">
                                <input value={signupData.cpassword} onChange={onInputChage} type="text" id='cpassword' placeholder='confrom password' />
                                {allFieldIsEmpty || cpasswordIsEmpty ? <p className="validation">confrom password</p> : ""
                                }
                            </div>
                            <div className="account-mssg">already have an account? <Link to='/miraigate/login' className='link'>login</Link></div>
                            <div className="signup-btn">
                                <button disabled={SignupProcess?true:false} className={SignupProcess?"disabled":""} onClick={onSignup}>{
                                    SignupProcess?
                                    <ClipLoader size={28} color='#fff' />:
                                    "signup"
                                }</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    </>
}

export default SignupPage
