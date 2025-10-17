import { Link } from 'react-router-dom'
import '../assets/css/Auth/signin&signup.css'

export default function Signin(){
    return (
        <>
            <div className="auth-main flex-center">

                <div className="auth-box">

                    <div className="auth-title flex-jc-start">Sign In</div>
                    <input className='auth-username-input' type="text"  name='username' placeholder='Username'/>
                    <input className='auth-password-input' type="password" name='password' placeholder='Password'/>
                    <button className='auth-button'>Submit</button>

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