import './assets/css/base/base.css'
import {BrowserRouter, Route , Routes} from 'react-router-dom'
import Home from './pages/Home'
import Chat from './components/Chat/Chat'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='Group/:id/' element={<Chat />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
