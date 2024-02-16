import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {Create, Home, Pending, Room} from './pages/index'

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Home/>}/>
          <Route path="/pending" element={<Pending/>}/>
          <Route path="/create" element={<Create/>}/>
          <Route path="/room" element={<Room/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
  
}

export default App
