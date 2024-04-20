import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"

export function AddToChat(this: any) {
  let { chatLink } = useParams()
  let { chatType } = useParams()
  const [chatFindName, setChatFindName] = useState("")
  const [chatUserName, setChatUserName] = useState("")
  const [unclickable, setUnclickable] = useState(true)
  let navigate = useNavigate()
  let notrealauthtoken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth_token="))
    ?.split("=")[1]

  async function subscribe() {
    if (notrealauthtoken) {
      fetch(
        `${process.env.REACT_APP_SERVER_ENDPOINT}/users/verifyTokenAndSendData/${notrealauthtoken}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            withCredentials: "true",
            "Access-Control-Allow-Origin": "*",
          },
        }
      ).then(async (response) => {
        const resText = await response.json()
        if (resText[0] === "No token send") {
        }
        if (resText[0] === "Wrong Token") {
        }
        if (resText[0] === "Back is good") {
          let findname = resText[1].findname

          let data = {
            auth_token: notrealauthtoken,
            chatLink: chatLink,
            chatType: chatType,
          }
          fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/users/updateUser`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              withCredentials: "true",
              "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify(data),
          }).then(async (response) => {
            const resText = await response.json()
            if (resText[0] === "User is already subscribed") {
              alert("User already subscribed")
              navigate(`/${findname}`)
            }
            if (resText[0] === "User Updated") {
              navigate(`/${findname}`)
            }
          })
        }
      })
    } else {
      document.cookie = `chatLink=${chatLink}; expires=Session; path=/;`
      document.cookie = `chatType=${chatType}; expires=Session; path=/;`
      alert("Log in or Sign Up to proceed")
      navigate("/")
    }
  }
  useEffect(() => {
    async function name() {
      if (chatLink && chatType) {
        const requestHeaders = new Headers([
          ["Content-Type", "application/json"],
          ["withCredentials", "true"],
          ["Access-Control-Allow-Origin", "*"],
          ["chatLink", chatLink],
          ["chatType", chatType],
        ])

        fetch(
          `${process.env.REACT_APP_SERVER_ENDPOINT}/users/fetchChatByLink`,
          {
            method: "GET",
            headers: requestHeaders,
          }
        ).then(async (response: any) => {
          const resText = await response.json()
          if (resText[0] === "No chanell matching this link") {
            alert("wrongLink")
            setChatFindName("Wrong Link")
            setChatUserName("Wrong Link")
          }
          if (resText[0] === "Chanell exists") {
            setChatFindName(resText[1])
            setChatUserName(resText[2])
            setUnclickable(false)
          } else {
            alert("Fetch is bad")
          }
        })
      }
      //   fetch chat by link, if so, get findname, username,
      //   if user presses Subscribe, fetch user via cookies, ======>
      //   if no auth token, proceed to login page, on login page
      //   add ability to register andf login and google only to
      //   add chat to user, then navigate to UserInterface
    }
    name()
  }, [])

  return (
    <>
      <div id="addToChatWholeDiv">
        <div id="addToChatWindowDiv">
          {chatUserName}, @{chatFindName}
          <button
            style={
              unclickable
                ? { pointerEvents: "none" }
                : { pointerEvents: "auto" }
            }
            onClick={subscribe}
          >
            Subscribe
          </button>
        </div>
      </div>
    </>
  )
}
