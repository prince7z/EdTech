import { useState } from 'react'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import './App.css'
import Bar from './cmp/bar.jsx'
import Workspace from './pages/Workspace.jsx'
import Collaboration from './pages/component/Collaboration.jsx'

function App() {
   

  return (
    <>
      <div style={{
      width: "100%",
      height: "100%",
      minHeight: "100vh",
      backgroundColor: "#191f22"
      }}>
      
      <Bar></Bar>
         <BrowserRouter>
        
        <Routes>
        <Route path="/workspace" element={<Workspace/>}></Route>
        <Route path="/collaborate/:roomId" element={<Workspace/>}></Route>
        </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
