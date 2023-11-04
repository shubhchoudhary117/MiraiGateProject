
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import SignupPage from './Components/Authentication/Signup/SignupPage';
import LoginPage from './Components/Authentication/Login/LoginPage';
import Homepage from './Pages/Home/Homepage';
import ForgotPassword from './Components/Authentication/ForgotPasswords/EmailSentMessage';
import ForgotPasswordForm from './Components/Authentication/ForgotPasswords/ForgotPasswordForm';
import JoinWithUs from './Pages/ResourcesPage/JoinWithUs';

function App() {
  return <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Homepage/>}/>
        <Route path='/miraigate/joinwithus' element={<JoinWithUs/>}/>
        <Route path='/miraigate/login' element={<LoginPage/>} />
        <Route path='/miraigate/signup' element={<SignupPage/>}/>
        <Route path='/miraigate/emailsent' element={<ForgotPassword/>}/>
        <Route path='/miraigate/forgot-password/:id' element={<ForgotPasswordForm/>}/>
      </Routes>
    </BrowserRouter>

  </>
}

export default App;
