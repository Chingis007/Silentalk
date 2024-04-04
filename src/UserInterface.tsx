import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
export function UserInterface() {
  let navigate = useNavigate()
  const [msgsList, setMsgsList] = useState(["", "", "", "", "", ""])
  // const [searchParams, setSearchParams] = useSearchParams()
  // const [username, setUsername] = useState("")
  const [openedChat, setOpenedChat] = useState("")
  const [pageJustLoaded, setPageJustLoaded] = useState(true)
  const [showcreateoptions, setShowCreateOptions] = useState(false)
  const [createNewChanell, setCreateNewChanell] = useState(false)
  const [createNewGroup, setCreateNewGroup] = useState(false)
  const [createNewPrivateChat, setCreateNewPrivateChat] = useState(false)
  const [username, setUsername] = useState("")
  const [botsList, setBotsList] = useState([""])
  const [chatsList, setChatsList] = useState([""])
  const [groupsList, setGroupsList] = useState([""])
  const [servicesList, setServicesList] = useState([""])
  const [chanellsList, setChanellsList] = useState([""])
  const [phoneNumber, setPhoneNumber] = useState("")
  const [chanellName, setChanellName] = useState("")
  const [chanellDiscription, setChanellDiscription] = useState("")
  const [chanellImgUrl, setChanellImgUrl] = useState("")
  const [chanellImg, setChanellImg] = useState<File | null>(null)
  const [showImg, setShowImg] = useState(false)
  let { usernameParam } = useParams()

  const [auth_token, setAuth_token] = useState("")
  let notrealauthtoken = document.cookie
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
    if (notrealauthtoken) {
      const fetchData = async (notrealauthtoken: any) => {
        const fetchData = async (notrealauthtoken: any) => {
          setAuth_token(notrealauthtoken)
          console.log(auth_token)
        }
        await fetchData(notrealauthtoken)
        console.log("1")
        console.log("1", auth_token)
        findUserChats(auth_token)
      }
      fetchData(notrealauthtoken)
    } else {
      // alert("Baba ne chye, sprobyite piznishe")
    }
  }, [])

  // const arrangeChats = async () => {
  //   const [botsList, setBotsList] = useState([""])
  //   const [chatsList, setChatsList] = useState([""])
  //   const [groupsList, setGroupsList] = useState([""])
  //   const [servicesList, setServicesList] = useState([""])
  //   const [chanellsList, setChanellsList] = useState([""])
  // }

  const createChanell = async () => {
    let secure_url
    if (chanellImg != null) {
      let formData = new FormData()
      formData.append("file", chanellImg)
      formData.append("upload_preset", "vbght5om")
      let url = new URL(
        `https://api.cloudinary.com/v1_1/${process.env.VITE_REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`
      )
      fetch(url, {
        method: "POST",
        body: formData,
      })
        .then(async (response) => {
          const resText = await response.json()
          secure_url = resText.secure_url
        })
        .catch((error) => {
          console.log(error)
        })
    }
    let data
    if (secure_url) {
      data = {
        auth_token: auth_token,
        chanellName: chanellName,
        chanellDiscription: chanellDiscription,
        photoLink: secure_url,
      }
    } else {
      data = {
        auth_token: auth_token,
        chanellName: chanellName,
        chanellDiscription: chanellDiscription,
      }
    }

    fetch(`${process.env.REACT_APP_SERVER_ENDPOINT}/users/createNewChanell`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        withCredentials: "true",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(data),
    }).then(async (response) => {
      const resText = await response.json()
      if (resText[0] == "chanell created successfully") {
        let kjkjkjk = chanellsList
        kjkjkjk.push(resText[1])
        setChanellsList(kjkjkjk)
        // arrange chats here
        setOpenedChat(resText[1])
      }
    })
  }

  const findUserChats = async (auth_token: string) => {
    fetch(
      `${process.env.REACT_APP_SERVER_ENDPOINT}/users/CheckIfTokenValidAndSendUserData/${auth_token}`,
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
          let userObj = resText[1]
          document.cookie = `botsList=${userObj.botsList}; expires=Session; path=/;`
          document.cookie = `chatsList=${userObj.chatsList}; expires=Session; path=/;`
          document.cookie = `groupsList=${userObj.groupsList}; expires=Session; path=/;`
          document.cookie = `servicesList=${userObj.servicesList}; expires=Session; path=/;`
          document.cookie = `chanellsList=${userObj.chanellsList}; expires=Session; path=/;`
          document.cookie = `phoneNumber=${userObj.phoneNumber}; expires=Session; path=/;`
          document.cookie = `username=${userObj.username}; expires=Session; path=/;`
          setBotsList(userObj.botsList)
          setChatsList(userObj.chatsList)
          setGroupsList(userObj.groupsList)
          setServicesList(userObj.servicesList)
          setChanellsList(userObj.chanellsList)
          setPhoneNumber(userObj.phoneNumber)
          setUsername(userObj.username)
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

  function onImageChoose(event: React.ChangeEvent<HTMLInputElement>) {
    const myTarget = event.target as HTMLInputElement
    if (event.target.files?.length) {
      setChanellImg(event.target.files[0])
      setChanellImgUrl(URL.createObjectURL(event.target.files[0]))
      setShowImg(!showImg)
    } else {
      setChanellImgUrl("")
      setChanellImg(null)
    }
  }
  return (
    <>
      <p>{username}</p>
      <div id="userInterfaceBorder">
        <div id="userInterfaceMain">
          <div id="userInterfaceChatsColumn">
            <div id="bigInterfaceColumn">
              <div
                className={`regularColumn ${
                  createNewChanell || createNewGroup || createNewPrivateChat
                    ? "toleft"
                    : pageJustLoaded
                    ? "none"
                    : "back"
                } `}
              >
                <div id="userInterfaceChatsColumnHead">
                  <div id="userInterfaceChatsColumnHeadSettings">
                    <img src="./menu.png" alt="" />
                  </div>
                  <div id="userInterfaceChatsColumnHeadSearch">
                    <input type="text" />
                  </div>
                </div>
                <div className={`userInterfaceChatsColumnChats`}>
                  {chatsList.map((item) => {
                    return (
                      <div className="userInterfaceChatsColumnOneChat">
                        <div className="userInterfaceChatsColumnOneChatImg">
                          IMG
                        </div>
                        <div className="userInterfaceChatsColumnOneChatNotImg">
                          <div className="userInterfaceChatsColumnOneChatNotImgTopLine">
                            <div className="userInterfaceChatsColumnOneChatNotImgName">
                              Name
                            </div>
                            <div className="userInterfaceChatsColumnOneChatNotImgDate">
                              Date
                            </div>
                          </div>
                          <div className="userInterfaceChatsColumnOneChatNotImgBotLine">
                            <div className="userInterfaceChatsColumnOneChatNotImgLastMsg">
                              Last Msg
                            </div>
                            <div className="userInterfaceChatsColumnOneChatNotImgPindOrMsgCount">
                              PindOrMsgCount
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div id="columnForOther">
                <div
                  className={`createNewChanell ${
                    createNewChanell ? "toleft" : "back"
                  }`}
                >
                  <div id="createNewChanellHead">
                    <div
                      id="createNewChanellHeadArrow"
                      onClick={() => {
                        setCreateNewChanell(false)
                      }}
                    >
                      <img src={"./icons8-arrow-left-50.png"} alt="" />
                    </div>
                    <p>New Chanell</p>
                  </div>
                  <div id="createNewChanellImgDiv">
                    <input
                      id="chanellImgInput"
                      type="file"
                      onChange={(event) => {
                        onImageChoose(event)
                      }}
                    />
                    <img
                      onClick={() => {
                        let myinput = document.getElementById("chanellImgInput")
                        if (myinput != null) {
                          myinput.click()
                        }
                      }}
                      id="createNewChanellImgDivImg"
                      src={chanellImgUrl ? chanellImgUrl : "./blank_photo.png"}
                      alt=""
                    />
                  </div>
                  <div id="createNewChanellNameInput">
                    <input
                      type="text"
                      placeholder="Chanell name"
                      onChange={(event) => {
                        setChanellName(event.target.value)
                      }}
                    />
                  </div>
                  <div id="createNewChanellDiscriptionsInput">
                    <input
                      type="text"
                      placeholder="Discriptions (optional)"
                      onChange={(event) => {
                        setChanellDiscription(event.target.value)
                      }}
                    />
                  </div>
                  <p>
                    {" "}
                    You can provide an optional description for your chanell.
                  </p>
                  <div
                    id={`${
                      chanellName != "" ? "createNewChanellForward" : "hide"
                    }`}
                    onClick={() => {
                      createChanell()
                    }}
                  >
                    <img src={"./icons8-arrow-right-64.png"} alt="" />
                  </div>
                </div>
                <div
                  className={`createNewGroup ${
                    createNewGroup ? "toleft" : "back"
                  }`}
                ></div>
                <div
                  className={`createNewPrivateChat ${
                    createNewPrivateChat ? "toleft" : "back"
                  }`}
                ></div>
              </div>
            </div>
            <div
              id={
                createNewChanell || createNewGroup || createNewPrivateChat
                  ? "hide"
                  : "createButton"
              }
              onClick={() => {
                setShowCreateOptions(!showcreateoptions)
              }}
            >
              <img src={"./pencil-svgrepo-com.svg"} alt="" />
            </div>
            <div className={showcreateoptions ? "createOptions" : "hide"}>
              <div
                className="option"
                onClick={() => {
                  setPageJustLoaded(false)
                  setCreateNewChanell(true)
                  setShowCreateOptions(!showcreateoptions)
                }}
              >
                <img src={"./icons8-speaker-50.png"} alt="" /> New Chanell
              </div>
              <div
                className="option"
                onClick={() => {
                  setCreateNewGroup(true)
                  setShowCreateOptions(!showcreateoptions)
                }}
              >
                <img src={"./icons8-business-group-32.png"} alt="" /> New Group
              </div>
              <div
                className="option"
                onClick={() => {
                  setCreateNewPrivateChat(true)
                  setShowCreateOptions(!showcreateoptions)
                }}
              >
                <img src={"./icons8-man-50.png"} alt="" /> New Private Chat
              </div>
            </div>
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
