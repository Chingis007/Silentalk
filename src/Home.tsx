import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"
import { decodeJwt } from "jose"
import { parsePhoneNumber } from "libphonenumber-js"
import PhoneInput from "react-phone-number-input"

export function Home() {
  let chatLink: string | undefined
  let chatType: string | undefined
  try {
    chatLink = document.cookie
      .split("; ")
      .find((row) => row.startsWith("chatLink="))
      ?.split("=")[1]
    chatType = document.cookie
      .split("; ")
      .find((row) => row.startsWith("chatType="))
      ?.split("=")[1]
  } catch {}
  const [password, setPassword] = useState("")
  const [passwordValidationText, setPasswordValidationText] = useState("")
  const [passwordRepeat, setPasswordRepeat] = useState("")
  const [repeatPasswordValidationText, setRepeatPasswordValidationText] =
    useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [phoneNumberValidationText, setPhoneNumberValidationText] = useState("")
  const [pressedLogin, setPressedLogin] = useState(false)
  const [pressedRegister, setPressedRegister] = useState(false)
  const [pressedGoogle, setPressedGoogle] = useState(false)
  let strongPassword = new RegExp(
    "(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{8,})"
  )
  let mediumPassword = new RegExp(
    "((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])(?=.{6,}))|((?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])(?=.{8,}))"
  )
  const enableCreation = () => {
    if (pressedLogin) {
      if (
        passwordValidationText === "✔" ||
        passwordValidationText === "✔ Password is STRONG" ||
        passwordValidationText === "✔ Password is MEDIUM" ||
        passwordValidationText === "✔ Password is WEAK"
      ) {
        if (phoneNumberValidationText === "✔") {
          return true
        } else {
          return false
        }
      }
    }
    if (
      passwordValidationText === "✔" ||
      passwordValidationText === "✔ Password is STRONG" ||
      passwordValidationText === "✔ Password is MEDIUM" ||
      passwordValidationText === "✔ Password is WEAK"
    ) {
      if (repeatPasswordValidationText === "✔") {
        if (phoneNumberValidationText === "✔") {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    } else {
      return false
    }
  }

  useEffect(() => {
    if (!/[a-z]/g.test(password)) {
      setPasswordValidationText("Password must contain LOWERCASE letter")
    } else {
      if (!/[A-Z]/.test(password)) {
        setPasswordValidationText("Password must contain UPPERCASE letter")
      } else {
        if (!/[0-9]/g.test(password)) {
          setPasswordValidationText("Password must contain a NUMBER")
        } else {
          if (password.length < 8) {
            setPasswordValidationText(
              "Password must contain at least 8 characters"
            )
          } else {
            if (strongPassword.test(password)) {
              setPasswordValidationText("✔ Password is STRONG")
            } else {
              if (mediumPassword.test(password)) {
                setPasswordValidationText("✔ Password is MEDIUM")
              } else {
                setPasswordValidationText("✔ Password is WEAK")
              }
            }
          }
        }
      }
    }
  }, [password])
  useEffect(() => {
    if (password !== passwordRepeat) {
      setRepeatPasswordValidationText("Passwords don`t match")
    } else {
      setRepeatPasswordValidationText("✔")
    }
  }, [passwordRepeat])
  useEffect(() => {
    try {
      const numberos = parsePhoneNumber(`${phoneNumber}`)
      if (numberos.isValid() && numberos.isPossible()) {
        setPhoneNumberValidationText("✔")
      } else {
        setPhoneNumberValidationText("Not possible phone number")
      }
    } catch (e) {
      setPhoneNumberValidationText("Not possible phone number")
    }
  }, [phoneNumber])
  let navigate = useNavigate()
  const serverGoogleAuthentification = async (
    credential: string,
    phoneNumber: string
  ) => {
    const requestHeaders = new Headers([
      ["Content-Type", "application/json"],
      ["withCredentials", "true"],
      ["Access-Control-Allow-Origin", "*"],
      ["myauthprop", credential],
      ["myphonenumber", phoneNumber],
    ])

    // let url = new URL(`http://localhost:4000/google/temporfetch`)
    let url = new URL(
      `${process.env.REACT_APP_SERVER_ENDPOINT}/google/temporfetch`
    )

    fetch(url, {
      method: "GET",
      headers: requestHeaders,
      // body: payload,
    })
      .then(async (response: any) => {
        const resText = await response.json()
        if (resText[0] === "Email Exists and Logged Successfully") {
          document.cookie = `auth_token=${resText[1].auth_token}; expires=Session; path=/;`
          const findname = resText[1].findname
          document.cookie = `findname=${resText[1].findname}; expires=Session; path=/;`
          // if (
          //   resText[1].cartItemsArray !== undefined &&
          //   resText[1].cartItemsArray !== false
          // ) {
          //   document.cookie = `cartItemsArray=${JSON.stringify(
          //     resText[1].cartItemsArray
          //   )}; expires=Session; path=/;`
          // } else {
          //   document.cookie = `cartItemsArray=${[]}; expires=Session; path=/;`
          // }
          navigate(`/${findname}`)
        }
        if (
          resText[0] ===
          "Something went wrong on password verification. Please try again."
        ) {
          alert(
            "Something went wrong on password verification. Please try again."
          )
        }
        if (
          resText[0] ===
          "User Exists but given email is not attached to given account"
        ) {
          alert("User Exists but given email is not attached to given account")
        }
        if (resText[0] === "Error on google create") {
          alert("Error on google create")
        }
        if (resText[0] === "Created Successfully") {
          document.cookie = `auth_token=${resText[1].auth_token}; expires=Session; path=/;`
          document.cookie = `email=${resText[1].email}; expires=Session; path=/;`
          document.cookie = `emailImgUrl=${resText[1].emailImgUrl}; expires=Session; path=/;`
          document.cookie = `findname=${resText[1].findname}; expires=Session; path=/;`
          const findname = resText[1].findname
          // if (
          //   resText[1].cartItemsArray !== undefined &&
          //   resText[1].cartItemsArray !== false
          // ) {
          //   document.cookie = `cartItemsArray=${JSON.stringify(
          //     resText[1].cartItemsArray
          //   )}; expires=Session; path=/;`
          // } else {
          //   document.cookie = `cartItemsArray=${[]}; expires=Session; path=/;`
          // }
          navigate(`/${findname}`)
        }
        if (resText[0] === "Creation Failed") {
          alert("Something went wrong. Please try again.")
        }
        //     if (response.status === 200) {
        //       const resText = await response.text()
        //       if (resText === "User does not exist") {
        //         alert("User does not exist")
        //         setUserName("")
        //         setPassword("")
        //       } else {
        //         document.cookie = `username=${data.username}; expires=Session; path=/;`
        //         document.cookie = `password=${data.password}; expires=Session; path=/;`
        //         navigate("/")
        //       }
        //     } else {
        //       alert("Server problem")
        //     }
        //   },
        //   function (error) {
        //     error.message //=> String
      })
      .catch((error) => console.log(error))
  }
  // тут має бути перевірка чи залогінено і
  // тоді навігація на сторінку юзер інтерфейсу
  const register = async () => {
    if (!enableCreation()) {
      alert("Wrong registration values")
      return
    }
    let data: any = {
      username: "",
      password: password,
      phoneNumber: phoneNumber,
    }
    if (chatLink && chatType) {
      data = {
        username: "",
        password: password,
        phoneNumber: phoneNumber,
        chatLink: chatLink,
        chatType: chatType,
      }
    }
    // fetch(`http://localhost:4000/users`, {
    fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/users/createNewUser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        withCredentials: "true",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    }).then(async (response) => {
      const resText = await response.json()
      if (resText[0] === "User Exists") {
        alert(
          "User existed, password matched existing user, you were logged in"
        )
        let findname = resText[1].findname
        document.cookie = `auth_token=${resText[1].auth_token}; expires=Session; path=/;`
        navigate(`/${findname}`)
      } else {
        if (
          resText[0] ===
          "User is already registered, but wrong password was entered"
        ) {
          alert("User is already registered, but wrong password was entered")
          setPassword("")
        }
        if (resText[0] === "Created Successfully") {
          let findname = resText[1].findname
          document.cookie = `auth_token=${resText[1].auth_token}; expires=Session; path=/;`
          navigate(`/${findname}`)
        }
        if (resText[0] === "User Updated") {
          const findname = resText[1]
          document.cookie = `auth_token=${resText[2]}; expires=Session; path=/;`
          navigate(`/${findname}`)
        }
        if (resText[0] === "User is already subscribed") {
          const findname = resText[1]
          document.cookie = `auth_token=${resText[2]}; expires=Session; path=/;`
          navigate(`/${findname}`)
        }
      }
    })
  }
  const logIn = async () => {
    if (!enableCreation()) {
      alert("Wrong registration values")
      return
    }
    let data: any = {
      phoneNumber: phoneNumber,
      password: password,
    }
    if (chatLink && chatType) {
      data = {
        phoneNumber: phoneNumber,
        password: password,
        chatLink: chatLink,
        chatType: chatType,
      }
    }
    fetch(
      `${process.env.REACT_APP_SERVER_ENDPOINT}/users/findUserByNumberAndPasswordAndLoginIt`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          withCredentials: "true",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(data),
      }
    ).then(async (response: any) => {
      const resText = await response.json()
      if (resText[0] === "Logged Successfully") {
        document.cookie = `auth_token=${resText[1].auth_token}; expires=Session; path=/;`
        const findname = resText[1].findname
        navigate(`/${findname}`)
      }
      if (resText[0] === "Wrong password") {
        alert("Something went wrong on login verification. Please try again.")
      }
      if (resText[0] === "Wrong Number") {
        alert("Something went wrong on login verification. Please try again.")
      }
      if (resText[0] === "User Updated") {
        document.cookie = `auth_token=${resText[2]}; expires=Session; path=/;`
        const findname = resText[1]
        navigate(`/${findname}`)
      }
      if (resText[0] === "User is already subscribed") {
        document.cookie = `auth_token=${resText[2]}; expires=Session; path=/;`
        const findname = resText[1]
        navigate(`/${findname}`)
      }
    })
  }

  return (
    <>
      <div id="loginPage">
        <div id="loginWindow">
          <img id="icon-img" src="./messanger-img.png" alt="" />
          <h1>Log in to SilenTalk</h1>
          <div id="phoneNumber" className="phoneNumber">
            {/* <p>Phone number</p>
                    <input
                      type="text"
                      // placeholder="Your Email or phone number"
                      onChange={(event) => {
                        setPhoneNumber(event.target.value)
                      }}
                      value={phoneNumber}
                    /> */}
            <PhoneInput
              defaultCountry="UA"
              placeholder="Enter phone number"
              // value={phoneNumber}
              onChange={(event: any) => {
                try {
                  setPhoneNumber(event)
                  if (pressedRegister || pressedLogin) {
                    setPressedLogin(false)
                    setPressedRegister(false)
                  }
                } catch {}
              }}
            />
            <p id="p1">{phoneNumber}</p>
            <p className="p2">{phoneNumberValidationText}</p>
          </div>
          <div
            id="loginChoice"
            style={
              pressedRegister || pressedLogin
                ? { opacity: "0", top: "686px", pointerEvents: "none" }
                : {}
            }
          >
            <div id="choiceDivMega">
              <div
                id="choiceDiv"
                onClick={() => {
                  if (
                    phoneNumberValidationText === "Not possible phone number"
                  ) {
                    let pn = document.getElementById(
                      "phoneNumber"
                    ) as HTMLDivElement
                    pn.classList.add("phoneNumberBlink")
                    setTimeout(function () {
                      pn.classList.remove("phoneNumberBlink")
                    }, 1000)
                    return
                  }
                  setPressedLogin(true)
                }}
              >
                Login
              </div>
              Or
              <div
                id="choiceDiv"
                onClick={() => {
                  if (
                    phoneNumberValidationText === "Not possible phone number"
                  ) {
                    let pn = document.getElementById(
                      "phoneNumber"
                    ) as HTMLDivElement
                    pn.classList.add("phoneNumberBlink")
                    setTimeout(function () {
                      pn.classList.remove("phoneNumberBlink")
                    }, 1000)
                    return
                  }
                  setPressedRegister(true)
                }}
              >
                Sign Up
              </div>
            </div>
            Or
            <div
              id="googleChoiceDiv"
              style={{
                pointerEvents:
                  phoneNumberValidationText === "✔" ? "auto" : "none",
              }}
            >
              <GoogleOAuthProvider clientId="462038566904-on9gilvibjlenbcaamj6odhl7di3omkh.apps.googleusercontent.com">
                <GoogleLogin
                  onSuccess={(CredentialResponse: any) => {
                    // console.log(CredentialResponse)
                    const { credential } = CredentialResponse
                    const strCredential = String(credential)
                    const payload = strCredential
                      ? decodeJwt(strCredential)
                      : undefined
                    if (payload) {
                      serverGoogleAuthentification(strCredential, phoneNumber)
                    }
                  }}
                  onError={() => {
                    console.log("Error Ocured on Google_Login")
                  }}
                  // useOneTap
                />
              </GoogleOAuthProvider>
            </div>
          </div>
          <div
            className="afterPressed"
            style={
              pressedLogin
                ? { opacity: "1", top: "341px", pointerEvents: "all" }
                : {}
            }
          >
            <div id="mainDiv">
              <div id="password">
                <input
                  type="password"
                  // placeholder="Your Password"
                  onChange={(event) => {
                    setPassword(event.target.value)
                  }}
                  value={password}
                  placeholder="Password"
                />
              </div>
              <div id="signWrapper">
                <div id="toSingUpButton" onClick={logIn}>
                  Log In
                </div>

                <div
                  id="SignUpGoogle"
                  style={{
                    pointerEvents:
                      phoneNumberValidationText === "✔" ? "auto" : "none",
                  }}
                >
                  <GoogleOAuthProvider clientId="462038566904-on9gilvibjlenbcaamj6odhl7di3omkh.apps.googleusercontent.com">
                    <GoogleLogin
                      onSuccess={(CredentialResponse: any) => {
                        const { credential } = CredentialResponse
                        const strCredential = String(credential)
                        const payload = strCredential
                          ? decodeJwt(strCredential)
                          : undefined
                        if (payload) {
                          serverGoogleAuthentification(
                            strCredential,
                            phoneNumber
                          )
                        }
                      }}
                      onError={() => {
                        console.log("Error Ocured on Google_Login")
                      }}
                      // useOneTap
                    />
                  </GoogleOAuthProvider>
                </div>
              </div>
              <div
                id="changeOption"
                onClick={() => {
                  setPressedRegister(true)
                  setPressedLogin(false)
                  setPassword("")
                  setPasswordRepeat("")
                }}
              >
                sign up instead
              </div>
            </div>
          </div>
          <div
            className="afterPressed"
            style={
              pressedRegister
                ? { opacity: "1", top: "341px", pointerEvents: "all" }
                : {}
            }
          >
            <div id="mainDiv">
              <div id="password">
                <input
                  type="password"
                  // placeholder="Your Password"
                  onChange={(event) => {
                    setPassword(event.target.value)
                  }}
                  value={password}
                  placeholder="Password"
                />
                <p>{passwordValidationText}</p>
              </div>
              <div id="repeatPassword">
                <input
                  type="password"
                  // placeholder="Repeat Password*"
                  onChange={(event) => {
                    setPasswordRepeat(event.target.value)
                  }}
                  value={passwordRepeat}
                  placeholder="Repeat Password"
                />
                <p>{repeatPasswordValidationText}</p>
              </div>
              <div id="signWrapper">
                <div id="toSingUpButton" onClick={register}>
                  Sign Up
                </div>

                <div
                  id="SignUpGoogle"
                  style={{
                    pointerEvents:
                      phoneNumberValidationText === "✔" ? "auto" : "none",
                  }}
                >
                  <GoogleOAuthProvider clientId="462038566904-on9gilvibjlenbcaamj6odhl7di3omkh.apps.googleusercontent.com">
                    <GoogleLogin
                      onSuccess={(CredentialResponse: any) => {
                        const { credential } = CredentialResponse
                        const strCredential = String(credential)
                        const payload = strCredential
                          ? decodeJwt(strCredential)
                          : undefined
                        if (payload) {
                          serverGoogleAuthentification(
                            strCredential,
                            phoneNumber
                          )
                        }
                      }}
                      onError={() => {
                        console.log("Error Ocured on Google_Login")
                      }}
                      // useOneTap
                    />
                  </GoogleOAuthProvider>
                </div>
              </div>
              <div
                id="changeOption"
                onClick={() => {
                  setPressedRegister(false)
                  setPressedLogin(true)
                  setPasswordRepeat("")
                  setPassword("")
                }}
              >
                log in instead
              </div>
            </div>
          </div>
          <div className="screen"></div>

          {/* <button>
          <a href={getGoogleUrl(from)}>Sign in with google</a>
          </button> */}
        </div>
      </div>
    </>
  )
}
