import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import Bar from './cmp/bar.jsx'
import Workspace from './pages/Workspace.jsx'

function App() {
   

  return (
    <>
      <div style={{
      width: "100%",
      height: "100%",
      minHeight: "100vh",
      backgroundColor: "lightblue"
      }}>
      
      <Bar></Bar>
         <BrowserRouter>
        <bar></bar>
        <Routes>
        <Route path="/workspace" element={<Workspace/>}></Route>
          
        </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App
