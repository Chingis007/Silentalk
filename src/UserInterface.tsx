import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { url } from "inspector"
import {
  JSXElementConstructor,
  ReactElement,
  ReactNode,
  ReactPortal,
  useEffect,
  useRef,
  useState,
} from "react"

import { useNavigate, useParams, useSearchParams } from "react-router-dom"
export type msgType = { img: string; comentary: string; emotions: emotions[] }
export type emotions = { name: string; count: number }
export function UserInterface(this: any) {
  let navigate = useNavigate()
  const refValue = useRef()
  const myRef = useRef<HTMLDivElement>(null)
  let key = 0
  const [currentChatMsgsList, setCurrentChatMsgsList] = useState<msgType[]>([
    // {
    //   img: "https://res.cloudinary.com/dy9emuyvs/image/upload/v1691776582/uddsi7lqdr2dw6xc23cv.png",
    //   comentary: "fat",
    //   emotions: [
    //     { name: "laughface", count: 1 },
    //     { name: "angryface", count: 3 },
    //   ],
    // },
    // {
    //   img: "https://res.cloudinary.com/dy9emuyvs/image/upload/v1691776582/uddsi7lqdr2dw6xc23cv.png",
    //   comentary: "fat",
    //   emotions: [
    //     { name: "laughface", count: 1 },
    //     { name: "angryface", count: 3 },
    //   ],
    // },
    // {
    //   img: "https://res.cloudinary.com/dy9emuyvs/image/upload/v1691776582/uddsi7lqdr2dw6xc23cv.png",
    //   comentary: "fat",
    //   emotions: [
    //     { name: "laughface", count: 1 },
    //     { name: "angryface", count: 3 },
    //   ],
    // },
    // {
    //   img: "https://res.cloudinary.com/dy9emuyvs/image/upload/v1691776582/uddsi7lqdr2dw6xc23cv.png",
    //   comentary: "fat",
    //   emotions: [
    //     { name: "laughface", count: 1 },
    //     { name: "angryface", count: 3 },
    //   ],
    // },
    // {
    //   img: "",
    //   comentary: "he is not fat",
    //   emotions: [{ name: "angryface", count: 10 }],
    // },
    // {
    //   img: "https://res.cloudinary.com/dy9emuyvs/image/upload/v1691776582/uddsi7lqdr2dw6xc23cv.png",
    //   comentary: "slava ukraini",
    //   emotions: [{ name: "thumbsup", count: 5203 }],
    // },
    // { img: "", comentary: "gay sex", emotions: [] },
    // {
    //   img: "",
    //   comentary:
    //     "girl sex is actualy good and very long like this text i force myself to write",
    //   emotions: [
    //     { name: "laughface", count: 1 },
    //     { name: "angryface", count: 3 },
    //   ],
    // },
    // {
    //   img: "https://res.cloudinary.com/dy9emuyvs/image/upload/v1691776582/uddsi7lqdr2dw6xc23cv.png",
    //   comentary: "помився",
    //   emotions: [
    //     { name: "laughface", count: 1 },
    //     { name: "angryface", count: 3 },
    //   ],
    // },
  ])

  // const [searchParams, setSearchParams] = useSearchParams()
  // const [username, setUsername] = useState("")
  //                                              <any>   <[{},{}]>
  const [allChatsList, setAllChatsList] = useState<any>([
    {
      group: "service",
      username: "silentalk",
      serviceUniqueCode: "100000001",
      undernameDiscription: "service notification",
      findname: "silentalk",
      photoLink:
        "https://res.cloudinary.com/dy9emuyvs/image/upload/v1691776582/uddsi7lqdr2dw6xc23cv.png",
      lastUpdated: "1712474021963",
      messages: [],
    },
    {
      group: "chanell",
      username: "morozio",
      findname: "morozio",
      chanellDiscription: "morozioDiscription",
      partisipants: ["+380953035989"],
      publicUniqueCode: "publicUniqueCode",
      link: "link",
      lastUpdated: "1712674021963",
      messages: [
        { img: "", comentary: "gay sex", emotions: [] },
        {
          img: "",
          comentary:
            "girl sex is actualy good and very long like this text i force myself to write",
          emotions: [
            { name: "laughface", count: "1" },
            { name: "angryface", count: "3" },
          ],
        },
        {
          img: "https://res.cloudinary.com/dy9emuyvs/image/upload/v1691776582/uddsi7lqdr2dw6xc23cv.png",
          comentary: "помився",
          emotions: [
            { name: "laughface", count: "1" },
            { name: "angryface", count: "3" },
          ],
        },
      ],
      pinned: "",
      photoLink:
        "https://res.cloudinary.com/dy9emuyvs/image/upload/v1691776582/uddsi7lqdr2dw6xc23cv.png",
    },
  ])
  const [openedChat, setOpenedChat] = useState({ type: "", findname: "" })
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
  const [currentChatImgSrc, setCurrentChatImgSrc] = useState("")
  const [currentChatName, setCurrentChatName] = useState("")
  const [currentChatSubs, setCurrentChatSubs] = useState("")
  const [currentChatType, setCurrentChatType] = useState("")
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

  const arrangeChats = async (allList: any) => {
    if (!allList) {
      return
    }
    let newAllList = [...allList]
    newAllList.sort((a: any, b: any) => {
      return b.lastUpdated - a.lastUpdated
    })
    // allList =
    // [
    //   {
    //       group: chanell.group,
    //       username: chanell.username,
    //       findname: chanell.findname,
    //       chanellDiscription: chanell.chanellDiscription,
    //       publicUniqueCode: chanell.publicUniqueCode,
    //       link: chanell.link,
    //       partisipants: chanell.partisipants,
    //       lastUpdated: "1712674021963",
    //       messages: chanell.messages,
    //       pinned: chanell.pinned,
    //       photoLink: chanell.photoLink,
    //     },{
    //       username: chanell.username,
    //       findname: chanell.findname,
    //       chanellDiscription: chanell.chanellDiscription,
    //       publicUniqueCode: chanell.publicUniqueCode,
    //       link: chanell.link,
    //       partisipants: chanell.partisipants,
    //       lastUpdated: "1712674021969",
    //       messages: chanell.messages,
    //       pinned: chanell.pinned,
    //       photoLink: chanell.photoLink,
    //     },
    //       {
    //         group: chanell.group,
    //         username: "silentalk",
    //         serviceUniqueCode: "100000001",
    //         undernameDiscription: "service notification",
    //         findname: "silentalk",
    //         photoLink:
    //           "https://res.cloudinary.com/dy9emuyvs/image/upload/v1691776582/uddsi7lqdr2dw6xc23cv.png",
    //         lastUpdated: "1712674021963",
    //         messages: [],
    //       },
    //     ]
    // setAllChatsList()
  }

  useEffect(() => {
    // arrangeChats(allChatsList)
    if (notrealauthtoken) {
      ;(async function doUseEffectFunc(notrealauthtoken: any) {
        setAuth_token(notrealauthtoken)
        const list: any = await findUserChats(notrealauthtoken)
        console.log(list)
        setAllChatsList(list)
      })(notrealauthtoken)
    } else {
      // alert("Baba ne chye, sprobyite piznishe")
    }
  }, [])

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
        // setChanellsList(kjkjkjk)
        // arrange chats here
        // arrange chats here
        // setOpenedChat({ type: "chanellsList", findname: resText[1] })
        // setMainPageInput("chanellsList", resText[1])
      }
    })
  }
  const setMainPageInput = (type: string, findname: string) => {
    if (type == "chanell") {
      setCurrentChatType("chanell")
      for (let i = 0; i < allChatsList.length; i++) {
        if (allChatsList[i].group != "chanell") {
          continue
        } else {
          if (allChatsList[i].findname != findname) {
            continue
          } else {
            setCurrentChatImgSrc(allChatsList[i].photoLink)
            setCurrentChatName(allChatsList[i].username)
            setCurrentChatSubs(allChatsList[i].partisipants.length)
            if (typeof allChatsList[i].messages === "undefined") {
              setCurrentChatMsgsList([])
            } else {
              setCurrentChatMsgsList(allChatsList[i].messages)
            }
            // setCurrentChatMsgsList((prevItems) => [
            //   allChatsList[i].list[l].messages,
            // ])
          }
        }
      }
    }
    if (type == "service") {
      setCurrentChatType("service")
      for (let i = 0; i < allChatsList.length; i++) {
        if (allChatsList[i].group != "service") {
          continue
        } else {
          if (allChatsList[i].findname != findname) {
            continue
          } else {
            setCurrentChatImgSrc(allChatsList[i].photoLink)
            setCurrentChatName(allChatsList[i].username)
            if (typeof allChatsList[i].messages === "undefined") {
              setCurrentChatMsgsList([])
            } else {
              setCurrentChatMsgsList(allChatsList[i].messages)
            }
            // setCurrentChatMsgsList((prevItems) => [
            //   allChatsList[i].list[l].messages,
            // ])
          }
        }
      }
    }
  }
  const findUserChats = async (auth_token: string) => {
    fetch(
      `${process.env.REACT_APP_SERVER_ENDPOINT}/users/CheckTokenAndReturnAllChats/${auth_token}`,
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
          setBotsList(userObj.botsList)
          setChatsList(userObj.chatsList)
          setGroupsList(userObj.groupsList)
          setServicesList(userObj.servicesList)
          setChanellsList(userObj.chanellsList)
          return resText[2]
          // [
          //   { botList: userObj.botsList },
          //   { chatsList: userObj.chatsList },
          //   { groupsList: userObj.groupsList },
          //   { servicesList: userObj.servicesList },
          //   { chanellsList: userObj.chanellsList },
          // ]
        }
      } catch (error) {
        // console.log(error)
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
                    <img src="./search.png" alt="" />
                    <input type="text" placeholder="Search" />
                  </div>
                </div>
                <div className={`userInterfaceChatsColumnChats`}>
                  {allChatsList.map((oneChat: any) => {
                    return oneChat.group == "service" ? (
                      <div
                        key={key++}
                        className="userInterfaceChatsColumnOneChat"
                        style={
                          openedChat.findname == oneChat.findname
                            ? {
                                backgroundColor: "#3390EC",
                                color: "white",
                              }
                            : {
                                backgroundColor: "transparent",
                                color: "black",
                              }
                        }
                        onClick={() => {
                          setOpenedChat({
                            type: "service",
                            findname: oneChat.findname,
                          })
                          setMainPageInput("service", oneChat.findname)
                        }}
                      >
                        <div className="userInterfaceChatsColumnOneChatImg">
                          <img src={oneChat.photoLink} alt="" />
                        </div>
                        <div className="userInterfaceChatsColumnOneChatNotImg">
                          <div className="userInterfaceChatsColumnOneChatNotImgTopLine">
                            <div className="userInterfaceChatsColumnOneChatNotImgName">
                              {oneChat.username}
                            </div>
                            <div className="userInterfaceChatsColumnOneChatNotImgDate">
                              {Math.abs(
                                Number(oneChat.lastUpdated) -
                                  Number(new Date().getTime())
                              ) <= 86400000
                                ? `${new Date(
                                    Number(oneChat.lastUpdated)
                                  ).toLocaleTimeString()}`
                                : Math.abs(
                                    Number(oneChat.lastUpdated) -
                                      Number(new Date().getTime())
                                  ) <= 172800000
                                ? `${new Date(Number(oneChat.lastUpdated))
                                    .toUTCString()
                                    .slice(0, 3)}`
                                : new Date().getFullYear() !=
                                  new Date(
                                    Number(oneChat.lastUpdated)
                                  ).getFullYear()
                                ? `${new Date(
                                    Number(oneChat.lastUpdated)
                                  ).toLocaleDateString("en-GB")}`
                                : `${new Date(Number(oneChat.lastUpdated))
                                    .toString()
                                    .slice(4, 10)}`}
                            </div>
                          </div>
                          <div className="userInterfaceChatsColumnOneChatNotImgBotLine">
                            <div
                              className="userInterfaceChatsColumnOneChatNotImgLastMsg"
                              // style={
                              //   oneChat.messages[-1]
                              //     ? { color: "black" }
                              //     : { color: "green" }
                              // }
                            >
                              {oneChat.messages[oneChat.messages.length - 1] ? (
                                oneChat.messages[oneChat.messages.length - 1]
                                  .img ? (
                                  <>
                                    <img
                                      src={
                                        oneChat.messages[
                                          oneChat.messages.length - 1
                                        ].img
                                          ? oneChat.messages[
                                              oneChat.messages.length - 1
                                            ].img
                                          : "./blank_photo.png"
                                      }
                                    />

                                    {
                                      oneChat.messages[
                                        oneChat.messages.length - 1
                                      ].comentary
                                    }
                                  </>
                                ) : (
                                  `${
                                    oneChat.messages[
                                      oneChat.messages.length - 1
                                    ].comentary
                                  }`
                                )
                              ) : (
                                "Created Succesfully"
                              )}
                            </div>
                            <div className="userInterfaceChatsColumnOneChatNotImgPindOrMsgCount">
                              PindOrMsgCount
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : oneChat.group == "chanell" ? (
                      <div
                        key={key++}
                        className="userInterfaceChatsColumnOneChat"
                        style={
                          openedChat.findname == oneChat.findname
                            ? {
                                backgroundColor: "#3390EC",
                                color: "white",
                              }
                            : {
                                backgroundColor: "transparent",
                                color: "black",
                              }
                        }
                        onClick={() => {
                          setOpenedChat({
                            type: "chanell",
                            findname: oneChat.findname,
                          })
                          setMainPageInput("chanell", oneChat.findname)
                        }}
                      >
                        <div className="userInterfaceChatsColumnOneChatImg">
                          <img src={oneChat.photoLink} alt="" />
                        </div>
                        <div className="userInterfaceChatsColumnOneChatNotImg">
                          <div className="userInterfaceChatsColumnOneChatNotImgTopLine">
                            <div className="userInterfaceChatsColumnOneChatNotImgName">
                              {oneChat.username}
                            </div>
                            <div className="userInterfaceChatsColumnOneChatNotImgDate">
                              {Math.abs(
                                Number(oneChat.lastUpdated) -
                                  Number(new Date().getTime())
                              ) <= 86400000
                                ? `${new Date(
                                    Number(oneChat.lastUpdated)
                                  ).toLocaleTimeString()}`
                                : Math.abs(
                                    Number(oneChat.lastUpdated) -
                                      Number(new Date().getTime())
                                  ) <= 172800000
                                ? `${new Date(Number(oneChat.lastUpdated))
                                    .toUTCString()
                                    .slice(0, 3)}`
                                : new Date().getFullYear() !=
                                  new Date(
                                    Number(oneChat.lastUpdated)
                                  ).getFullYear()
                                ? `${new Date(
                                    Number(oneChat.lastUpdated)
                                  ).toLocaleDateString("en-GB")}`
                                : `${new Date(Number(oneChat.lastUpdated))
                                    .toString()
                                    .slice(4, 10)}`}
                            </div>
                          </div>
                          <div className="userInterfaceChatsColumnOneChatNotImgBotLine">
                            <div
                              className="userInterfaceChatsColumnOneChatNotImgLastMsg"
                              // style={
                              //   oneChat.messages[
                              //     oneChat.messages.length - 1
                              //   ]
                              //     ? { color: "black" }
                              //     : { color: "green" }
                              // }
                            >
                              {oneChat.messages[oneChat.messages.length - 1] ? (
                                oneChat.messages[oneChat.messages.length - 1]
                                  .img ? (
                                  <>
                                    <img
                                      src={
                                        oneChat.messages[
                                          oneChat.messages.length - 1
                                        ].img
                                          ? oneChat.messages[
                                              oneChat.messages.length - 1
                                            ].img
                                          : "./blank_photo.png"
                                      }
                                    />

                                    {
                                      oneChat.messages[
                                        oneChat.messages.length - 1
                                      ].comentary
                                    }
                                  </>
                                ) : (
                                  `${
                                    oneChat.messages[
                                      oneChat.messages.length - 1
                                    ].comentary
                                  }`
                                )
                              ) : (
                                "Created Succesfully"
                              )}
                            </div>
                            <div className="userInterfaceChatsColumnOneChatNotImgPindOrMsgCount">
                              PindOrMsgCount
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : undefined
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
            <div
              id="userInterfaceChatHead"
              style={
                currentChatType ? { display: "flex" } : { display: "none" }
              }
            >
              <div id="userInterfaceChatHeadImg">
                <img src={currentChatImgSrc} alt="" />
              </div>
              <div id="userInterfaceChatHeadNameColumn">
                <div id="userInterfaceChatHeadNameColumnName">
                  {currentChatName}
                </div>
                <div id="userInterfaceChatHeadNameColumnLastSeen">
                  {currentChatType == "chanell"
                    ? `${currentChatSubs} subscribers`
                    : "Bot or participants or subs and online or last seen or service notification"}
                </div>
              </div>
              {/* <div id="userInterfaceChatHeadCall">Call</div> */}
              {/* <div id="userInterfaceChatHeadHidePinned">HidePinned</div> */}
              {/* <div id="userInterfaceChatHeadOnePinned">OnePinned</div> */}
              <div id="userInterfaceChatHeadAllPinned">AllPinned</div>
              <div id="userInterfaceChatHeadNotifications">
                <img src={"./icons8-silent-48.png"} alt="" />
              </div>
              {/* <div id="userInterfaceChatHeadVideoChat">VideoChat</div> */}
              <div id="userInterfaceChatHeadSearch">
                <img src={"./search.png"} alt="" />
              </div>
              <div id="userInterfaceChatHeadSettings">
                <img src={"./settings.png"} alt="" />
              </div>
            </div>
            <div
              id="userInterfaceChatMainBackground"
              style={{
                backgroundImage: "url(./backgroundlightgradient.png)",
                // backgroundImage: "url(./tgbackground.jpg)",
              }}
            >
              <div
                id="userInterfaceChatMainMsgesColumn"
                ref={myRef}
                onLoad={() => {
                  if (myRef.current != null) {
                    myRef.current.scrollTop = myRef.current.scrollHeight
                  }
                }}
              >
                {currentChatMsgsList
                  ? currentChatMsgsList.map((item) => {
                      return (
                        <div id="msg" key={key++}>
                          {item.img ? <img src={item.img} alt="" /> : <></>}

                          <div id="comentary">{item.comentary}</div>
                          <div id="emotions">
                            {item.emotions
                              ? item.emotions.map((emotion) => {
                                  return (
                                    <div id="oneemo" key={key++}>
                                      <img
                                        src={`./${emotion.name}.png`}
                                        alt=""
                                      />
                                      {emotion.count}
                                    </div>
                                  )
                                })
                              : undefined}
                          </div>
                        </div>
                      )
                    })
                  : undefined}

                {/* 
[
        { name: "laughface", count: "1" },
        { name: "angryface", count: "3" },
      ], */}
                {/* <div id="userInterfaceChatMainInputBar">
                  <div id="userInterfaceChatMainInputSmile">Smile</div>
                  <div id="userInterfaceChatMainInputText">Text</div>
                  <div id="userInterfaceChatMainInputFile">File</div>
                </div> */}
              </div>
              {/* <div id="userInterfaceChatMainInputVoice">Voice</div> */}
              <div
                id="userInterfaceChatMainInputVoice"
                onClick={() => {
                  setCurrentChatMsgsList((prevItems) => [
                    ...prevItems,
                    {
                      img: "https://res.cloudinary.com/dy9emuyvs/image/upload/v1691776582/uddsi7lqdr2dw6xc23cv.png",
                      comentary: "fat",
                      emotions: [
                        { name: "laughface", count: 1 },
                        { name: "angryface", count: 3 },
                      ],
                    },
                  ])
                }}
              >
                add more morozes
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
