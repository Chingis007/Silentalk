import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
export function UserInterface() {
  const [chatsList, setChatsList] = useState(["", "", ""])
  const [msgsList, setMsgsList] = useState(["", "", "", "", "", ""])
  // const [searchParams, setSearchParams] = useSearchParams()
  // const [username, setUsername] = useState("")
  let { username } = useParams()
  let auth_token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth_token="))
    ?.split("=")[1]
  // useEffect(() => {
  //   const urlSearchString = window.location.search
  //   console.log(urlSearchString)
  //   const params = new URLSearchParams(urlSearchString)
  //   console.log(params)
  //   const username = params.get("username")
  //   console.log(username)
  //   if (typeof username == "string") {
  //     setUsername(username)
  //   }
  // }, [])
  useEffect(() => {
    if (username && auth_token) {
      findUserChats(username, auth_token)
    } else {
      alert("Baba ne chye, sprobyite piznishe")
    }
  }, [])

  const findUserChats = async (username: string, auth_token: string) => {
    fetch(
      `${process.env.REACT_APP_SERVER_ENDPOINT}/users/verifyTokenAndSend/${auth_token}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          withCredentials: "true",
          "Access-Control-Allow-Origin": "*",
        },
      }
    ).then(async (response) => {
      try {
        const resText = await response.json()
        if (resText[0] === "Back is good") {
          // alert("Succesfull request but bad responce")
          console.log(resText)
          console.log(resText[0])
          console.log(resText[1])
          let userObj = resText[1]
          // document.cookie = `auth_token=${userObj[1].auth_token}; expires=Session; path=/;`
          // document.cookie = `email=${userObj[1].user}; expires=Session; path=/;`
          // document.cookie = `emailImgUrl=${userObj[1].emailImgUrl}; expires=Session; path=/;`
        }
      } catch (error) {
        console.log(error)
      }

      // else {
      //   if (
      //     resText[0] ===
      //     "Email is already registered, but wrong password was entered"
      //   ) {
      //     alert("Email is already registered, but wrong password was entered")
      //   }
      //   if (resText[0] === "Created Successfully") {
      //     let user = resText[1].user
      //     document.cookie = `auth_token=${resText[1].auth_token}; expires=Session; path=/;`
      //     document.cookie = `email=${resText[1].email}; expires=Session; path=/;`
      //     document.cookie = `emailImgUrl=${resText[1].emailImgUrl}; expires=Session; path=/;`
      //     alert("Created Successfully")
      //   }
      // }
    })
  }
  return (
    <>
      <p>{username}</p>
      <div id="userInterfaceBorder">
        <div id="userInterfaceMain">
          <div id="userInterfaceChatsColumn">
            <div id="userInterfaceChatsColumnHead">
              <div id="userInterfaceChatsColumnHeadSettings">|||</div>
              <div id="userInterfaceChatsColumnHeadSearch">search</div>
            </div>
            {chatsList.map((item) => {
              return (
                <div id="userInterfaceChatsColumnOneChat">
                  <div id="userInterfaceChatsColumnOneChatImg">IMG</div>
                  <div id="userInterfaceChatsColumnOneChatNotImg">
                    <div id="userInterfaceChatsColumnOneChatNotImgTopLine">
                      <div id="userInterfaceChatsColumnOneChatNotImgName">
                        Name
                      </div>
                      <div id="userInterfaceChatsColumnOneChatNotImgDate">
                        Date
                      </div>
                    </div>
                    <div id="userInterfaceChatsColumnOneChatNotImgBotLine">
                      <div id="userInterfaceChatsColumnOneChatNotImgLastMsg">
                        Last Msg
                      </div>
                      <div id="userInterfaceChatsColumnOneChatNotImgPindOrMsgCount">
                        PindOrMsgCount
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div id="userInterfaceChat">
            <div id="userInterfaceChatHead">
              <div id="userInterfaceChatHeadImg">Img</div>
              <div id="userInterfaceChatHeadNameColumn">
                <div id="userInterfaceChatHeadNameColumnName">Name</div>
                <div id="userInterfaceChatHeadNameColumnLastSeen">
                  Bot or participants or subs and online or last seen
                </div>
              </div>
              <div id="userInterfaceChatHeadCall">Call</div>
              <div id="userInterfaceChatHeadNotifications">Notifications</div>
              <div id="userInterfaceChatHeadHidePinned">HidePinned</div>
              <div id="userInterfaceChatHeadOnePinned">OnePinned</div>
              <div id="userInterfaceChatHeadAllPinned">AllPinned</div>
              <div id="userInterfaceChatHeadVideoChat">VideoChat</div>
              <div id="userInterfaceChatHeadSearch">Search</div>
              <div id="userInterfaceChatHeadSettings">Setting</div>
            </div>
            <div id="userInterfaceChatMainBackground">
              <div id="userInterfaceChatMainMsgesColumn">
                {msgsList.map((item) => {
                  return <div id="msg">msg</div>
                })}
                <div id="userInterfaceChatMainInputBar">
                  <div id="userInterfaceChatMainInputSmile">Smile</div>
                  <div id="userInterfaceChatMainInputText">Text</div>
                  <div id="userInterfaceChatMainInputFile">File</div>
                </div>
              </div>
              <div id="userInterfaceChatMainInputVoice">Voice</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
