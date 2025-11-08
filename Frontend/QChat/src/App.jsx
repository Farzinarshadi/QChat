import './assets/css/base/base.css'
import {BrowserRouter, Route , Routes} from 'react-router-dom'
import Chat from './pages/Chat'
import Signin from './pages/Signin'
import Signup from './pages/Signup'
import IsAuthenticated from './config/IsAuthenticated'
import PrivateChat from './pages/PrivateChat'
import UserStatus from './config/UserStatus'

function App() {

  return (
    <BrowserRouter>

      <IsAuthenticated>

        <UserStatus />

        <Routes>
          <Route path='/' element={<Chat />}/>
          <Route path='PrivateChat/' element={<PrivateChat />}/>
          <Route path='Signin/' element={<Signin />}/>
          <Route path='Signup/' element={<Signup />}/>
          <Route path='Group/:id/:sender/' element={<Chat />}/>
          <Route path='Friend/:sender/:reciver/' element={<PrivateChat />}/>
        </Routes>
        
      </IsAuthenticated>

    </BrowserRouter>
  )

}

export default App
