import { Link } from 'react-router-dom'
import '../assets/css/Auth/signin&signup.css'
import { useEffect, useState } from 'react'
import Alert from '@mui/material/Alert';
import { API_URL, privateApi } from '../config/Base'
import { useNavigate } from 'react-router-dom';


export default function Signup() {

    const [Username, setUsername] = useState('')
    const [Password, setPassword] = useState('')

    const [ShowAlert, setShowAlert] = useState(false)
    const [AlertText, setAlertText] = useState('')
    const [AlertType, setAlertType] = useState('error')

    const navigate = useNavigate()


    const HandleSendSignIn = () => {
        if (Username.length <= 0) {
            setShowAlert(true)
            setAlertText('username is not true')
            return;
        }
        if (Password.length <= 0) {
            setShowAlert(true)
            setAlertText('password is not true')
            return;
        }

        privateApi.post('/auth/signin/', {
            username: Username,
            password: Password,
        })
            .then((response) => {
                localStorage.setItem('refresh', response.data.tokens.refresh)
                localStorage.setItem('access', response.data.tokens.access)
                localStorage.setItem('user_id', response.data.user_id)

                setShowAlert(true)
                setAlertType('success')
                setAlertText('Sign In Success')

                setTimeout(() => {
                    navigate('/')
                }, 300);

            })
            .catch((error) => {
                setShowAlert(true)
                setAlertText(error.response.data.error)
            })
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
                    severity={AlertType}
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

                    <div className="auth-title flex-jc-start">Sign In</div>
                    <input className='auth-username-input' type="text" name='username' placeholder='Username' onChange={(e) => setUsername(e.target.value)} />
                    <input className='auth-password-input' type="password" name='password' placeholder='Password' onChange={(e) => setPassword(e.target.value)} />
                    <button className='auth-button' onClick={HandleSendSignIn}>Submit</button>

                    {/* Change Section */}
                    <div className="change-section flex-jc-start">
                        <Link className="signin-change flex-center active" to='/Signin/' >Sign In</Link>
                        <Link className="signup-change flex-center" to='/Signup/'>Sign Up</Link>
                    </div>

                </div>

            </div>
        </>
    )
}