import "./App.css"
import { Link, Route, Router, Routes, useLocation } from "react-router-dom"
import { Home } from "./Home"
import { UserInterface } from "./UserInterface"
import { AddToChat } from "./AddToChat"
import { useState } from "react"
function App() {
  const [userName, setUserName] = useState("myUserName")

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path={`/:findname`} element={<UserInterface />} />
        <Route path={`addTo/:chatFindname/:chatType`} element={<AddToChat />} />
      </Routes>
    </>
  )
}
export default App
