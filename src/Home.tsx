import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"
import { decodeJwt } from "jose"
import { parsePhoneNumber } from "libphonenumber-js"
import PhoneInput from "react-phone-number-input"

export function Home() {
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
      ["myAuthProp", credential],
      ["myPhoneNumber", phoneNumber],
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
        if (resText[0] === "Email Exists") {
          document.cookie = `auth_token=${resText[1].auth_token}; expires=Session; path=/;`
          document.cookie = `email=${resText[1].email}; expires=Session; path=/;`
          document.cookie = `emailImgUrl=${resText[1].emailImgUrl}; expires=Session; path=/;`
          if (
            resText[1].cartItemsArray !== undefined &&
            resText[1].cartItemsArray !== false
          ) {
            document.cookie = `cartItemsArray=${JSON.stringify(
              resText[1].cartItemsArray
            )}; expires=Session; path=/;`
          } else {
            document.cookie = `cartItemsArray=${[]}; expires=Session; path=/;`
          }
          navigate("/")
        }
        if (
          resText[0] ===
          "Something went wrong on password verification. Please try again."
        ) {
          alert(
            "Something went wrong on password verification. Please try again."
          )
        }
        if (resText[0] === "Created Successfully") {
          document.cookie = `auth_token=${resText[1].auth_token}; expires=Session; path=/;`
          document.cookie = `email=${resText[1].email}; expires=Session; path=/;`
          document.cookie = `emailImgUrl=${resText[1].emailImgUrl}; expires=Session; path=/;`
          if (
            resText[1].cartItemsArray !== undefined &&
            resText[1].cartItemsArray !== false
          ) {
            document.cookie = `cartItemsArray=${JSON.stringify(
              resText[1].cartItemsArray
            )}; expires=Session; path=/;`
          } else {
            document.cookie = `cartItemsArray=${[]}; expires=Session; path=/;`
          }
          navigate("/")
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
    const data = {
      username: "",
      password: password,
      phoneNumber: phoneNumber,
      groupsList: [],
      publicsList: [],
      chatsList: [],
      botsList: [],
    }
    // fetch(`http://localhost:4000/users`, {
    fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/users`, {
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
        let user = resText[1].user
        document.cookie = `auth_token=${resText[1].auth_token}; expires=Session; path=/;`
        document.cookie = `email=${resText[1].user}; expires=Session; path=/;`
        document.cookie = `emailImgUrl=${resText[1].emailImgUrl}; expires=Session; path=/;`
        navigate(`/${user}`)
      } else {
        if (
          resText[0] ===
          "Email is already registered, but wrong password was entered"
        ) {
          alert("Email is already registered, but wrong password was entered")
          setPassword("")
        }
        if (resText[0] === "Created Successfully") {
          let user = resText[1].user
          document.cookie = `auth_token=${resText[1].auth_token}; expires=Session; path=/;`
          document.cookie = `email=${resText[1].email}; expires=Session; path=/;`
          document.cookie = `emailImgUrl=${resText[1].emailImgUrl}; expires=Session; path=/;`
          alert("Created Successfully")
          navigate(`/${user}`)
        }
      }
    })
  }
  const logIn = async () => {}

  return (
    <>
      <div id="loginPage">
        <div id="loginWindow">
          {pressedLogin ? (
            <div id="LoginWindowLogin">
              <div id="backToChoose" onClick={(e) => setPressedLogin(false)}>
                Go Back
              </div>
              <div id="phoneNumber">
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
                  value={phoneNumber}
                  onChange={(event: any) => {
                    try {
                      setPhoneNumber(event)
                    } catch {}
                  }}
                />
                <p>
                  {phoneNumber} {phoneNumberValidationText}
                </p>
              </div>
              <div id="password">
                <p>Password</p>
                <input
                  type="password"
                  // placeholder="Your Password"
                  onChange={(event) => {
                    setPassword(event.target.value)
                  }}
                  value={password}
                />
              </div>
              <div id="toSingUpButton" onClick={logIn}>
                Log In
              </div>
            </div>
          ) : pressedRegister ? (
            <div id="LoginWindowRegister">
              <div id="backToChoose" onClick={(e) => setPressedRegister(false)}>
                Go Back
              </div>
              <div id="phoneNumber">
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
                  value={phoneNumber}
                  onChange={(event: any) => {
                    try {
                      setPhoneNumber(event)
                    } catch {}
                  }}
                />
                <p>
                  {phoneNumber} {phoneNumberValidationText}
                </p>
              </div>
              <div id="password">
                <p>Password</p>
                <input
                  type="password"
                  // placeholder="Your Password"
                  onChange={(event) => {
                    setPassword(event.target.value)
                  }}
                  value={password}
                />
              </div>
              <div id="repeatPassword">
                <p>
                  Repeat Password <p>{repeatPasswordValidationText}</p>
                </p>
                <input
                  type="password"
                  // placeholder="Repeat Password*"
                  onChange={(event) => {
                    setPasswordRepeat(event.target.value)
                  }}
                />
              </div>
              <div id="toSingUpButton" onClick={register}>
                Sign Up
              </div>
            </div>
          ) : pressedGoogle ? (
            <div id="LoginWindowGoogle">
              <div id="backToChoose" onClick={(e) => setPressedGoogle(false)}>
                Go Back
              </div>
              <div id="phoneNumber">
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
                  value={phoneNumber}
                  onChange={(event: any) => {
                    try {
                      setPhoneNumber(event)
                    } catch {}
                  }}
                />
                <p>
                  {phoneNumber} {phoneNumberValidationText}
                </p>
              </div>
              <div id="SignUpGoogle">
                <div
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
            </div>
          ) : (
            <div id="LoginWindowChoose">
              <div id="Login" onClick={(e) => setPressedLogin(true)}>
                Log in
              </div>
              <div id="SignUp" onClick={(e) => setPressedRegister(true)}>
                Sign Up
              </div>
              <div
                id="SignUpGoogle"
                onClick={(e) => {
                  setPressedGoogle(true)
                }}
              >
                <div style={{ pointerEvents: "none" }}>
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
                          serverGoogleAuthentification(
                            strCredential,
                            "no number needed"
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
                {/* <button>
          <a href={getGoogleUrl(from)}>Sign in with google</a>
        </button> */}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
