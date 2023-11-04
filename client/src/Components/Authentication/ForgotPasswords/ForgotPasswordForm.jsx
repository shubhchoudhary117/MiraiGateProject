import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from "axios"
import "./ForgotPasswordForm.css"
import { Alert } from '@mui/material'
import ClipLoader from 'react-spinners/ClipLoader'

// pass the headers in axios
var config = {
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
}

const defaultLoger = {
  password: "",
  cpassword: ""
}

const ForgotPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [passwordEmpty, setPasswordIsEmpty] = useState(false);
  const [cpasswordIsEmpty, setCPasswordIsEmtpy] = useState(false);
  const [passwordIsConformed, setPasswordIsConformed] = useState(true);
  const [allFieldIsEmpty, setAllFieldIsEmpty] = useState(false);
  const [AlertComponent, setAlertComponent] = useState("");
  const [ActiveAlert, setActiveAlert] = useState(false);
  const [processLoader,setProcessLoader]=useState(false);
  const params = useParams();
  const navigate=useNavigate();

  // notify alert
  const notify = (mssg, alertType) => {
    setActiveAlert(true)
    let myalert = <Alert className='alert' onClose={() => { setActiveAlert(!ActiveAlert) }} severity={alertType}>{mssg} !</Alert>;
    setAlertComponent(myalert);
  }

  // hide the alert after 3 seconds
  useEffect(() => {
    setTimeout(() => {
      setActiveAlert(false)
    }, 3000);
  }, [AlertComponent])

  // create password
  const createPassword = async () => {

    if (password != "" && cpassword != "") {
      setAllFieldIsEmpty(false);
      setPasswordIsEmpty(false);
      setCPasswordIsEmtpy(false);
      if (password === cpassword) {
        setPasswordIsConformed(true)
        setProcessLoader(true);
        // call the api
        let URI = "http://localhost:9000/miraigate/change-password"
        await axios.post(URI, { password: password, userid: params?.id },config)
          .then((response) => {
            if (response.data.passwordUpdated) {
              notify("password change succesfully ", "success");
              setTimeout(() => {
                setProcessLoader(false);
                navigate("/miraigate/login")
              }, 2000);
            }
            if (response.data.somethingwrong) {
              notify("something went wrong try again ", "error");
              setProcessLoader(false)
            }
          })
          .catch((error) => {
            console.log(error);
            notify("something went wrong try again ", "error");
            setProcessLoader(false);
          })
      } else {
        setPasswordIsConformed(false);
      }
    } else {
      if (password == "" && cpassword == "") {
        setAllFieldIsEmpty(true);
      } else {
        setAllFieldIsEmpty(false);
        if (password == "") { setPasswordIsEmpty(true) } else { setPasswordIsEmpty(false) }
        if (cpassword == "") { setCPasswordIsEmtpy(true) } else { setCPasswordIsEmtpy(false) }
      }
    }
  }


  return <>
    <section className="forgot-password-section">
      <div className="Alert">
        {ActiveAlert ? AlertComponent : ""}
      </div>
      <div className="forgotpassword-container">
        <div className="forgotpassword-content">
          <div className="forgotpassword-heading">Forgot Password</div>
          <div className="forgot-text">create a new password and loging again </div>
        </div>
        <div className="forgotpassword-form">
          <div className="form-group">
            <input value={password} onChange={(e) => setPassword(e.target.value)} type="text" placeholder='create password' id='password' />
            {passwordEmpty || allFieldIsEmpty ? <p className="validation">this field is required</p> : ""}

          </div>
          <div className="form-group">
            <input value={cpassword} onChange={(e) => setCPassword(e.target.value)} type="text" placeholder='conform password' id='cpassword' />
            {cpasswordIsEmpty || allFieldIsEmpty ? <p className="validation">this field is required</p> : ""}
            {passwordIsConformed ? "" : <p className="validation">conform the password</p>}
          </div>
          <div className="button">
            <button disabled={processLoader?true:false} className={processLoader?"disabled":""} onClick={createPassword}>
              {processLoader?<ClipLoader size={25} color='#fff' />:"change password"}
            </button>
          </div>
        </div>
      </div>
    </section>

  </>
}

export default ForgotPasswordForm
