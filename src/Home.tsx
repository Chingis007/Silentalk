import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
export function Home() {
  // тут має бути перевірка чи залогінено і
  // тоді навігація на сторінку юзер інтерфейсу
  return (
    <>
      <div id="loginPage">
        <div id="loginWindow">
          <div id="phoneNumber">1312321</div>
          <div id="password">12312321</div>
          <div id="Login">Login</div>
          <div id="SignUp">Sign Up</div>
          <div id="SignUpGoogle">Sign from Google</div>
        </div>
      </div>
    </>
  )
}
