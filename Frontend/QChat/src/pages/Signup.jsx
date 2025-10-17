import { Link } from 'react-router-dom'
import '../assets/css/Auth/signin&signup.css'
import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert';


export default function Signup() {

    const [Username, setUsername] = useState('')
    const [Password, setPassword] = useState('')
    const [Password2, setPassword2] = useState('')

    const [ShowAlert, setShowAlert] = useState(false);
    const [AlertText, setAlertText] = useState('');
    

    const HandleSendSignUp = () => {
        if (Username.length <= 0) {
            setShowAlert(true)
            setAlertText('username is not true')
        }
        if (Password.length <= 0) {
            setShowAlert(true)
            setAlertText('password is not true')
        }
        if (Password2.length <= 0) {
            setShowAlert(true)
            setAlertText('password is not true')
        }
    }

    useEffect(() => {
        let timer;
        if (ShowAlert) {
            timer = setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [ShowAlert]);

    return (
        <>
            {ShowAlert && (
                <Alert
                    severity="error"
                    variant='filled'
                    sx={{
                        position: "fixed",
                        top: 20,
                        right: "50%",
                        transform: "translateX(50%)",
                        width: "320px",
                        zIndex: 9999,
                    }}
                >
                    {AlertText}
                </Alert>
            )}

            <div className="auth-main flex-center">

                <div className="auth-box">

                    <div className="auth-title flex-jc-start">Sign Up</div>
                    <input className='auth-username-input' type="text" name='username' placeholder='Username' onChange={(e) => setUsername(e.target.value)} />
                    <input className='auth-password-input' type="password" name='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                    <input className='auth-password-input' type="password" name='password2' placeholder='Password Repait' onChange={(e) => setPassword2(e.target.value)} />
                    <button className='auth-button' onClick={HandleSendSignUp}>Submit</button>

                    {/* Change Section */}
                    <div className="change-section flex-jc-start">
                        <Link className="signin-change flex-center" to='/Signin/' >Sign In</Link>
                        <Link className="signup-change flex-center active" to='/Signup/'>Sign Up</Link>
                    </div>

                </div>

            </div>
        </>
    )
}