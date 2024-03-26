import "./App.css"
import { Link, Route, Router, Routes, useLocation } from "react-router-dom"
import { Home } from "./Home"
import { UserInterface } from "./UserInterface"
import { useState } from "react"
function App() {
  const [userName, setUserName] = useState("myUserName")

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={`/:username`} element={<UserInterface />} />
      </Routes>
    </>
  )
}
export default App
