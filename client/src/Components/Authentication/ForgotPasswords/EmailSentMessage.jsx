import React, { useEffect, useState } from 'react'
import "./EmailSentMessage.css"
import axios from 'axios';
import ClipLoader from 'react-spinners/ClipLoader'
import { Link } from 'react-router-dom';
import { Alert } from '@mui/material';
import {TokenService} from "../../../services/TokenService"
const myHeaders = new Headers({
  'ContentType': 'application/json'
})
const ForgotPassword = () => {
  const [email, setEmail] = useState();
  const [emailIsOk, setEmailIsOk] = useState(false);
  const [processLoader, setProcessLoader] = useState(false);
  const [AlertComponent, setAlertComponent] = useState("");
  const [ActiveAlert, setActiveAlert] = useState(false);

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
    }, 7000);
  }, [AlertComponent])

  // validate the email
  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  // capture the email input and validate
  const onEmailInput = (e) => {
    setEmail(e.target.value);
    if (validateEmail(e.target.value)) {
      setEmailIsOk(true);
    }
  }


  // send link on the email of client
  const sendMail = async () => {
    if (validateEmail(email)) {
      setEmailIsOk(true);
      setProcessLoader(true)
      // send the mail
      let URI = "http://localhost:9000/miraigate/forgot/email"
      await axios.post(URI, { email: email }, { myHeaders })
        .then((response) => {
          console.log(response);
          if (response.data.emailSent) {
            setEmail("");
            setEmailIsOk(false);
            setProcessLoader(false);
            TokenService.removeToken();
            notify("email sent successfully please check your email", "success");
          }
          if (response.data.somethingwrong) {
            setProcessLoader(false);
            notify("something went wrog please try again", "error");
          }
          if (response.data.emailInvalid) {
            setProcessLoader(false);
            notify("email is invalid please inter valid email", "error");
          }
        })
        .catch((error) => {
          notify("something went wrong please try again", "error");
        })
    }
  }



  return <>

    <section className="forgot-password-section">
      {/* alert */}
      <div className="Alert">
        {ActiveAlert ? AlertComponent : ""}
      </div>
      {/* alert */}
      <div className="forgotpassword-container">
        <div className="forgotpassword-content">
          <div className="forgotpassword-heading">Forgot Password</div>
          <div className="forgot-text">please enter your email and go to your email box and click link and creat new password</div>
        </div>
        <div className="forgot-password-form">
          <div className="form-group">
            <input value={email} onChange={onEmailInput} type="text" placeholder='enter your email' id='email' />
          </div>
          <div className="message">if you have account? <Link to="/miraigate/login" className="link">login</Link></div>
          <div className="button">
            <button disabled={emailIsOk ? false : true} className={emailIsOk ? "" : "disabled"} onClick={sendMail}>
              {processLoader ? <ClipLoader size={25} color='#fff' /> : "send"}
            </button>
          </div>
        </div>
      </div>
    </section>

  </>
}

export default ForgotPassword
