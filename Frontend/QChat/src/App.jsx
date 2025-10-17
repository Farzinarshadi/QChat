import './assets/css/base/base.css'
import {BrowserRouter, Route , Routes} from 'react-router-dom'
import Home from './pages/Home'
import Chat from './components/Chat/Chat'
import Signin from './pages/Signin'
import Signup from './pages/Signup'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='Signin/' element={<Signin />}/>
        <Route path='Signup/' element={<Signup />}/>
        <Route path='Group/:id/' element={<Chat />}/>
      </Routes>
    </BrowserRouter>
  )

}

export default App
