import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { Room} from './pages/index'


function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Room/>}/>
          <Route path="/room" element={<Room/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
  
}

export default App
