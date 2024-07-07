import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Console, group } from "console"
import { getEventListeners } from "events"
import getBlobDuration from "get-blob-duration"
import { send } from "process"
import { stringify } from "querystring"
import WaveSurfer from "wavesurfer.js"
import { AudioVisualizer, LiveAudioVisualizer } from "react-audio-visualize"
import { AudioRecorder } from "react-audio-voice-recorder"
import { FFmpeg } from "@ffmpeg/ffmpeg"
import { fetchFile } from "@ffmpeg/util"

// import { Blob } from "buffer"
import { useEffect, useRef, useState } from "react"
// import WebSocket from "ws"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"

export type selectedMsgType = {
  display: boolean
  selected: boolean
  top: string
  left: string
  target: selectedMsgTargetType[]
}
export type selectedMsgTargetTypeArray = selectedMsgTargetType[]

export type selectedMsgTargetType = HTMLDivElement | undefined
export type deleteMsgType = {
  type: "delete"
  arrayOfObj: deleteMsgTypeObject[]
}
export type deleteMsgTypeObject = {
  time: string
  index: number
}
export type editMsgType = {
  type: "edit"
  msgObjToEdit: {
    currentEditTarget: HTMLDivElement | undefined
    currentEditTextInput: string
  }
}
export type addMsgType = {
  type: "add"
  img: string
  comentary: string
  emotions: emotion[]
  time: string
  pinned: boolean
  author: string
}
export type changeMsgType = {
  type: "change"
  img: string
  comentary: string
  emotions: emotion[]
  time: string
  pinned: boolean
}
export type blobMsgType = {
  type: "blob"
  img: string
  comentary: string
  emotions: emotion[]
  time: string
  pinned: boolean
  blob: string
  blobTime: string
  blobWave: any[]
  author: string
}
export type smileMsgType = {
  type: "changeSmile"
  smile: string
  name: string
}
export type emotion = {
  name: string
  count: number
  users: string[]
  smile: string
}
export type userList = {
  botList: [] | undefined
  chatsList: chatsList[] | undefined
  groupsList: [] | undefined
  servicesList: [] | undefined
  chanellsList: chanellsList[] | undefined
  findname: string | undefined
}
export type chanellsList = {
  archived: string
  findname: string
  lastSeenMsg: string
  muted: string
  pinned: string
}
export type chatsList = {
  archived: string
  findname: string
  lastSeenMsg: string
  muted: string
  pinned: string
  photoLink?: string
  username?: string
  userFindname?: string
}
export type allInOneSmileGroup = {
  name: string
  symbol: string
}
export type oneSmileGroup = {
  mainSmile: string
  name: string
  smiles: allInOneSmileGroup[]
}
interface AudioDevice {
  id: string
  name: string
}
export type audioMsgType = {
  mainSmile: string
  name: string
  smiles: allInOneSmileGroup[]
}

export function UserInterface(this: any) {
  let navigate = useNavigate()
  const refValue = useRef()
  const myRef: any = useRef<HTMLDivElement>(null)
  let key = 0
  let timeForCorrectMsgTime = "0"
  let valToEvalLastMsg = false
  let valToEvalNotSeen = false
  const [currentChatMsgsList, setCurrentChatMsgsList] = useState<
    (addMsgType | changeMsgType | blobMsgType)[]
  >([])

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

  // const [searchParams, setSearchParams] = useSearchParams()
  // const [username, setUsername] = useState("")
  //                                              <any>   <[{},{}]>

  const [onlineList, setOnlineList] = useState<any>([
    {
      findname: "gytmjketyjkwtjwryjwrjwr",
      online: "online",
    },
  ])
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
      partisipants: [{ admin: "YES", findname: "150496178" }],
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
  // const [newWebSocketMsg, setNewWebSocketMsg] = useState<
  //   {
  //     type: string
  //     findname: string
  //     newMessage: addMsgType
  //     time: string
  //     action: string
  //     arrayOfDeletedMsgTimesAndIndexes: any[]
  //   } & {
  //     type: string
  //     findname: string
  //     newMessage: addMsgType
  //     time: string
  //     action: string
  //   }
  // >()
  const [smileGroups, setSmileGroups] = useState<oneSmileGroup[]>([
    {
      mainSmile: "./icons8-clock-500.svg",
      name: "Frequently Used",
      smiles: [
        {
          name: "happy",
          symbol: "😀",
        },
        {
          name: "wink",
          symbol: "😉",
        },
        {
          name: "thumbsup",
          symbol: "👍",
        },
        {
          name: "handshake",
          symbol: "🤝",
        },
        {
          name: "puke",
          symbol: "🤮",
        },
        {
          name: "sunglasses",
          symbol: "😎",
        },
        {
          name: "dissapointed",
          symbol: "😩",
        },
      ],
    },
    {
      mainSmile: "./icons8-smile-100.png",
      name: "Smileys & People",
      smiles: [
        {
          name: "happy",
          symbol: "😀",
        },
        {
          name: "wink",
          symbol: "😉",
        },
        {
          name: "thumbsup",
          symbol: "👍",
        },
        {
          name: "handshake",
          symbol: "🤝",
        },
        {
          name: "puke",
          symbol: "🤮",
        },
        {
          name: "sunglasses",
          symbol: "😎",
        },
        {
          name: "dissapointed",
          symbol: "😩",
        },
        {
          name: "yawns",
          symbol: "🥱",
        },
        {
          name: "ladyarmup",
          symbol: "🙋‍♀️",
        },
        {
          name: "blindman",
          symbol: "👨‍🦯",
        },
      ],
    },
    {
      mainSmile: "./photo_5366452377135209154_m.jpg",
      name: "Animals & Nature",
      smiles: [
        {
          name: "monkey",
          symbol: "🐵",
        },
        {
          name: "squid",
          symbol: "🐙",
        },
        {
          name: "sloth",
          symbol: "🦥",
        },
      ],
    },
  ])

  const [onScreen, setOnScreen] = useState("chatsList")
  const [selectedSearchMegaOption, setSelectedSearchMegaOption] =
    useState("Chats")
  const [prevSelectedSearchMegaOption, setPrevSelectedSearchMegaOption] =
    useState("Chats")
  const [listOfRecentContacts, setListOfRecentContacts] = useState<any[]>([
    { src: "./icons8-clock-500.svg", name: "Dima" },
    { src: "./icons8-clock-500.svg", name: "Moroz" },
    { src: "./icons8-clock-500.svg", name: "Jeka" },
  ])
  const [listOfMajorContacts, setListOfMajorContacts] = useState<any[]>([
    { src: "./icons8-clock-500.svg", name: "Moroz" },
    { src: "./icons8-clock-500.svg", name: "Dima" },
    { src: "./icons8-clock-500.svg", name: "Jeka" },
  ])
  const [chatSearchList, setChatSearchList] = useState<any[]>([])
  const [chatSearchMegaList, setChatSearchMegaList] = useState<any[]>([
    "Chats",
    "Media",
    "Links",
    "Files",
    "Music",
    "Voice",
  ])
  const [searchFocused, setSearchFocused] = useState(false)
  const [userStatus, setUserStatus] = useState("user")
  const [currentHighlightedMsgsArray, setCurrentHighlightedMsgsArray] =
    useState([])
  const [displaySend, setDisplaySend] = useState(false)
  const [allChatsListInUser, setAllChatsListInUser] = useState<userList>()
  const [msgContextMenu, setMsgContextMenu] = useState<selectedMsgType>({
    display: false,
    selected: false,
    top: "",
    left: "",
    target: [],
  })
  const [openedChat, setOpenedChat] = useState({ type: "", findname: "" })
  const [currentEditTarget, setCurrentEditTarget] = useState<
    HTMLDivElement | undefined
  >()

  const [theAudio, setTheAudio] = useState<HTMLAudioElement>()
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [microphonePermissionState, setMicrophonePermissionState] = useState<
    "granted" | "prompt" | "denied"
  >("denied")
  const [availableAudioDevices, setAvailableAudioDevices] = useState<
    AudioDevice[]
  >([])
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<
    string | undefined
  >(undefined)
  const [savedAudio, setSavedAudio] = useState<any[]>()
  const [currentChatPinnedList, setCurrentChatPinnedList] = useState<any[]>([])
  const [currentPinnedMsgNumber, setCurrentPinnedMsgNumber] = useState(0)
  const [userMenu, setUserMenu] = useState(false)
  const [currentEditingState, setCurrentEditingState] = useState(false)
  const [pageJustLoaded, setPageJustLoaded] = useState(true)
  const [notAtBottom, setNotAtBottom] = useState(true)
  const [showDiscription, setShowDiscription] = useState(false)
  const [showcreateoptions, setShowCreateOptions] = useState(false)
  const [userSettingsEdit, setUserSettingsEdit] = useState(false)
  const [userSettings, setUserSettings] = useState(false)
  const [createNewChanell, setCreateNewChanell] = useState(false)
  const [createNewGroup, setCreateNewGroup] = useState(false)
  const [mediaPermissionNotification, setMediaPermissionNotification] =
    useState(false)
  // const [currentsomespace, setcurrentsomespace] = useState<any>([])
  const [useScroll, setUseScroll] = useState(false)
  const [currentChatUserName, setCurrentChatUserName] = useState("")
  const [pressedSelect, setPressedSelect] = useState("")
  const [createNewPrivateChat, setCreateNewPrivateChat] = useState(false)
  const [letBeLastSeenSync, setLetBeLastSeenSync] = useState(0)
  const [currentChatMutted, setCurrentChatMutted] = useState("")
  const [notificationInterval, setNotificationInterval] = useState("")
  const [mutedTableOpen, setMutedTableOpen] = useState(false)
  const [userFindName, setUserFindName] = useState("")
  const [currentUserName, setCurrentUserName] = useState("")
  const [currentUserLastName, setCurrentUserLastName] = useState("")
  const [currentUserBio, setCurrentUserBio] = useState("")
  const [username, setUsername] = useState("")
  const [botsList, setBotsList] = useState([""])
  const [chatsList, setChatsList] = useState([""])
  const [groupsList, setGroupsList] = useState([""])
  const [servicesList, setServicesList] = useState([""])
  const [chanellsList, setChanellsList] = useState([""])
  const [phoneNumber, setPhoneNumber] = useState("")
  const [chanellName, setChanellName] = useState("")
  const [currentEditTextInput, setCurrentEditTextInput] = useState("")
  const [currentEditText, setCurrentEditText] = useState("")
  const [chanellDiscription, setChanellDiscription] = useState("")
  const [chanellImgUrl, setChanellImgUrl] = useState("")
  const [chanellImg, setChanellImg] = useState<File | null>(null)
  const [showChanellImg, setShowChanellImg] = useState(false)
  const [inputImgUrl, setInputImgUrl] = useState("")
  const [inputImg, setInputImg] = useState<File | null>(null)
  const [showInputImg, setShowInputImg] = useState(false)
  const [currentChatBio, setCurrentChatBio] = useState("")
  const [currentChatKnownPhone, setCurrentChatKnownPhone] = useState("")
  const [currentChatFindname, setCurrentChatFindname] = useState("")
  const [currentChatImgSrc, setCurrentChatImgSrc] = useState<
    string | undefined
  >("")
  const [currentChatName, setCurrentChatName] = useState<string | undefined>("")
  const [currentChatSubs, setCurrentChatSubs] = useState("")
  const [currentChatPhotoLink, setCurrentChatPhotoLink] = useState("")
  const [currentChatDiscription, setCurrentChatDiscription] = useState("")
  const [currentChatLink, setCurrentChatLink] = useState("")
  const [currentChatType, setCurrentChatType] = useState("")
  const [msgMenuCoords, setMsgMenuCoords] = useState({ top: "", left: "" })
  const [msgMenu, setMsgMenu] = useState(false)
  const [msgMenuSelectPressed, setMsgMenuSelectPressed] = useState(false)
  const [msgMenuListener, setMsgMenuListener] = useState(false)
  const [msgMenuTargets, setMsgMenuTargets] =
    useState<selectedMsgTargetTypeArray>()
  const [currentChatComentary, setCurrentChatComentary] = useState("")
  const [smileBarMouseEnter, setSmileBarMouseEnter] = useState(false)
  const [smileBarClick, setSmileBarClick] = useState(false)
  const [inputImgType, setInputImgType] = useState("")
  const [inputImgName, setInputImgName] = useState("")
  const [inputImgSize, setInputImgSize] = useState("")
  const [currentUnreadNumber, setCurrentUnreadNumber] = useState<number>()
  const [chatSelected, setChatSelected] = useState(false)
  const [canSendMsg, setCanSendMsg] = useState(false)
  let currentMappedListKey = 0
  let currentNotSeen = 999999
  let { usernameParam } = useParams()
  const [auth_token, setAuth_token] = useState("")
  let notrealauthtoken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth_token="))
    ?.split("=")[1]

  // allChatsList
  //
  // currentChatFindname
  // currentChatType

  async function unreadNumberFunc() {
    if (currentChatType == "chanell") {
      if (allChatsListInUser) {
        if (allChatsListInUser.chanellsList) {
          for (let i = 0; i < allChatsListInUser.chanellsList.length; i++) {
            if (
              allChatsListInUser.chanellsList[i].findname == currentChatFindname
            ) {
              let userlastseen = Number(
                allChatsListInUser.chanellsList[i].lastSeenMsg
              )

              if (allChatsList) {
                for (let i = 0; i < allChatsList.length; i++) {
                  if (allChatsList[i].findname == currentChatFindname) {
                    let totalnumber = allChatsList[i].messages.length
                    if (currentUnreadNumber != totalnumber - userlastseen) {
                      setCurrentUnreadNumber(totalnumber - userlastseen)
                      return "upped"
                    } else {
                      setCurrentUnreadNumber(totalnumber - userlastseen)
                      return "not"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    if (currentChatType == "chat") {
      if (allChatsListInUser) {
        if (allChatsListInUser.chanellsList) {
          for (let i = 0; i < allChatsListInUser.chanellsList.length; i++) {
            if (
              allChatsListInUser.chanellsList[i].findname == currentChatFindname
            ) {
              let userlastseen = Number(
                allChatsListInUser.chanellsList[i].lastSeenMsg
              )

              if (allChatsList) {
                for (let i = 0; i < allChatsList.length; i++) {
                  if (allChatsList[i].findname == currentChatFindname) {
                    let totalnumber = allChatsList[i].messages.length
                    if (currentUnreadNumber != totalnumber - userlastseen) {
                      setCurrentUnreadNumber(totalnumber - userlastseen)
                      return "upped"
                    } else {
                      setCurrentUnreadNumber(totalnumber - userlastseen)
                      return "not"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  useEffect(() => {
    console.log(onScreen)
  }, [onScreen])

  useEffect(() => {
    unreadNumberFunc()
    scrollOnFunc()
    // scrollLastmsgIfAtBottom()
    // console.log("1")
  }, [currentChatFindname, currentChatMsgsList])
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

  // function clickedWsConnect() {
  //   closeConnection()

  //   ws = new WebSocket("wss://silentalk-back.onrender.com/:10000")

  //   ws.addEventListener("error", () => {
  //     console.log("WebSocket error")
  //   })

  //   ws.addEventListener("open", () => {
  //     console.log("WebSocket connection established")
  //   })

  //   ws.addEventListener("close", () => {
  //     console.log("WebSocket connection closed")
  //   })
  //   ws.addEventListener("message", (msg) => {
  //     console.log(`Received message: ${msg.data}`)
  //   })
  // }
  // const wsInput = document.getElementById("wsInput") as HTMLInputElement

  // function clickedWsSend() {
  //   const val = wsInput?.value

  //   if (!val) {
  //     return
  //   } else if (!ws) {
  //     console.log("No WebSocket connection")
  //     return
  //   }

  //   ws.send(val)
  //   console.log(`Sent "${val}"`)
  //   wsInput.value = ""
  // }

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

  // onClick={() => {
  //   let msg = {
  //     type: "addMsgToChanell",
  //     findname: "875186317",
  //     newMessage: {
  //       img: "",
  //       comentary: "newComByWebsocket",
  //       emotions: [],
  //     },
  //   }
  //   ws?.send(JSON.stringify(msg))
  // }}
  // onKeyDown={(event) => {
  //   submitCurrentChatInput(currentChatFindname,currentChatType, event)
  // }}

  const [mediaRecorder, setMediaRecorder] = useState<any>(undefined)
  // Get audio URL from saved chunks
  function getAudioRef() {
    const recordedChunks: any = savedAudio
    return URL.createObjectURL(new Blob(recordedChunks))
  }

  // handle delete audio
  function handleDeleteAudio() {
    setSavedAudio([])
  }
  // Handle download audio
  const blobToBase64 = async (blob: Blob) => {
    const reader = new FileReader()
    reader.readAsDataURL(blob)
    return new Promise((resolve: any) => {
      reader.onloadend = () => {
        resolve(reader.result)
      }
    })
  }
  function blobToString(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result) {
          resolve(reader.result as string)
        } else {
          reject(new Error("Failed to read the blob as string."))
        }
      }
      reader.onerror = reject
      reader.readAsText(blob)
    })
  }

  function convertURIToBinary(dataURI: any) {
    // let BASE64_MARKER = ";base64,"
    // let base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length
    // let base64 = String(dataURI).substring(base64Index)
    // console.log(dataURI[0].substring(37))
    let raw = window.atob(dataURI[0].substring(37))
    let rawLength = raw.length
    let arr = new Uint8Array(new ArrayBuffer(rawLength))

    for (let i = 0; i < rawLength; i++) {
      arr[i] = raw.charCodeAt(i)
    }
    return arr
  }

  const addAudioElement = (blob: Blob) => {
    const url = URL.createObjectURL(blob)
    const audio = document.createElement("audio")
    audio.src = url
    audio.controls = true
    // document.body.appendChild(audio)
  }

  async function handleDownloadAudio(theAudio: any, arrayOfVolume: any[]) {
    // const recordedChunks = savedAudio
    // let oldsomespace = structuredClone(currentsomespace)
    // oldsomespace?.push(new Blob(recordedChunks))
    // setcurrentsomespace(oldsomespace)

    // let oldCurrentChatMsgsList = structuredClone(currentChatMsgsList)

    //   let audioCtx = new AudioContext();
    //   var analyser = audioCtx.createAnalyser();

    //   audioCtx.decodeAudioData(new Blob(theAudio)).then(audioBuffer => {
    //     console.log(audioBuffer);
    //     var source = audioCtx.createBufferSource();
    //     var dataArray = new Uint8Array(analyser.fftSize);
    //     source.buffer = audioBuffer;
    //     source.connect(analyser);
    //     analyser.connect(audioCtx.destination);
    //     source.start();
    //     setInterval(() => {
    //         console.log(source.context.currentTime);
    //         analyser.getByteTimeDomainData(dataArray);
    //         console.log(dataArray);
    //     }, 1000);
    // });

    // recordingTimeNeeded

    let blobWave: any[] = []

    let number = Math.trunc(arrayOfVolume.length / 47)
    for (let i = 0; i < 48; i++) {
      let newArr = arrayOfVolume.slice(i * number, (i + 1) * number)
      if ((newArr.reduce((a, b) => a + b, 0) / newArr.length) * 25 <= 4) {
        blobWave[i] = 4
      } else {
        blobWave[i] = (newArr.reduce((a, b) => a + b, 0) / newArr.length) * 25
      }
    }
    // let file = new File([theAudio[0]], "recording.webm")
    // let a = new Audio(URL.createObjectURL(file))
    // a.play()
    // console.log(theAudio[0])
    // console.log(await convertWebmToMp3(theAudio[0]))
    // let file2 = new File([theAudio[0]], "recording.webm")
    let duration = await getBlobDuration(new Blob(theAudio))
    // console.log(theAudio[0])
    // console.log(file)
    // let b = new Audio(
    //   URL.createObjectURL(
    //     new File([await convertWebmToMp3(theAudio[0])], "recording.mp3")
    //   )
    // )
    // b.play()
    let newFile = new File(
      [await convertWebmToMp3(theAudio[0])],
      "recording.mp3"
    )

    let secure_url
    if (newFile != null) {
      let formData = new FormData()
      formData.append("file", newFile)
      formData.append("upload_preset", "vbght5om")
      let url = new URL(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/auto/upload`
      )
      await fetch(url, {
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
    let theMsg: any
    if (secure_url) {
      theMsg = {
        type: "blob",
        img: "",
        comentary: "",
        emotions: [],
        time: new Date().getTime().toString(),
        pinned: false,
        blob: secure_url,
        blobTime: duration,
        blobWave: blobWave,
      }
    } else {
      theMsg = {
        type: "blob",
        img: "",
        comentary: "",
        emotions: [],
        time: new Date().getTime().toString(),
        pinned: false,
        // blob: await new Blob(theAudio).text(),
        // @ts-ignore
        // blob: await blobToBase64(theAudio[0]).slice(30),
        // blob: theAudio[0],
        blobTime: duration,
        blobWave: blobWave,
      }
    }

    // console.log(theAudio)
    // console.log(theAudio[0])
    // console.log(theAudio[0].type)
    // @ts-ignore
    // console.log(String(await blobToBase64(theAudio[0])).slice(35))
    // console.log(
    //   new Blob(
    //     [convertURIToBinary(String(await blobToBase64(theAudio[0])).slice(35))],
    //     {
    //       type: "audio/webm;codecs=opus",
    //     }
    //   )
    // )
    // console.log(
    //   // @ts-ignore
    //   new Blob([String(await blobToBase64(theAudio[0])).slice(35)], {
    //     type: "audio/webm;codecs=opus",
    //   })
    // )
    // let b = new Audio()
    // URL.createObjectURL(
    //   // @ts-ignore
    //   new Blob([String(await blobToBase64(theAudio[0])).slice(35)], {
    //     type: "audio/webm;codecs=opus",
    //   })
    // )
    // console.log(await blobToString(theAudio[0]))
    // console.log(
    //   new Blob([await blobToString(theAudio[0])], {
    //     type: "audio/webm;codecs=opus",
    //   })
    // )

    // URL.createObjectURL(
    //   // @ts-ignore
    //   new Blob([await blobToBase64(theAudio[0])], {
    //     type: "audio/webm;codecs=opus",
    //   })
    // )

    // async function aadd() {
    //   b.src = URL.createObjectURL(
    //     // @ts-ignore
    //     new Blob([await blobToString(theAudio[0])], {
    //       type: "audio/webm;codecs=opus",
    //     })
    //   )
    // }
    // aadd().then(() => {
    //   b.play()
    // })
    // @ts-ignore
    // oldCurrentChatMsgsList?.push(theMsg)
    // setCurrentChatMsgsList(oldCurrentChatMsgsList)
    universalChatManipulationFunction(theMsg, "add")
    // RETURNED INFINITY SO FUCK THIS PIECE OF SHIT
    // const a = document.createElement("audio")
    // a.src = URL.createObjectURL(new Blob(theAudio))
    // a.addEventListener("durationchange", () => {
    //   console.log("beoba")
    //   if (a.duration != Infinity) {
    //     console.log(a.duration)
    //     a.remove()
    //   }
    // })
    // a.addEventListener("loadedmetadata", () => {
    //   console.log("aboba")
    //   if (a.duration != Infinity) {
    //     console.log(a.duration)
    //     a.remove()
    //   }
    // })

    // msg GOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO

    // const a = document.createElement("a")
    // a.href = URL.createObjectURL(new Blob(recordedChunks))
    // a.download = `Audio.mp3`
    // document.body.appendChild(a)
    // a.click()
    // document.body.removeChild(a)
    // a.remove()
  }
  // Handle on click stop recording
  function handleClickStopRecord(action: string) {
    setIsRecording(false)
    if (mediaRecorder) {
      mediaRecorder.action = action
      mediaRecorder.stop()
    }
  }
  // Handle on click start recording
  // function getAutocorrolatedPitch(
  //   analyserNode: any,
  //   corrolatedSignal: any,
  //   audioData: any,
  //   localMaxima: any,
  //   audioCtx: any
  // ) {
  //   // First: autocorrolate the signal

  //   let maximaCount = 0

  //   for (let l = 0; l < analyserNode.fftSize; l++) {
  //     corrolatedSignal[l] = 0
  //     for (let i = 0; i < analyserNode.fftSize - l; i++) {
  //       corrolatedSignal[l] += audioData[i] * audioData[i + l]
  //     }
  //     if (l > 1) {
  //       if (
  //         corrolatedSignal[l - 2] - corrolatedSignal[l - 1] < 0 &&
  //         corrolatedSignal[l - 1] - corrolatedSignal[l] > 0
  //       ) {
  //         localMaxima[maximaCount] = l - 1
  //         maximaCount++
  //         if (maximaCount >= localMaxima.length) break
  //       }
  //     }
  //   }
  //   let maximaMean = localMaxima[0]
  //   for (let i = 1; i < maximaCount; i++)
  //     maximaMean += localMaxima[i] - localMaxima[i - 1]
  //   maximaMean /= maximaCount
  //   return audioCtx.sampleRate / maximaMean
  // }
  async function handleClickStartRecord() {
    if (selectedAudioDevice) {
      //
      // let audioCtx = new window.AudioContext()
      // let microphoneStream = null
      // let analyserNode = audioCtx.createAnalyser()
      // let audioData = new Float32Array(analyserNode.fftSize)
      // let corrolatedSignal = new Float32Array(analyserNode.fftSize)
      // let localMaxima = new Array(10)
      // const frequencyDisplayElement = document.getElementById("frequency")
      //
      // let recorder: any
      const LABEL = document.getElementById(
        "userInterfaceChatHeadNameColumnName"
      )
      // const ANALYSE = (stream: any) => {
      //   const CONTEXT = new AudioContext()
      //   const ANALYSER = CONTEXT.createAnalyser()
      //   const SOURCE = CONTEXT.createMediaStreamSource(stream)
      //   const DATA_ARR = new Uint8Array(ANALYSER.frequencyBinCount)
      //   SOURCE.connect(ANALYSER)
      //   const REPORT = () => {
      //     ANALYSER.getByteFrequencyData(DATA_ARR)
      //     // @ts-ignore
      //     const VOLUME = Math.floor((Math.max(...DATA_ARR) / 255) * 100)
      //     if (LABEL) {
      //       console.log(VOLUME)
      //       LABEL.innerText = `${VOLUME}%`
      //     }
      //     if (recorder) requestAnimationFrame(REPORT)
      //     else {
      //       CONTEXT.close()
      //       if (LABEL) {
      //         LABEL.innerText = "0%"
      //         console.log(DATA_ARR)
      //       }
      //     }
      //   }
      //   REPORT()
      // }
      //

      let arrayOfVolume: any = []
      setIsRecording(true)
      const audio =
        selectedAudioDevice!.length > 0
          ? { deviceId: selectedAudioDevice }
          : true
      navigator.mediaDevices
        .getUserMedia({ audio: audio, video: false })
        .then((stream) => {
          const context = new AudioContext()
          const source = context.createMediaStreamSource(stream)
          const analyzer = context.createAnalyser()
          source.connect(analyzer)
          const array = new Uint8Array(analyzer.fftSize)

          function getPeakLevel() {
            analyzer.getByteTimeDomainData(array)
            return (
              array.reduce(
                (max, current) => Math.max(max, Math.abs(current - 127)),
                0
              ) / 128
            )
          }

          function tick() {
            if (LABEL) {
              const peak = getPeakLevel()
              // LABEL.innerHTML = `${peak * 100}%`
              requestAnimationFrame(tick)
              arrayOfVolume.push(peak)
            }
          }
          tick()

          const options = { mimeType: "audio/webm" }
          const recordedChunks: any[] = []
          let newRecorder = new MediaRecorder(stream, options)
          setMediaRecorder(newRecorder)
          //
          // microphoneStream = audioCtx.createMediaStreamSource(stream)
          // microphoneStream.connect(analyserNode)
          // audioData = new Float32Array(analyserNode.fftSize)
          // corrolatedSignal = new Float32Array(analyserNode.fftSize)

          newRecorder.addEventListener("dataavailable", function (e) {
            if (e.data.size > 0) {
              recordedChunks.push(e.data)
              //
              // analyserNode.getFloatTimeDomainData(audioData)
              // let pitch = getAutocorrolatedPitch(
              //   analyserNode,
              //   corrolatedSignal,
              //   audioData,
              //   localMaxima,
              //   audioCtx
              // )

              // if (frequencyDisplayElement) {
              //   frequencyDisplayElement.innerHTML = `${pitch}`
              // }
              //
            }
          })

          newRecorder.addEventListener("stop", function (event) {
            {
              setSavedAudio(recordedChunks)
              stream.getTracks().forEach(function (track) {
                track.stop()
              })
              // @ts-ignore
              if (event.currentTarget.action === "stop") {
                handleDeleteAudio()
              } else {
                handleDownloadAudio(recordedChunks, arrayOfVolume)
              }
            }
          })
          newRecorder.start()
          // ANALYSE(newRecorder.stream)
        })
    }
  }
  // Handle on change audio device
  function handleClickSelectAudioDevice(id: string) {
    setSelectedAudioDevice(id)
  }
  // Get available audio devices
  function getAvailableAudioDevices(): Promise<any[]> {
    return new Promise<any[]>((resolve) => {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const availableDevices = devices
          .filter((d) => d.kind === "audioinput")
          .map((d) => {
            return { id: d.deviceId, name: d.label }
          })
        resolve(availableDevices)
      })
    })
  }
  // Handle request permission
  function handleRequestPermission() {
    console.log("pls give permission")
    // navigator.mediaDevices
    //   .getUserMedia({ audio: true, video: false })
    //   .then((stream) => {
    //     stream.getTracks().forEach(function (track) {
    //       track.stop()
    //     })
    //   })
  }
  // Handle permission state
  function handlePermissionState(state: "granted" | "prompt" | "denied") {
    setMicrophonePermissionState(state)
    if (state == "granted") {
      getAvailableAudioDevices().then((devices) => {
        setAvailableAudioDevices(devices)
        setSelectedAudioDevice(
          devices.find((device) => device.id === "default")?.id
        )
      })
    }
    if (state === "denied") {
      handleRequestPermission()
    }
  }

  async function checkIfAtBottom() {
    // console.log(myRef.current.children[1].getBoundingClientRect().top)
    // console.log(
    //   window.innerHeight - myRef.current.children[1].getBoundingClientRect().top
    // )
    // console.log(myRef.current.clientHeight)
    if (myRef.current.children[1]) {
      if (
        myRef.current.children[1].getBoundingClientRect().top < 51
        // 50 - top bar height
      ) {
        if (
          myRef.current.scrollTop /
            (myRef.current.scrollHeight - myRef.current.clientHeight) >=
          0.98
        ) {
          setNotAtBottom(true)
        } else {
          setNotAtBottom(false)
        }
      } else {
        setNotAtBottom(true)
      }
    }
  }

  async function addToCurrentChat(newMessage: addMsgType | blobMsgType) {
    let oldCurrentChatMsgsList = [...currentChatMsgsList]
    oldCurrentChatMsgsList.push(newMessage)
    setCurrentChatMsgsList(oldCurrentChatMsgsList)
    checkIfAtBottom()
  }
  async function deleteFromCurrentChat() {
    if (currentChatMsgsList) {
      if (msgMenuTargets) {
        let arrayOfMsgIndexes = []
        let oldCurrentChatMsgsList = [...currentChatMsgsList]
        for (let i = 0; i < msgMenuTargets.length; i++) {
          let number = Number(
            msgMenuTargets[i]?.getAttribute("data-msgkey")?.slice(11)
          )
          number = number
          // number = number - 3
          arrayOfMsgIndexes.push(number)
          let nnn = msgMenuTargets[i]
          if (nnn != undefined) {
            nnn.style.backgroundColor = "transparent"
          }
        }

        for (let k = arrayOfMsgIndexes.length - 1; k >= 0; k--) {
          oldCurrentChatMsgsList.splice(arrayOfMsgIndexes[k], 1)
        }
        setCurrentChatMsgsList(oldCurrentChatMsgsList)
        setMsgMenuTargets([])
        setMsgMenuSelectPressed(false)
      }
    }
  }
  async function pinInCurrentChat() {
    if (currentChatMsgsList) {
      if (msgMenuTargets && msgMenuTargets[0]) {
        let oldCurrentChatMsgsList = structuredClone(currentChatMsgsList)
        let number = Number(
          msgMenuTargets[0].getAttribute("data-msgkey")?.slice(11)
        )
        number = number
        // number = number - 3
        if (oldCurrentChatMsgsList[number].pinned === true) {
          oldCurrentChatMsgsList[number].pinned = false
        } else {
          if (oldCurrentChatMsgsList[number].pinned === false) {
            oldCurrentChatMsgsList[number].pinned = true
          }
        }

        let time = oldCurrentChatMsgsList[number].time

        if (oldCurrentChatMsgsList[number].pinned === true) {
          let list = structuredClone(currentChatPinnedList)
          for (let index = 0; index < list.length; index++) {
            const listTime = list[index].time
            if (listTime > time || list.length - 1 === index) {
              for (let ooo = 0; ooo < list.length; ooo++) {
                if (list[ooo].index >= index) {
                  list[ooo].index++
                }
              }
              list.splice(index, 0, {
                time: oldCurrentChatMsgsList[number].time,
                comentary: oldCurrentChatMsgsList[number].comentary,
                photoLink: oldCurrentChatMsgsList[number].img,
                index: index,
              })
              break
            }
          }
          setCurrentChatPinnedList(list)
          setCurrentPinnedMsgNumber(currentPinnedMsgNumber + 1)
        } else {
          let list = structuredClone(currentChatPinnedList)
          for (let index = 0; index < list.length; index++) {
            const listTime = list[index].time
            if (listTime === time) {
              for (let ooo = 0; ooo < list.length; ooo++) {
                if (list[ooo].index >= index) {
                  list[ooo].index--
                }
              }
              list.splice(index, 1)
              break
            }
          }
          setCurrentChatPinnedList(list)
          setCurrentPinnedMsgNumber(currentPinnedMsgNumber - 1)
        }
        setCurrentChatMsgsList(oldCurrentChatMsgsList)
        return time
      }
    }
  }
  async function pinInAllChatList() {
    let oldAllChatList: any = structuredClone(allChatsList)
    if (msgMenuTargets && msgMenuTargets[0]) {
      for (let i = 0; i < allChatsList.length; i++) {
        if (allChatsList[i].findname == currentChatFindname) {
          let number = Number(
            msgMenuTargets[0].getAttribute("data-msgkey")?.slice(11)
          )
          number = number
          if (oldAllChatList[i].messages[number].pinned == true) {
            oldAllChatList[i].messages[number].pinned = false
          } else {
            if (oldAllChatList[i].messages[number].pinned == false) {
              oldAllChatList[i].messages[number].pinned = true
            }
          }
        }
      }
    }
  }

  async function deleteFromAllChatList() {
    let coolObj: {
      toDeleteArray: string[]
      toDeleteArrayIndexes: number[]
      // toDeleteArrayComents: string[]
    } = {
      toDeleteArray: [],
      toDeleteArrayIndexes: [],
      // toDeleteArrayComents: [],
    }
    let oldAllChatList: any = [...allChatsList]
    for (let i = 0; i < allChatsList.length; i++) {
      if (allChatsList[i].findname == currentChatFindname) {
        if (msgMenuTargets) {
          let arrayOfMsgIndexes: number[] = []
          // let arrayOfMsgComents: string[] = []
          // let oldCurrentChatMsgsList = [...currentChatMsgsList]
          for (let i = 0; i < msgMenuTargets.length; i++) {
            let number = Number(
              msgMenuTargets[i]?.getAttribute("data-msgkey")?.slice(11)
            )
            number = number
            // number = number - 3
            arrayOfMsgIndexes.push(number)
          }
          let timesArray = []
          for (let o = 0; o < arrayOfMsgIndexes.length; o++) {
            let newTime: string =
              oldAllChatList[i].messages[arrayOfMsgIndexes[o]].time
            timesArray.push(newTime)
          }
          // for (let o = 0; o < arrayOfMsgIndexes.length; o++) {
          //   let coment: string =
          //     oldAllChatList[i].messages[arrayOfMsgIndexes[o]].comentary
          //   arrayOfMsgComents.push(coment)
          // }
          coolObj.toDeleteArray = timesArray
          coolObj.toDeleteArrayIndexes = arrayOfMsgIndexes
          // coolObj.toDeleteArrayComents = arrayOfMsgComents
          for (let k = arrayOfMsgIndexes.length - 1; k >= 0; k--) {
            oldAllChatList[i].messages.splice(arrayOfMsgIndexes[k], 1)
          }
        }
        setAllChatsList(oldAllChatList)
      }
    }
    return coolObj
  }
  async function deleteFromUserChatList(coolObj: {
    toDeleteArray: string[]
    toDeleteArrayIndexes: number[]
  }) {
    if (
      allChatsListInUser &&
      allChatsListInUser.chanellsList &&
      allChatsListInUser.chatsList
    ) {
      let oldlist = { ...allChatsListInUser }
      //  make chat delete possible
      if (currentChatType == "chanell") {
        if (oldlist.chanellsList) {
          for (let i = 0; i < oldlist.chanellsList.length; i++) {
            if (oldlist.chanellsList[i].findname == currentChatFindname) {
              let oldLastSeen = Number(
                allChatsListInUser.chanellsList[i].lastSeenMsg
              )
              for (let m = 0; m < coolObj.toDeleteArrayIndexes.length; m++) {
                if (coolObj.toDeleteArrayIndexes[m] <= oldLastSeen) {
                  oldLastSeen--
                }
              }
              oldlist.chanellsList[i].lastSeenMsg = String(oldLastSeen)

              // oldlist.chanellsList[i].lastSeenMsg = String(
              //   currentChatMsgsList?.length
              // )
              setAllChatsListInUser(oldlist)
              let leMsg = {
                action: "lastSeen",
                type: "chanell",
                findname: currentChatFindname,
                lastSeenMsg: String(oldLastSeen),
              }
              await (async () => {
                ws?.send(JSON.stringify(leMsg))
              })()

              break
            }
          }
        }
      }
      if (currentChatType == "chat") {
        if (oldlist.chatsList) {
          for (let i = 0; i < oldlist.chatsList.length; i++) {
            if (oldlist.chatsList[i].findname == currentChatFindname) {
              let oldLastSeen = Number(
                allChatsListInUser.chatsList[i].lastSeenMsg
              )
              for (let m = 0; m < coolObj.toDeleteArrayIndexes.length; m++) {
                if (coolObj.toDeleteArrayIndexes[m] <= oldLastSeen) {
                  oldLastSeen--
                }
              }
              oldlist.chatsList[i].lastSeenMsg = String(oldLastSeen)

              // oldlist.chatsList[i].lastSeenMsg = String(
              //   currentChatMsgsList?.length
              // )
              setAllChatsListInUser(oldlist)
              let leMsg = {
                action: "lastSeen",
                type: "chat",
                findname: currentChatFindname,
                lastSeenMsg: String(oldLastSeen),
              }
              await (async () => {
                ws?.send(JSON.stringify(leMsg))
              })()

              break
            }
          }
        }
      }
    }
  }
  async function addToAllChatListNew(newMessage: addMsgType | blobMsgType) {
    let oldAllChatList = [...allChatsList]
    if (currentChatType == "chat") {
      setOpenedChat({
        type: currentChatType,
        findname: `${userFindName}${currentChatFindname}`,
      })
      oldAllChatList.unshift({
        group: "chat",
        findname: `${userFindName}${currentChatFindname}`,
        partisipants: [
          { admin: "yes", findname: userFindName, deleted: [] },
          { admin: "yes", findname: currentChatFindname, deleted: [] },
        ],
        lastUpdated: new Date().getTime().toString(),
        messages: [newMessage],
      })
      setAllChatsList(oldAllChatList)
    }
  }
  async function addToAllChatList(newMessage: addMsgType | blobMsgType) {
    // if (currentChatType =="chanell") {
    let oldAllChatList = [...allChatsList]
    for (let i = 0; i < allChatsList.length; i++) {
      if (allChatsList[i].findname == currentChatFindname) {
        oldAllChatList[i].messages.push(newMessage)
        setAllChatsList(oldAllChatList)
      }
    }
    // }
    // if (currentChatType =="chat") {
    //   let oldAllChatList = [...allChatsList]
    //   for (let i = 0; i < allChatsList.length; i++) {
    //     if (allChatsList[i].findname == currentChatFindname) {
    //       oldAllChatList[i].messages.push(newMessage)
    //       setAllChatsList(oldAllChatList)
    //     }
    //   }
    // }
  }
  async function addToUserChatListNew(newMessage: addMsgType | blobMsgType) {
    switch (currentChatType) {
      case "chanell":
        if (
          allChatsListInUser &&
          allChatsListInUser.chanellsList &&
          currentChatMsgsList
        ) {
          // let allNotSeen = document.querySelectorAll('[data-notSeen="notSeen"]')
          //       let newAll = { ...allChatsListInUser }
          //       for (let i = 0; i < newAll.chanellsList.length; i++) {
          //         if (newAll.chanellsList[i].findname == currentChatFindname) {
          //           newAll.chanellsList[i].lastSeenMsg = String()
          //           currentChatMsgsList?.length - allNotSeen.length
          //         }
          //       }
          //       setAllChatsListInUser({ ...newAll })
        }
        break
      case "chat":
        let oldAllChatsListInUser = { ...allChatsListInUser }
        oldAllChatsListInUser.chatsList?.push({
          archived: "no",
          findname: `${userFindName}${currentChatFindname}`,
          lastSeenMsg: "1",
          muted: "no",
          pinned: "no",
          photoLink: currentChatPhotoLink,
          username: currentChatUserName,
          userFindname: currentChatFindname,
        })
        break
    }
  }
  async function addToUserChatList(newMessage: addMsgType | blobMsgType) {
    switch (currentChatType) {
      case "chanell":
        if (
          allChatsListInUser &&
          allChatsListInUser.chanellsList &&
          currentChatMsgsList
        ) {
          // let allNotSeen = document.querySelectorAll('[data-notSeen="notSeen"]')
          //       let newAll = { ...allChatsListInUser }
          //       for (let i = 0; i < newAll.chanellsList.length; i++) {
          //         if (newAll.chanellsList[i].findname == currentChatFindname) {
          //           newAll.chanellsList[i].lastSeenMsg = String()
          //           currentChatMsgsList?.length - allNotSeen.length
          //         }
          //       }
          //       setAllChatsListInUser({ ...newAll })
        }
        break
    }
  }
  async function editInAllChatList(mainInfo: editMsgType) {
    let oldAllChatList = [...allChatsList]
    for (let i = 0; i < allChatsList.length; i++) {
      if (allChatsList[i].findname == currentChatFindname && msgMenuTargets) {
        let number = Number(
          msgMenuTargets[0]?.getAttribute("data-msgkey")?.slice(11)
        )
        number = number
        // number = number - 3
        oldAllChatList[i].messages[number].comentary =
          mainInfo.msgObjToEdit.currentEditTextInput
        setAllChatsList(oldAllChatList)
      }
    }
  }

  function getTextWidth(text: any, font: any) {
    // re-use canvas object for better performance
    // @ts-ignore
    const canvas: any =
      // @ts-ignore
      getTextWidth.canvas ||
      // @ts-ignore
      (getTextWidth.canvas = document.createElement("canvas"))
    const context = canvas.getContext("2d")
    context.font = font
    const metrics = context.measureText(text)
    // console.log(metrics.width)
    return metrics.width
  }

  // function getCssStyle(element: any, prop: any) {
  //   return window.getComputedStyle(element, null).getPropertyValue(prop)
  // }

  // function getCanvasFont(el = document.body) {
  //   const fontWeight = getCssStyle(el, "font-weight") || "normal"
  //   const fontSize = getCssStyle(el, "font-size") || "16px"
  //   const fontFamily = getCssStyle(el, "font-family") || "Times New Roman"

  //   return `${fontWeight} ${fontSize} ${fontFamily}`
  // }

  // console.log(
  //   getTextWidth(
  //     "hilfylfryjfyjetrl;hkjhlkytmjlytmjprytmpnjhwmrthmwrpдддд",
  //     "16px open sans"
  //   )
  // )

  async function editInCurrentChat(mainInfo: editMsgType) {
    if (
      currentChatMsgsList &&
      mainInfo.msgObjToEdit.currentEditTarget &&
      msgMenuTargets
    ) {
      let oldCurrentChatMsgsList = [...currentChatMsgsList]
      let number = Number(
        msgMenuTargets[0]?.getAttribute("data-msgkey")?.slice(11)
      )
      number = number
      // number = number - 3
      oldCurrentChatMsgsList[number].comentary =
        mainInfo.msgObjToEdit.currentEditTextInput
      setCurrentChatMsgsList(oldCurrentChatMsgsList)
      let time = oldCurrentChatMsgsList[number].time
      return time
    }
  }
  async function changeSmileFromCurrentChat(mainInfo: smileMsgType) {
    if (currentChatMsgsList && msgMenuTargets) {
      let oldCurrentChatMsgsList = structuredClone(currentChatMsgsList)
      let number = Number(
        msgMenuTargets[0]?.getAttribute("data-msgkey")?.slice(11)
      )
      number = number
      // number = number - 3
      if (!oldCurrentChatMsgsList[number].emotions.length) {
        oldCurrentChatMsgsList[number].emotions.push({
          name: mainInfo.name,
          smile: mainInfo.smile,
          users: [userFindName],
          count: 1,
        })
      } else {
        for (
          let index = 0;
          index < oldCurrentChatMsgsList[number].emotions.length;
          index++
        ) {
          if (
            oldCurrentChatMsgsList[number].emotions[index].name == mainInfo.name
          ) {
            // for (
            //   let bimbex = 0;
            //   bimbex <
            //   oldCurrentChatMsgsList[number].emotions[index].users.length;
            //   bimbex++
            // ) {
            if (
              oldCurrentChatMsgsList[number].emotions[index].users.includes(
                userFindName
              )
            ) {
              oldCurrentChatMsgsList[number].emotions[index].count--
              if (oldCurrentChatMsgsList[number].emotions[index].count == 0) {
                oldCurrentChatMsgsList[number].emotions.splice(index, 1)
              } else {
                let k =
                  oldCurrentChatMsgsList[number].emotions[index].users.indexOf(
                    userFindName
                  )
                if (k !== -1) {
                  oldCurrentChatMsgsList[number].emotions[index].users.splice(
                    k,
                    1
                  )
                }
              }
            } else {
              oldCurrentChatMsgsList[number].emotions[index].count++
              oldCurrentChatMsgsList[number].emotions[index].users.push(
                userFindName
              )
            }
            // }
            break
          } else {
            if (currentChatMsgsList[number].emotions.length - index == 1) {
              oldCurrentChatMsgsList[number].emotions.push({
                name: mainInfo.name,
                smile: mainInfo.smile,
                users: [userFindName],
                count: 1,
              })
              break
            }
          }
        }
      }
      setCurrentChatMsgsList(oldCurrentChatMsgsList)
    }
  }

  async function changeSmileFromAllChatList(mainInfo: smileMsgType) {
    let prevEmo: any
    let newEmo: any
    let oldAllChatList = structuredClone(allChatsList)
    for (let i = 0; i < allChatsList.length; i++) {
      if (allChatsList[i].findname == currentChatFindname && msgMenuTargets) {
        let number = Number(
          msgMenuTargets[0]?.getAttribute("data-msgkey")?.slice(11)
        )
        number = number
        // number = number - 3
        if (!allChatsList[i].messages[number].emotions.length) {
          prevEmo = []
          oldAllChatList[i].messages[number].emotions.push({
            name: mainInfo.name,
            smile: mainInfo.smile,
            users: [userFindName],
            count: 1,
          })
          newEmo = oldAllChatList[i].messages[number].emotions
        } else {
          for (
            let index = 0;
            index < allChatsList[i].messages[number].emotions.length;
            index++
          ) {
            if (
              allChatsList[i].messages[number].emotions[index].name ==
              mainInfo.name
            ) {
              // for (
              //   let bimbex = 0;
              //   bimbex <
              //   allChatsList[i].messages[number].emotions[index].users.length;
              //   bimbex++
              // ) {
              if (
                allChatsList[i].messages[number].emotions[index].users.includes(
                  userFindName
                )
              ) {
                oldAllChatList[i].messages[number].emotions[index].count--
                if (
                  oldAllChatList[i].messages[number].emotions[index].count == 0
                ) {
                  prevEmo = [...allChatsList[i].messages[number].emotions]
                  oldAllChatList[i].messages[number].emotions.splice(index, 1)
                  newEmo = [...oldAllChatList[i].messages[number].emotions]
                } else {
                  let k =
                    allChatsList[i].messages[number].emotions[
                      index
                    ].users.indexOf(userFindName)
                  if (k !== -1) {
                    prevEmo = [...allChatsList[i].messages[number].emotions]
                    oldAllChatList[i].messages[number].emotions[
                      index
                    ].users.splice(k, 1)
                    newEmo = [...oldAllChatList[i].messages[number].emotions]
                  }
                }
                break
              } else {
                prevEmo = [...allChatsList[i].messages[number].emotions]
                oldAllChatList[i].messages[number].emotions[index].count++
                oldAllChatList[i].messages[number].emotions[index].users.push(
                  userFindName
                )
                newEmo = [...oldAllChatList[i].messages[number].emotions]
              }
              // }
              break
            } else {
              if (
                allChatsList[i].messages[number].emotions.length - index ==
                1
              ) {
                prevEmo = [...allChatsList[i].messages[number].emotions]
                oldAllChatList[i].messages[number].emotions.push({
                  name: mainInfo.name,
                  smile: mainInfo.smile,
                  users: [userFindName],
                  count: 1,
                })
                newEmo = [...oldAllChatList[i].messages[number].emotions]
                break
              }
            }
          }
        }
        setAllChatsList(oldAllChatList)
        return { newEmo: newEmo, prevEmo: prevEmo }
      }
    }
  }
  // let smileInfo: smileMsgType = {
  //   type: "changeSmile",
  //   smile: unoSmile.symbol,
  // }
  // universalChatManipulationFunction(
  //   smileInfo,
  //   "changeSmile"
  // )

  async function universalChatManipulationFunction(
    mainInfo:
      | addMsgType
      | editMsgType
      | blobMsgType
      | { type: "nomsg" }
      | smileMsgType
      | { type: "mute"; time: string }
      | { type: "unmute" },
    action: string
  ) {
    if (currentChatMsgsList && allChatsList) {
      let msg: {
        type: string
        findname: string
        mainInfo:
          | addMsgType
          | deleteMsgType
          | editMsgType
          | { type: "nomsg" }
          | smileMsgType
          | { type: "mute"; time: string }
          | { type: "unmute" }
          | blobMsgType
        action: string
        pinned: boolean
        reciever?: string
      } = {
        type: currentChatType,
        findname: currentChatFindname,
        mainInfo: mainInfo,
        action: action,
        pinned: false,
      }
      switch (action) {
        case "unmute":
          if (mainInfo.type == "unmute") {
            if (
              currentChatType == "chanell" &&
              allChatsListInUser &&
              allChatsListInUser.chanellsList
            ) {
              let oldAllChatsListInUser = structuredClone(allChatsListInUser)
              if (oldAllChatsListInUser && oldAllChatsListInUser.chanellsList) {
                for (
                  let index = 0;
                  index < oldAllChatsListInUser.chanellsList.length;
                  index++
                ) {
                  if (
                    oldAllChatsListInUser.chanellsList[index].findname ==
                    currentChatFindname
                  ) {
                    oldAllChatsListInUser.chanellsList[index].muted = "no"
                    setCurrentChatMutted("no")
                    break
                  }
                }
              }
              setAllChatsListInUser(oldAllChatsListInUser)
              let mutemsg = {
                type: currentChatType,
                findname: currentChatFindname,
                mainInfo: mainInfo,
                action: action,
              }
              let msgInString = JSON.stringify(mutemsg)
              await (async () => {
                ws?.send(msgInString)
              })()
            }
            if (
              currentChatType == "chat" &&
              allChatsListInUser &&
              allChatsListInUser.chatsList
            ) {
              let oldAllChatsListInUser = structuredClone(allChatsListInUser)
              if (oldAllChatsListInUser && oldAllChatsListInUser.chatsList) {
                for (
                  let index = 0;
                  index < oldAllChatsListInUser.chatsList.length;
                  index++
                ) {
                  if (
                    oldAllChatsListInUser.chatsList[index].findname ==
                    currentChatFindname
                  ) {
                    oldAllChatsListInUser.chatsList[index].muted = "no"
                    setCurrentChatMutted("no")
                    break
                  }
                }
              }
              setAllChatsListInUser(oldAllChatsListInUser)
              let mutemsg = {
                type: currentChatType,
                findname: currentChatFindname,
                mainInfo: mainInfo,
                action: action,
              }
              let msgInString = JSON.stringify(mutemsg)
              await (async () => {
                ws?.send(msgInString)
              })()
            }
          }
          break
        case "mute":
          if (mainInfo.type == "mute") {
            if (
              currentChatType == "chanell" &&
              allChatsListInUser &&
              allChatsListInUser.chanellsList
            ) {
              let timeToStop: string
              if (mainInfo.time === "permanent") {
                timeToStop = "permanent"
              } else {
                timeToStop = String(
                  new Date().getTime() + Number(mainInfo.time)
                )
              }

              let oldAllChatsListInUser = structuredClone(allChatsListInUser)
              if (oldAllChatsListInUser && oldAllChatsListInUser.chanellsList) {
                for (
                  let index = 0;
                  index < oldAllChatsListInUser.chanellsList.length;
                  index++
                ) {
                  if (
                    oldAllChatsListInUser.chanellsList[index].findname ==
                    currentChatFindname
                  ) {
                    if (mainInfo.time == "permanent") {
                      oldAllChatsListInUser.chanellsList[index].muted =
                        "permanent"
                      setCurrentChatMutted("yes")
                    } else {
                      oldAllChatsListInUser.chanellsList[index].muted =
                        timeToStop
                      setCurrentChatMutted("yes")
                    }
                    break
                  }
                }
              }
              setAllChatsListInUser(oldAllChatsListInUser)
              let mutemsg = {
                type: currentChatType,
                findname: currentChatFindname,
                mainInfo: {
                  type: "mute",
                  time: timeToStop,
                },
                action: action,
              }
              let msgInString = JSON.stringify(mutemsg)
              await (async () => {
                ws?.send(msgInString)
              })()
            }
            if (
              currentChatType == "chat" &&
              allChatsListInUser &&
              allChatsListInUser.chatsList
            ) {
              let timeToStop: string
              if (mainInfo.time === "permanent") {
                timeToStop = "permanent"
              } else {
                timeToStop = String(
                  new Date().getTime() + Number(mainInfo.time)
                )
              }

              let oldAllChatsListInUser = structuredClone(allChatsListInUser)
              if (oldAllChatsListInUser && oldAllChatsListInUser.chatsList) {
                for (
                  let index = 0;
                  index < oldAllChatsListInUser.chatsList.length;
                  index++
                ) {
                  if (
                    oldAllChatsListInUser.chatsList[index].findname ==
                    currentChatFindname
                  ) {
                    if (mainInfo.time == "permanent") {
                      oldAllChatsListInUser.chatsList[index].muted = "permanent"
                      setCurrentChatMutted("yes")
                    } else {
                      oldAllChatsListInUser.chatsList[index].muted = timeToStop
                      setCurrentChatMutted("yes")
                    }
                    break
                  }
                }
              }
              setAllChatsListInUser(oldAllChatsListInUser)
              let mutemsg = {
                type: currentChatType,
                findname: currentChatFindname,
                mainInfo: {
                  type: "mute",
                  time: timeToStop,
                },
                action: action,
              }
              let msgInString = JSON.stringify(mutemsg)
              await (async () => {
                ws?.send(msgInString)
              })()
            }
          }
          break
        case "add":
          if (mainInfo.type == "add" || mainInfo.type == "blob") {
            if (!currentChatMsgsList.length) {
              if (currentChatType == "chat") {
                let reciever = currentChatFindname
                await addToCurrentChat(mainInfo)
                await addToAllChatListNew(mainInfo)
                await addToUserChatListNew(mainInfo)
                msg = {
                  type: currentChatType,
                  findname: currentChatFindname,
                  mainInfo: mainInfo,
                  action: "addNew",
                  pinned: false,
                  reciever: reciever,
                }
                let msgInString = JSON.stringify(msg)
                await (async () => {
                  ws?.send(msgInString)
                })()
                setCurrentChatComentary("")
                let input1 = document.getElementById(
                  "userInterfaceChatMainInputTextInput"
                ) as HTMLInputElement
                if (input1) {
                  input1.value = ""
                }
                let input2 = document.getElementById(
                  "fileUploadCommentaryInput"
                ) as HTMLInputElement
                if (input2) {
                  input2.value = ""
                }
                scrollLastmsgIfAtBottom()
                setCurrentChatFindname(`${userFindName}${currentChatFindname}`)
                break
              }
            }
            await addToCurrentChat(mainInfo)
            await addToAllChatList(mainInfo)
            await addToUserChatList(mainInfo)
            msg = {
              type: currentChatType,
              findname: currentChatFindname,
              mainInfo: mainInfo,
              action: action,
              pinned: false,
            }
            let msgInString = JSON.stringify(msg)
            await (async () => {
              ws?.send(msgInString)
            })()
            setCurrentChatComentary("")
            let input1 = document.getElementById(
              "userInterfaceChatMainInputTextInput"
            ) as HTMLInputElement
            if (input1) {
              input1.value = ""
            }
            let input2 = document.getElementById(
              "fileUploadCommentaryInput"
            ) as HTMLInputElement
            if (input2) {
              input2.value = ""
            }
            scrollLastmsgIfAtBottom()
          }
          break
        case "changeSmile":
          if (mainInfo.type == "changeSmile") {
            let newEmotionArray = await changeSmileFromAllChatList(mainInfo)
            await changeSmileFromCurrentChat(mainInfo)

            for (let i = 0; i < allChatsList.length; i++) {
              if (
                allChatsList[i].findname == currentChatFindname &&
                msgMenuTargets
              ) {
                let number = Number(
                  msgMenuTargets[0]?.getAttribute("data-msgkey")?.slice(11)
                )
                number = number
                // number = number - 3
                let newmsg = {
                  type: currentChatType,
                  findname: currentChatFindname,
                  mainInfo: {
                    type: "changeSmile",
                    newEmotionArray: newEmotionArray,
                    time: allChatsList[i].messages[number].time,
                    emotion: mainInfo,
                  },
                  action: action,
                }
                let msgInString = JSON.stringify(newmsg)
                await (async () => {
                  ws?.send(msgInString)
                })()
                break
              }
            }
            setMsgMenuTargets([])
            setMsgMenu(false)
          }

          break
        case "delete":
          if (mainInfo.type != "add") {
            await deleteFromCurrentChat()
            let coolObj = await deleteFromAllChatList()
            await deleteFromUserChatList(coolObj)

            let arrayOfDeletedMsgTimesAndIndexes = []
            for (let i = 0; i < coolObj.toDeleteArray.length; i++) {
              arrayOfDeletedMsgTimesAndIndexes.push({
                time: coolObj.toDeleteArray[i],
                index: coolObj.toDeleteArrayIndexes[i],
              })
            }
            let delmsg = {
              type: currentChatType,
              findname: currentChatFindname,
              mainInfo: {
                type: "delete",
                arrayOfObj: arrayOfDeletedMsgTimesAndIndexes,
              },
              action: action,
            }
            let msgInString = JSON.stringify(delmsg)
            await (async () => {
              ws?.send(msgInString)
            })()
          }
          break
        case "pin":
          if (msgMenuTargets && msgMenuTargets[0]) {
            let time = await pinInCurrentChat()
            await pinInAllChatList()

            let msgEdit = {
              type: currentChatType,
              findname: currentChatFindname,
              action: action,
              mainInfo: {
                type: "pin",
                msgObjToPin: {
                  time: time,
                },
              },
            }
            let msgInString = JSON.stringify(msgEdit)
            setMsgMenuTargets([])
            await (async () => {
              ws?.send(msgInString)
            })()
          }
          break
        case "edit":
          if (
            mainInfo.type == "edit" &&
            mainInfo.msgObjToEdit.currentEditTarget
          ) {
            let text: any
            for (
              let index = 0;
              index <
              mainInfo.msgObjToEdit.currentEditTarget.children[0].children
                .length;
              index++
            ) {
              const element =
                mainInfo.msgObjToEdit.currentEditTarget.children[0].children[
                  index
                ]
              if (element.id == "comentary") {
                text =
                  mainInfo.msgObjToEdit.currentEditTarget.children[0].children[
                    index
                  ].children[0].innerHTML
              }
            }
            if (text != mainInfo.msgObjToEdit.currentEditTextInput) {
              let time = await editInCurrentChat(mainInfo)
              await editInAllChatList(mainInfo)

              setCurrentEditTarget(undefined)
              setCurrentEditText("")
              setCurrentEditTextInput("")
              setCurrentEditingState(false)
              setMsgMenuTargets([])

              let msgEdit = {
                type: currentChatType,
                findname: currentChatFindname,
                action: action,
                mainInfo: {
                  type: "edit",
                  msgObjToEdit: {
                    time: time,
                    currentEditTextInput: currentEditTextInput,
                  },
                },
              }
              let msgInString = JSON.stringify(msgEdit)
              await (async () => {
                ws?.send(msgInString)
              })()
            } else {
              setCurrentEditTarget(undefined)
              setCurrentEditText("")
              setCurrentEditTextInput("")
              setCurrentEditingState(false)
              setMsgMenuTargets([])
            }
          }
          break
      }
    }
  }

  // async function submitCurrentChatInput(
  //   currentChatFindname: string,
  //   currentChatType: string,
  //   event: React.KeyboardEvent<HTMLInputElement>
  // ) {
  //   let target = event.target as HTMLInputElement
  //   if (event.key == "Enter") {
  //     if (!target.value) {
  //       return
  //     }
  //     // let currentValue = target.value
  //     // WRONG data FORMAT
  //     let data = {
  //       auth_token: auth_token,
  //       findname: currentChatFindname,
  //       newMessage: { img: "", comentary: target.value, emotions: [] },
  //     }

  //     fetch(
  //       `${process.env.REACT_APP_SERVER_ENDPOINT}/users/updateChanellChat`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           withCredentials: "true",
  //           "Access-Control-Allow-Origin": "*",
  //         },
  //         body: JSON.stringify(data),
  //       }
  //     ).then(async (response) => {
  //       const resText = await response.json()
  //       if (resText[0] == "chanell messages updated successfully") {
  //         setCurrentChatMsgsList(resText[1].messages)
  //         let oldAllChatList = [...allChatsList]
  //         for (let i = 0; i < allChatsList.length; i++) {
  //           if (allChatsList[i].findname == currentChatFindname) {
  //             oldAllChatList[i].messages = resText[1].messages
  //             setAllChatsList(oldAllChatList)
  //           }
  //         }
  //       } else {
  //         alert("Some Error during updating a chanell")
  //       }
  //       target.value = ""
  //     })
  //   }
  // }

  // function showMessage(message: string) {
  //   if (!messagesDiv) {
  //     return
  //   }
  //   messagesDiv.textContent += `\n${message}`
  //   messagesDiv.scrollTop = messagesDiv?.scrollHeight
  // }
  // useEffect(() => {
  //   console.log(pressedSelect)
  //   if (pressedSelect == "1") {
  //     document
  //       .getElementById("msgContextMenu")
  //       ?.removeEventListener("mouseleave", onMouseOut)
  //     let a = { ...msgContextMenu }
  //     a.selected = true
  //     a.display = false
  //     setMsgContextMenu(a)
  //   }
  // }, [pressedSelect])
  const [ws, setWs] = useState<WebSocket>()
  function closeConnection() {
    if (!!ws) {
      ws.close()
    }
  }
  async function forWsOnMessage(event: MessageEvent<any>) {
    let msgObj = JSON.parse(event.data)
    await onNewMsg(msgObj)
    if (
      msgObj.action == "add" &&
      (msgObj.type == "chanell" || msgObj.type == "chat")
    ) {
      await scrollOnFunc()
      checkIfAtBottom()
      scrollLastmsgIfAtBottom()
    }
  }
  async function doConnect() {
    closeConnection()
    let ws = new WebSocket(
      `${process.env.REACT_APP_WEB_SOCKET_URL}/${notrealauthtoken}`
    )
    setWs(ws)
    ws.addEventListener("error", () => {
      console.log("WebSocket error")
    })
    ws.addEventListener("open", () => {
      console.log("WebSocket connection established")
    })
    ws.addEventListener("close", () => {
      console.log("WebSocket connection closed")
      console.log("WebSocket trying to reconect in 5 sec")
      setTimeout(function () {
        doConnect()
      }, 5000)
    })
    ws.onmessage = forWsOnMessage
    // ws.addEventListener("message", async (msg) => {
    //   let msgObj = JSON.parse(msg.data)
    //   await onNewMsg(msgObj)
    // })
  }
  useEffect(() => {
    if (ws) {
      ws.onmessage = forWsOnMessage
    }
  }, [
    currentChatFindname,
    currentChatMsgsList,
    letBeLastSeenSync,
    allChatsList,
  ])
  async function onNewMsg(
    msgObj: {
      type: string
      findname: string
      // mainInfo: deleteMsgType
      mainInfo: any
      time: string
      action: string
    } & {
      type: string
      findname: string
      // mainInfo: addMsgType
      mainInfo: any
      time: string
      action: string
    } & {
      type: string
      findname: string
      // mainInfo: addMsgType
      mainInfo: any
      time: string
      action: string
    } & {
      type: string
      findname: string
      // mainInfo: addMsgType
      mainInfo: any
      action: string
    } & {
      type: string
      findname: string
      // mainInfo: addMsgType
      mainInfo: any
      action: string
      photoLink: string
      username: string
      userFindname: string
    }
  ) {
    await (async () => {
      // let msgObj = newWebSocketMsg
      if (msgObj) {
        if (msgObj.action == "online") {
          let oldOnlineList = structuredClone(onlineList)
          for (let index = 0; index < oldOnlineList.length; index++) {
            if (oldOnlineList[index].findname === msgObj.mainInfo.findname) {
              oldOnlineList[index].online = msgObj.mainInfo.time
              break
            }
          }
          setOnlineList(oldOnlineList)
        }
        if (msgObj.action == "changeSmile") {
          if (currentChatMsgsList) {
            let oldCurrentChatMsgsList = structuredClone(currentChatMsgsList)
            let oldAllChatList: any = structuredClone(allChatsList)

            for (let www = 0; www < allChatsList.length; www++) {
              if (allChatsList[www].findname == msgObj.findname) {
                let countWay: any
                for (let i = 0; i < allChatsList[www].messages.length; i++) {
                  if (
                    String(allChatsList[www].messages[i].time) ==
                    String(msgObj.mainInfo.time)
                  ) {
                    if (!msgObj.mainInfo.newEmotionArray.prevEmo.length) {
                      oldAllChatList[www].messages[i].emotions.push({
                        name: msgObj.mainInfo.newEmotionArray.newEmo[0].name,
                        smile: msgObj.mainInfo.newEmotionArray.newEmo[0].smile,
                        users: [userFindName],
                        count: 1,
                      })
                    } else {
                      if (!msgObj.mainInfo.newEmotionArray.newEmo.length) {
                        oldAllChatList[www].messages[i].emotions = []
                      } else {
                        if (
                          msgObj.mainInfo.newEmotionArray.prevEmo.length <
                          msgObj.mainInfo.newEmotionArray.newEmo.length
                        ) {
                          oldAllChatList[www].messages[i].emotions.push({
                            name: msgObj.mainInfo.emotion.name,
                            smile: msgObj.mainInfo.emotion.smile,
                            users: [userFindName],
                            count: 1,
                          })
                          break
                        } else {
                          if (
                            msgObj.mainInfo.newEmotionArray.prevEmo.length >
                            msgObj.mainInfo.newEmotionArray.newEmo.length
                          ) {
                            for (
                              let index = 0;
                              index <
                              oldAllChatList[www].messages[i].emotions.length;
                              index++
                            ) {
                              if (
                                oldAllChatList[www].messages[i].emotions[index]
                                  .name == msgObj.mainInfo.emotion.name
                              ) {
                                oldAllChatList[www].messages[i].emotions.splice(
                                  index,
                                  1
                                )
                                break
                              }
                            }
                          } else {
                            if (
                              msgObj.mainInfo.newEmotionArray.prevEmo.length ==
                              msgObj.mainInfo.newEmotionArray.newEmo.length
                            ) {
                              for (
                                let index = 0;
                                index <
                                oldAllChatList[www].messages[i].emotions.length;
                                index++
                              ) {
                                if (
                                  oldAllChatList[www].messages[i].emotions[
                                    index
                                  ].name == msgObj.mainInfo.emotion.name
                                ) {
                                  for (
                                    let aaaa = 0;
                                    aaaa <
                                    msgObj.mainInfo.newEmotionArray.prevEmo
                                      .length;
                                    aaaa++
                                  ) {
                                    if (
                                      msgObj.mainInfo.newEmotionArray.prevEmo[
                                        aaaa
                                      ].name == msgObj.mainInfo.emotion.name
                                    ) {
                                      for (
                                        let dddd = 0;
                                        dddd <
                                        msgObj.mainInfo.newEmotionArray.newEmo
                                          .length;
                                        dddd++
                                      ) {
                                        if (
                                          msgObj.mainInfo.newEmotionArray
                                            .newEmo[dddd].name ==
                                          msgObj.mainInfo.emotion.name
                                        ) {
                                          if (
                                            Number(
                                              msgObj.mainInfo.newEmotionArray
                                                .prevEmo[aaaa].count
                                            ) <
                                            Number(
                                              msgObj.mainInfo.newEmotionArray
                                                .newEmo[dddd].count
                                            )
                                          ) {
                                            countWay = "increase"
                                          } else {
                                            countWay = "decrease"
                                          }
                                          break
                                        }
                                      }
                                      break
                                    }
                                  }
                                  if (countWay == "decrease") {
                                    oldAllChatList[www].messages[i].emotions[
                                      index
                                    ].count--
                                    let k =
                                      oldAllChatList[www].messages[i].emotions[
                                        index
                                      ].users.indexOf(userFindName)
                                    if (k !== -1) {
                                      oldAllChatList[www].messages[i].emotions[
                                        index
                                      ].users.splice(k, 1)
                                    }
                                  } else {
                                    oldAllChatList[www].messages[i].emotions[
                                      index
                                    ].count++
                                    oldAllChatList[www].messages[i].emotions[
                                      index
                                    ].users.push(userFindName)
                                  }
                                  break
                                }
                              }
                            }
                          }
                        }
                      }
                    }

                    break
                  }
                }
                setAllChatsList(oldAllChatList)

                for (
                  let topIndex = 0;
                  topIndex < oldCurrentChatMsgsList.length;
                  topIndex++
                ) {
                  if (
                    String(oldCurrentChatMsgsList[topIndex].time) ===
                    String(msgObj.mainInfo.time)
                  ) {
                    if (!oldCurrentChatMsgsList[topIndex].emotions.length) {
                      oldCurrentChatMsgsList[topIndex].emotions.push({
                        name: msgObj.mainInfo.emotion.name,
                        smile: msgObj.mainInfo.emotion.smile,
                        users: [userFindName],
                        count: 1,
                      })
                    } else {
                      for (
                        let index = 0;
                        index <
                        oldCurrentChatMsgsList[topIndex].emotions.length;
                        index++
                      ) {
                        if (
                          oldCurrentChatMsgsList[topIndex].emotions[index]
                            .name == msgObj.mainInfo.emotion.name
                        ) {
                          // for (
                          //   let bimbex = 0;
                          //   bimbex <
                          //   oldCurrentChatMsgsList[topIndex].emotions[index].users.length;
                          //   bimbex++
                          // ) {
                          if (
                            oldCurrentChatMsgsList[topIndex].emotions[
                              index
                            ].users.includes(userFindName)
                          ) {
                            oldCurrentChatMsgsList[topIndex].emotions[index]
                              .count--
                            if (
                              oldCurrentChatMsgsList[topIndex].emotions[index]
                                .count == 0
                            ) {
                              oldCurrentChatMsgsList[topIndex].emotions.splice(
                                index,
                                1
                              )
                            } else {
                              let k =
                                oldCurrentChatMsgsList[topIndex].emotions[
                                  index
                                ].users.indexOf(userFindName)
                              if (k !== -1) {
                                oldCurrentChatMsgsList[topIndex].emotions[
                                  index
                                ].users.splice(k, 1)
                              }
                            }
                          } else {
                            oldCurrentChatMsgsList[topIndex].emotions[index]
                              .count++
                            oldCurrentChatMsgsList[topIndex].emotions[
                              index
                            ].users.push(userFindName)
                          }
                          // }
                          break
                        } else {
                          if (
                            currentChatMsgsList[topIndex].emotions.length -
                              index ==
                            1
                          ) {
                            oldCurrentChatMsgsList[topIndex].emotions.push({
                              name: msgObj.mainInfo.emotion.name,
                              smile: msgObj.mainInfo.emotion.smile,
                              users: [userFindName],
                              count: 1,
                            })
                            break
                          }
                        }
                      }
                    }
                    setCurrentChatMsgsList(oldCurrentChatMsgsList)
                    break
                  }
                }
              }
            }
          }
        }
        if (msgObj.action == "removeDeleted") {
          let correctionArray = msgObj.mainInfo
          for (let i = 0; i < correctionArray.length; i++) {
            if (
              correctionArray[i].type == "chanell" &&
              allChatsListInUser &&
              allChatsListInUser.chanellsList
            ) {
              for (let l = 0; l < allChatsListInUser.chanellsList.length; l++) {
                if (
                  correctionArray[i].findname ==
                  allChatsListInUser?.chanellsList[l].findname
                ) {
                  let oldAllUserList = structuredClone(allChatsListInUser)
                  if (oldAllUserList && oldAllUserList.chanellsList) {
                    oldAllUserList.chanellsList[l].lastSeenMsg = String(
                      Number(allChatsListInUser?.chanellsList[l].lastSeenMsg) -
                        Number(correctionArray[i].number)
                    )
                  }
                  setAllChatsListInUser(oldAllUserList)
                }
              }
            }
          }
        }
        if (msgObj.action == "add") {
          if (msgObj.type == "chanell") {
            let oldAllChatList: any = structuredClone(allChatsList)
            for (let i = 0; i < allChatsList.length; i++) {
              if (allChatsList[i].findname == msgObj.findname) {
                oldAllChatList[i].messages.push(msgObj.mainInfo)
                if (
                  JSON.stringify(msgObj.mainInfo) !=
                  JSON.stringify(
                    allChatsList[i].messages[
                      allChatsList[i].messages.length - 1
                    ]
                  )
                ) {
                  setAllChatsList(oldAllChatList)
                }
                break
              }
            }
            if (currentChatFindname == msgObj.findname && currentChatMsgsList) {
              let oldCurrentChatMsgsList = [...currentChatMsgsList]
              oldCurrentChatMsgsList.push(msgObj.mainInfo)
              if (
                JSON.stringify(msgObj.mainInfo) !=
                JSON.stringify(
                  currentChatMsgsList[currentChatMsgsList.length - 1]
                )
              ) {
                await (async () => {
                  setCurrentChatMsgsList(oldCurrentChatMsgsList)
                })()
              }
            }
            await notifyNewMsg(msgObj.findname, msgObj.type)
          }
          if (msgObj.type == "chat") {
            let oldAllChatList: any = structuredClone(allChatsList)
            for (let i = 0; i < allChatsList.length; i++) {
              if (allChatsList[i].findname == msgObj.findname) {
                oldAllChatList[i].messages.push(msgObj.mainInfo)
                if (
                  JSON.stringify(msgObj.mainInfo) !=
                  JSON.stringify(
                    allChatsList[i].messages[
                      allChatsList[i].messages.length - 1
                    ]
                  )
                ) {
                  setAllChatsList(oldAllChatList)
                }
                break
              }
            }
            if (currentChatFindname == msgObj.findname && currentChatMsgsList) {
              let oldCurrentChatMsgsList = [...currentChatMsgsList]
              oldCurrentChatMsgsList.push(msgObj.mainInfo)
              if (
                JSON.stringify(msgObj.mainInfo) !=
                JSON.stringify(
                  currentChatMsgsList[currentChatMsgsList.length - 1]
                )
              ) {
                await (async () => {
                  setCurrentChatMsgsList(oldCurrentChatMsgsList)
                })()
              }
            }
            await notifyNewMsg(msgObj.findname, msgObj.type)
          }
        }
        if (msgObj.action == "addNew") {
          // if (msgObj.type == "chanell") {
          //   let oldAllChatList: any = structuredClone(allChatsList)
          //   for (let i = 0; i < allChatsList.length; i++) {
          //     if (allChatsList[i].findname == msgObj.findname) {
          //       oldAllChatList[i].messages.push(msgObj.mainInfo)
          //       if (
          //         JSON.stringify(msgObj.mainInfo) !=
          //         JSON.stringify(
          //           allChatsList[i].messages[
          //             allChatsList[i].messages.length - 1
          //           ]
          //         )
          //       ) {
          //         setAllChatsList(oldAllChatList)
          //       }
          //       break
          //     }
          //   }
          //   if (currentChatFindname == msgObj.findname && currentChatMsgsList) {
          //     let oldCurrentChatMsgsList = [...currentChatMsgsList]
          //     oldCurrentChatMsgsList.push(msgObj.mainInfo)
          //     if (
          //       JSON.stringify(msgObj.mainInfo) !=
          //       JSON.stringify(
          //         currentChatMsgsList[currentChatMsgsList.length - 1]
          //       )
          //     ) {
          //       await (async () => {
          //         setCurrentChatMsgsList(oldCurrentChatMsgsList)
          //       })()
          //     }
          //   }
          //   await notifyNewMsg(msgObj.findname, msgObj.type)
          // }
          if (msgObj.type == "chat") {
            let oldAllChatList: any = structuredClone(allChatsList)
            oldAllChatList.unshift({
              group: "chat",
              findname: `${userFindName}${currentChatFindname}`,
              partisipants: [
                { admin: "yes", findname: userFindName, deleted: [] },
                { admin: "yes", findname: currentChatFindname, deleted: [] },
              ],
              lastUpdated: new Date().getTime().toString(),
              messages: [msgObj.mainInfo],
            })
            setAllChatsList(oldAllChatList)
            let oldAllChatsListInUser = structuredClone(allChatsListInUser)
            oldAllChatsListInUser?.chatsList?.push({
              archived: "no",
              findname: `${userFindName}${currentChatFindname}`,
              lastSeenMsg: "0",
              muted: "no",
              pinned: "no",
              photoLink: msgObj.photoLink,
              username: msgObj.username,
              userFindname: msgObj.userFindname,
            })
            setAllChatsListInUser(oldAllChatsListInUser)
          }
          await notifyNewMsg(msgObj.findname, msgObj.type)
        }
        if (msgObj.action == "edit") {
          if (msgObj.type == "chanell") {
            if (allChatsList) {
              if (
                currentChatMsgsList &&
                currentChatFindname == msgObj.findname
              ) {
                let oldCurrentChatMsgsList =
                  structuredClone(currentChatMsgsList)
                for (let i = 0; i < currentChatMsgsList.length; i++) {
                  if (
                    oldCurrentChatMsgsList[i].time ==
                    msgObj.mainInfo.msgObjToEdit.time
                  ) {
                    oldCurrentChatMsgsList[i].comentary =
                      msgObj.mainInfo.msgObjToEdit.currentEditTextInput
                    setCurrentChatMsgsList(oldCurrentChatMsgsList)
                    break
                  }
                }
              }
              let oldAllChatList = structuredClone(allChatsList)
              for (let i = 0; i < allChatsList.length; i++) {
                if (allChatsList[i].findname == msgObj.findname) {
                  for (let l = 0; l < allChatsList[i].messages.length; l++) {
                    if (
                      allChatsList[i].messages[l].time ==
                      msgObj.mainInfo.msgObjToEdit.time
                    ) {
                      oldAllChatList[i].messages[l].comentary =
                        msgObj.mainInfo.msgObjToEdit.currentEditTextInput
                      setAllChatsList(oldAllChatList)
                      break
                    }
                  }
                  break
                }
              }
            }
          }
          if (msgObj.type == "chat") {
            if (allChatsList) {
              if (
                currentChatMsgsList &&
                currentChatFindname == msgObj.findname
              ) {
                let oldCurrentChatMsgsList =
                  structuredClone(currentChatMsgsList)
                for (let i = 0; i < currentChatMsgsList.length; i++) {
                  if (
                    oldCurrentChatMsgsList[i].time ==
                    msgObj.mainInfo.msgObjToEdit.time
                  ) {
                    oldCurrentChatMsgsList[i].comentary =
                      msgObj.mainInfo.msgObjToEdit.currentEditTextInput
                    setCurrentChatMsgsList(oldCurrentChatMsgsList)
                    break
                  }
                }
              }
              let oldAllChatList = structuredClone(allChatsList)
              for (let i = 0; i < allChatsList.length; i++) {
                if (allChatsList[i].findname == msgObj.findname) {
                  for (let l = 0; l < allChatsList[i].messages.length; l++) {
                    if (
                      allChatsList[i].messages[l].time ==
                      msgObj.mainInfo.msgObjToEdit.time
                    ) {
                      oldAllChatList[i].messages[l].comentary =
                        msgObj.mainInfo.msgObjToEdit.currentEditTextInput
                      setAllChatsList(oldAllChatList)
                      break
                    }
                  }
                  break
                }
              }
            }
          }
        }
        if (msgObj.action == "pin") {
          if (msgObj.type == "chanell") {
            if (allChatsList) {
              if (
                currentChatMsgsList &&
                currentChatFindname == msgObj.findname
              ) {
                let oldCurrentChatMsgsList =
                  structuredClone(currentChatMsgsList)
                for (let i = 0; i < currentChatMsgsList.length; i++) {
                  if (
                    oldCurrentChatMsgsList[i].time ==
                    msgObj.mainInfo.msgObjToPin.time
                  ) {
                    oldCurrentChatMsgsList[i].pinned =
                      !oldCurrentChatMsgsList[i].pinned
                    let time = oldCurrentChatMsgsList[i].time
                    if (oldCurrentChatMsgsList[i].pinned === true) {
                      let list = structuredClone(currentChatPinnedList)
                      for (let index = 0; index < list.length; index++) {
                        const listTime = list[index].time
                        if (listTime > time || list.length - 1 === index) {
                          for (let ooo = 0; ooo < list.length; ooo++) {
                            if (list[ooo].index >= index) {
                              list[ooo].index++
                            }
                          }
                          list.splice(index, 0, {
                            time: oldCurrentChatMsgsList[i].time,
                            comentary: oldCurrentChatMsgsList[i].comentary,
                            photoLink: oldCurrentChatMsgsList[i].img,
                            index: index,
                          })
                          break
                        }
                      }
                      setCurrentChatPinnedList(list)
                      setCurrentPinnedMsgNumber(currentPinnedMsgNumber + 1)
                    } else {
                      let list = structuredClone(currentChatPinnedList)
                      for (let index = 0; index < list.length; index++) {
                        const listTime = list[index].time
                        if (listTime === time) {
                          for (let ooo = 0; ooo < list.length; ooo++) {
                            if (list[ooo].index >= index) {
                              list[ooo].index--
                            }
                          }
                          list.splice(index, 1)
                          break
                        }
                      }
                      setCurrentChatPinnedList(list)
                      setCurrentPinnedMsgNumber(currentPinnedMsgNumber - 1)
                    }

                    setCurrentChatMsgsList(oldCurrentChatMsgsList)
                    break
                  }
                }
              }
              let oldAllChatList = structuredClone(allChatsList)
              for (let i = 0; i < allChatsList.length; i++) {
                if (allChatsList[i].findname == msgObj.findname) {
                  for (let l = 0; l < allChatsList[i].messages.length; l++) {
                    if (
                      allChatsList[i].messages[l].time ==
                      msgObj.mainInfo.msgObjToPin.time
                    ) {
                      oldAllChatList[i].messages[l].pinned =
                        !oldAllChatList[i].messages[l].pinned
                      setAllChatsList(oldAllChatList)
                      break
                    }
                  }
                  break
                }
              }
            }
          }
          if (msgObj.type == "chat") {
            if (allChatsList) {
              if (
                currentChatMsgsList &&
                currentChatFindname == msgObj.findname
              ) {
                let oldCurrentChatMsgsList =
                  structuredClone(currentChatMsgsList)
                for (let i = 0; i < currentChatMsgsList.length; i++) {
                  if (
                    oldCurrentChatMsgsList[i].time ==
                    msgObj.mainInfo.msgObjToPin.time
                  ) {
                    oldCurrentChatMsgsList[i].pinned =
                      !oldCurrentChatMsgsList[i].pinned
                    let time = oldCurrentChatMsgsList[i].time
                    if (oldCurrentChatMsgsList[i].pinned === true) {
                      let list = structuredClone(currentChatPinnedList)
                      for (let index = 0; index < list.length; index++) {
                        const listTime = list[index].time
                        if (listTime > time || list.length - 1 === index) {
                          for (let ooo = 0; ooo < list.length; ooo++) {
                            if (list[ooo].index >= index) {
                              list[ooo].index++
                            }
                          }
                          list.splice(index, 0, {
                            time: oldCurrentChatMsgsList[i].time,
                            comentary: oldCurrentChatMsgsList[i].comentary,
                            photoLink: oldCurrentChatMsgsList[i].img,
                            index: index,
                          })
                          break
                        }
                      }
                      setCurrentChatPinnedList(list)
                      setCurrentPinnedMsgNumber(currentPinnedMsgNumber + 1)
                    } else {
                      let list = structuredClone(currentChatPinnedList)
                      for (let index = 0; index < list.length; index++) {
                        const listTime = list[index].time
                        if (listTime === time) {
                          for (let ooo = 0; ooo < list.length; ooo++) {
                            if (list[ooo].index >= index) {
                              list[ooo].index--
                            }
                          }
                          list.splice(index, 1)
                          break
                        }
                      }
                      setCurrentChatPinnedList(list)
                      setCurrentPinnedMsgNumber(currentPinnedMsgNumber - 1)
                    }
                    setCurrentChatMsgsList(oldCurrentChatMsgsList)
                    break
                  }
                }
              }
              let oldAllChatList = structuredClone(allChatsList)
              for (let i = 0; i < allChatsList.length; i++) {
                if (allChatsList[i].findname == msgObj.findname) {
                  for (let l = 0; l < allChatsList[i].messages.length; l++) {
                    if (
                      allChatsList[i].messages[l].time ==
                      msgObj.mainInfo.msgObjToPin.time
                    ) {
                      oldAllChatList[i].messages[l].pinned =
                        !oldAllChatList[i].messages[l].pinned
                      setAllChatsList(oldAllChatList)
                      break
                    }
                  }
                  break
                }
              }
            }
          }
        }
        if (msgObj.action == "delete") {
          if (msgObj.type == "chanell") {
            let arrayOfMsgIndexes = []
            let arrayOfMsgTimes = []
            if (msgObj.mainInfo.arrayOfObj) {
              let arrayOfDeletedMsgTimesAndIndexes = msgObj.mainInfo.arrayOfObj
              for (
                let i = 0;
                i < arrayOfDeletedMsgTimesAndIndexes.length;
                i++
              ) {
                arrayOfMsgTimes.push(arrayOfDeletedMsgTimesAndIndexes[i].time)
                arrayOfMsgIndexes.push(
                  arrayOfDeletedMsgTimesAndIndexes[i].index
                )
              }
              if (
                currentChatFindname == msgObj.findname &&
                currentChatMsgsList
              ) {
                let oldCurrentChatMsgsList = [...currentChatMsgsList]
                for (let k = arrayOfMsgIndexes.length - 1; k >= 0; k--) {
                  oldCurrentChatMsgsList.splice(arrayOfMsgIndexes[k], 1)
                }
                if (msgMenuTargets) {
                  let newMsgMenuTargets = [...msgMenuTargets]
                  for (let i = 0; i < msgMenuTargets.length; i++) {
                    if (
                      arrayOfMsgIndexes.includes(
                        String(
                          Number(
                            msgMenuTargets[i]
                              ?.getAttribute("data-msgkey")
                              ?.slice(11)
                          )
                        )
                      )
                    ) {
                      newMsgMenuTargets.slice(i, 1)
                    }
                  }
                  setMsgMenuTargets(newMsgMenuTargets)
                }
                setCurrentChatMsgsList(oldCurrentChatMsgsList)
              }
            }
            let oldAllChatList = [...allChatsList]
            for (let i = 0; i < allChatsList.length; i++) {
              if (allChatsList[i].findname == msgObj.findname) {
                for (let k = arrayOfMsgIndexes.length - 1; k >= 0; k--) {
                  oldAllChatList[i].messages.splice(arrayOfMsgIndexes[k], 1)
                }
                setAllChatsList(oldAllChatList)
                break
              }
            }

            let numberToReduceLastSeen = 0
            if (allChatsListInUser && allChatsListInUser.chanellsList) {
              for (let i = 0; i < allChatsListInUser.chanellsList.length; i++) {
                if (
                  allChatsListInUser.chanellsList[i].findname ==
                  currentChatFindname
                ) {
                  for (let l = 0; l < arrayOfMsgIndexes.length; l++) {
                    if (
                      allChatsListInUser.chanellsList[i].lastSeenMsg >
                      arrayOfMsgIndexes[l]
                    ) {
                      numberToReduceLastSeen++
                    }
                  }
                  let newOldUserChatsList = { ...allChatsListInUser }
                  if (newOldUserChatsList && newOldUserChatsList.chanellsList) {
                    let finalLastSeen = String(
                      Number(allChatsListInUser.chanellsList[i].lastSeenMsg) -
                        numberToReduceLastSeen
                    )
                    newOldUserChatsList.chanellsList[i].lastSeenMsg =
                      finalLastSeen
                    setAllChatsListInUser(newOldUserChatsList)
                    let leMsg = {
                      action: "lastSeen",
                      type: "chanell",
                      findname: currentChatFindname,
                      lastSeenMsg: finalLastSeen,
                    }
                    await (async () => {
                      ws?.send(JSON.stringify(leMsg))
                    })()
                  }
                  break
                }
              }
            }
          }
          if (msgObj.type == "chat") {
            let arrayOfMsgIndexes = []
            let arrayOfMsgTimes = []
            if (msgObj.mainInfo.arrayOfObj) {
              let arrayOfDeletedMsgTimesAndIndexes = msgObj.mainInfo.arrayOfObj
              for (
                let i = 0;
                i < arrayOfDeletedMsgTimesAndIndexes.length;
                i++
              ) {
                arrayOfMsgTimes.push(arrayOfDeletedMsgTimesAndIndexes[i].time)
                arrayOfMsgIndexes.push(
                  arrayOfDeletedMsgTimesAndIndexes[i].index
                )
              }
              if (
                currentChatFindname == msgObj.findname &&
                currentChatMsgsList
              ) {
                let oldCurrentChatMsgsList = [...currentChatMsgsList]
                for (let k = arrayOfMsgIndexes.length - 1; k >= 0; k--) {
                  oldCurrentChatMsgsList.splice(arrayOfMsgIndexes[k], 1)
                }
                if (msgMenuTargets) {
                  let newMsgMenuTargets = [...msgMenuTargets]
                  for (let i = 0; i < msgMenuTargets.length; i++) {
                    if (
                      arrayOfMsgIndexes.includes(
                        String(
                          Number(
                            msgMenuTargets[i]
                              ?.getAttribute("data-msgkey")
                              ?.slice(11)
                          )
                        )
                      )
                    ) {
                      newMsgMenuTargets.slice(i, 1)
                    }
                  }
                  setMsgMenuTargets(newMsgMenuTargets)
                }
                setCurrentChatMsgsList(oldCurrentChatMsgsList)
              }
            }
            let oldAllChatList = [...allChatsList]
            for (let i = 0; i < allChatsList.length; i++) {
              if (allChatsList[i].findname == msgObj.findname) {
                for (let k = arrayOfMsgIndexes.length - 1; k >= 0; k--) {
                  oldAllChatList[i].messages.splice(arrayOfMsgIndexes[k], 1)
                }
                setAllChatsList(oldAllChatList)
                break
              }
            }

            let numberToReduceLastSeen = 0
            if (allChatsListInUser && allChatsListInUser.chatsList) {
              for (let i = 0; i < allChatsListInUser.chatsList.length; i++) {
                if (
                  allChatsListInUser.chatsList[i].findname ==
                  currentChatFindname
                ) {
                  for (let l = 0; l < arrayOfMsgIndexes.length; l++) {
                    if (
                      allChatsListInUser.chatsList[i].lastSeenMsg >
                      arrayOfMsgIndexes[l]
                    ) {
                      numberToReduceLastSeen++
                    }
                  }
                  let newOldUserChatsList = { ...allChatsListInUser }
                  if (newOldUserChatsList && newOldUserChatsList.chatsList) {
                    let finalLastSeen = String(
                      Number(allChatsListInUser.chatsList[i].lastSeenMsg) -
                        numberToReduceLastSeen
                    )
                    newOldUserChatsList.chatsList[i].lastSeenMsg = finalLastSeen
                    setAllChatsListInUser(newOldUserChatsList)
                    let leMsg = {
                      action: "lastSeen",
                      type: "chat",
                      findname: currentChatFindname,
                      lastSeenMsg: finalLastSeen,
                    }
                    await (async () => {
                      ws?.send(JSON.stringify(leMsg))
                    })()
                  }
                  break
                }
              }
            }
          }
        }
      }
    })()
  }
  async function notifyNewMsg(theFindname: string, type: string) {
    if (
      allChatsListInUser &&
      allChatsListInUser.chanellsList &&
      allChatsListInUser.chatsList
    ) {
      if (type == "chanell") {
        for (
          let index = 0;
          index < allChatsListInUser.chanellsList.length;
          index++
        ) {
          if (allChatsListInUser.chanellsList[index].findname == theFindname) {
            if (allChatsListInUser.chanellsList[index].muted == "no") {
              let audio = new Audio("./Voicy_Telegram notification.mp3")
              audio.play().catch((error) => {})
            }
          }
        }
      }
      if (type == "chat") {
        for (
          let index = 0;
          index < allChatsListInUser.chatsList.length;
          index++
        ) {
          if (allChatsListInUser.chatsList[index].findname == theFindname) {
            if (allChatsListInUser.chatsList[index].muted == "no") {
              let audio = new Audio("./Voicy_Telegram notification.mp3")
              audio.play().catch((error) => {})
            }
          }
        }
      }
    }
  }
  function toScrolldown() {
    myRef.current.scrollTop =
      myRef.current.scrollHeight - myRef.current.clientHeight + 100
    if (currentChatMsgsList) {
      let msg = {
        action: "lastSeen",
        type: currentChatType,
        findname: currentChatFindname,
        lastSeenMsg: String(currentChatMsgsList.length),
      }
      ws?.send(JSON.stringify(msg))
    }
  }

  async function checkDeletedStuff() {
    if (
      allChatsList &&
      allChatsList.length &&
      allChatsListInUser &&
      allChatsListInUser.findname
    ) {
      let allMsgsFromAllChatsToDelete = []
      for (let i = 0; i < allChatsList.length; i++) {
        if (allChatsList[i].partisipants) {
          for (let l = 0; l < allChatsList[i].partisipants.length; l++) {
            if (allChatsList[i].partisipants[l].findname == userFindName) {
              if (!allChatsList[i].partisipants[l].deleted.length) {
                return
              }
              let arrayOfDeletedMsgs = allChatsList[i].partisipants[l].deleted

              allMsgsFromAllChatsToDelete.push({
                chatType: allChatsList[i].group,
                chatFindname: allChatsList[i].findname,
                removeDeleted: arrayOfDeletedMsgs,
              })
            }
          }
        }
      }
      if (allMsgsFromAllChatsToDelete.length) {
        setLetBeLastSeenSync(letBeLastSeenSync + 1)
        let removeDeletedMsg = {
          action: "removeDeleted",
          findname: userFindName,
          removeDeleted: allMsgsFromAllChatsToDelete,
        }
        // let msg = {
        //   action: "lastSeen",
        //   type: "chanell",
        //   findname: currentChatFindname,
        //   lastSeenMsg: String(currentChatMsgsList.length),
        // }
        // console.log(JSON.stringify(removeDeletedMsg))
        ws?.send(JSON.stringify(removeDeletedMsg))

        // setAllChatsListInUser(resText[1])
        // setAllChatsList(resText[2])
      }
    }
  }
  async function scrollLastmsgIfAtBottom() {
    let vw = window.innerWidth
    let vh = window.innerHeight
    if ((await unreadNumberFunc()) == "upped") {
      if (currentChatMsgsList) {
        if (
          document.querySelectorAll(
            `[data-msgkey="data-msgkey${currentChatMsgsList.length - 1}"]`
          )[0]
        ) {
          if (
            userStatus == "admin"
            //  && currentChatType == "chanell"
          ) {
            if (
              (document
                .querySelectorAll(
                  `[data-msgkey="data-msgkey${currentChatMsgsList.length - 2}"]`
                )[0]
                .getBoundingClientRect().bottom /
                vh) *
                100 <=
              87
            ) {
              setTimeout(() => {
                ;(
                  document.querySelectorAll(
                    `[data-msgkey="data-msgkey${currentChatMsgsList.length}"]`
                  )[0] as HTMLElement
                )?.scrollIntoView({
                  block: "end",
                  inline: "nearest",
                  behavior: "smooth",
                })
              }, 500)
            }
          }
          if (
            userStatus == "user"
            //  && currentChatType == "chanell"
          ) {
            if (
              (document
                .querySelectorAll(
                  `[data-msgkey="data-msgkey${currentChatMsgsList.length - 2}"]`
                )[0]
                .getBoundingClientRect().bottom /
                vh) *
                100 <=
              97
            ) {
              setTimeout(() => {
                ;(
                  document.querySelectorAll(
                    `[data-msgkey="data-msgkey${currentChatMsgsList.length}"]`
                  )[0] as HTMLElement
                )?.scrollIntoView({
                  block: "end",
                  inline: "nearest",
                  behavior: "smooth",
                })
              }, 500)
            }
          }
        }
      }
    }
  }

  useEffect(() => {
    document.getElementById("userInterfaceChatMainInputTextInputEdit")?.focus()
  }, [currentEditingState])
  useEffect(() => {
    if (notrealauthtoken) {
      ;(async function doUseEffectFunc(notrealauthtoken: any) {
        setAuth_token(notrealauthtoken)
        await findUserChats(notrealauthtoken)
        await doConnect()
      })(notrealauthtoken)
      // Check permissions
      navigator.permissions
        .query({ name: "microphone" as PermissionName })
        .then(function (queryResult) {
          handlePermissionState(queryResult.state)
          queryResult.onchange = function (onChangeResult) {
            if (onChangeResult.target) {
              handlePermissionState(
                (onChangeResult.target as PermissionStatus).state
              )
            }
          }
        })
    } else {
      alert("Login to proceed")
      navigate("/")
    }
  }, [])
  useEffect(() => {
    ;(async function () {
      await checkDeletedStuff()
    })()
  }, [allChatsList])

  const createChanell = async () => {
    let secure_url
    if (chanellImg != null) {
      let formData = new FormData()
      formData.append("file", chanellImg)
      formData.append("upload_preset", "vbght5om")
      let url = new URL(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`
      )
      await fetch(url, {
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
        let oldAllChatList = [...allChatsList]
        oldAllChatList.unshift(resText[1])
        setAllChatsList(oldAllChatList)
        // setChanellsList(kjkjkjk)
        // arrange chats here
        // arrange chats here
        // setOpenedChat({ type: "chanellsList", findname: resText[1] })
        // setMainPageInput("chanellsList", resText[1])
      }
    })
  }
  async function scrollOnFunc() {
    let vw = window.innerWidth
    let vh = window.innerHeight
    async function insideFunc(theTop: string) {
      let meelems = document.querySelectorAll('[data-notseen="notseen"]')
      let prevLength = meelems.length
      for (let i = 0; i < meelems.length; i++) {
        let rect = meelems[i].getBoundingClientRect()
        if ((rect.top / vh) * 100 <= Number(theTop)) {
          meelems[i].removeAttribute("data-notseen")
          let lastmsgArr = document.querySelectorAll(
            '[data-lastmsg="thelastMessage"]'
          )
          if (lastmsgArr.length) {
            lastmsgArr[0].removeAttribute("data-lastmsg")
          } else {
          }
          meelems[i].setAttribute("data-lastmsg", "thelastMessage")
        }
      }
      meelems = document.querySelectorAll('[data-notseen="notseen"]')
      let newLength = meelems.length
      if (prevLength != newLength) {
        if (meelems.length < currentNotSeen) {
          if (currentChatMsgsList) {
            let msg = {
              action: "lastSeen",
              type: currentChatType,
              findname: currentChatFindname,
              lastSeenMsg: String(currentChatMsgsList.length - meelems.length),
            }
            ws?.send(JSON.stringify(msg))
            if (allChatsListInUser) {
              let newAll = { ...allChatsListInUser }
              if (newAll) {
                if (currentChatType === "chanell") {
                  if (newAll.chanellsList) {
                    for (let i = 0; i < newAll.chanellsList.length; i++) {
                      if (
                        newAll.chanellsList[i].findname == currentChatFindname
                      ) {
                        newAll.chanellsList[i].lastSeenMsg = String(
                          currentChatMsgsList.length - meelems.length
                        )
                      }
                    }
                    setAllChatsListInUser(newAll)
                  }
                }
                if (currentChatType === "chat") {
                  if (newAll.chatsList) {
                    for (let i = 0; i < newAll.chatsList.length; i++) {
                      if (newAll.chatsList[i].findname == currentChatFindname) {
                        newAll.chatsList[i].lastSeenMsg = String(
                          currentChatMsgsList.length - meelems.length
                        )
                      }
                    }
                    setAllChatsListInUser(newAll)
                  }
                }
              }
            }
          }
        }
      }
    }
    if (userStatus == "admin") {
      let theTop = "91"
      insideFunc(theTop)
    }
    if (userStatus == "user") {
      let theTop = "98"
      insideFunc(theTop)
    }
    async function pinnedMsgScroll(theBott: string) {
      if (useScroll) {
        mainLoop: for (
          let index = 0;
          index < currentChatPinnedList.length;
          index++
        ) {
          for (
            let chatIndex = 0;
            chatIndex < currentChatMsgsList.length;
            chatIndex++
          ) {
            if (
              currentChatPinnedList[index].time ===
              currentChatMsgsList[chatIndex].time
            ) {
              if (
                Number(
                  (
                    document.querySelectorAll(
                      `[data-msgkey="data-msgkey${chatIndex}"]`
                    )[0] as HTMLDivElement
                  ).getBoundingClientRect().top
                ) > Number(theBott)
              ) {
                // if (currentPinnedMsgNumber === 0) {
                //   if (!index) {
                //     setCurrentPinnedMsgNumber(index - 1)
                //   }
                // } else {
                if (index !== 0) {
                  setCurrentPinnedMsgNumber(index - 1)
                }
                // }
                break mainLoop
              }
            }
          }
        }
      }
    }
    if (userStatus == "admin") {
      let theBott = "883"
      pinnedMsgScroll(theBott)
    }
    if (userStatus == "user") {
      let theBott = "962"
      pinnedMsgScroll(theBott)
    }
    // if greater then theBott
    // console.log(
    //   (
    //     document.querySelectorAll(
    //       `[data-msgkey="data-msgkey${35}"]`
    //     )[0] as HTMLDivElement
    //   ).getBoundingClientRect().top
    // )
    // currentChatPinnedList[currentPinnedMsgNumber - 1]
  }

  async function onImageChooseForInput(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const myTarget = event.target as HTMLInputElement
    if (event.target.files?.length) {
      if (event.target.files[0].type.split("/")[0] == "image") {
        setInputImgType("image")
        setInputImg(event.target.files[0])
        setInputImgUrl(URL.createObjectURL(event.target.files[0]))
      } else {
        setInputImg(event.target.files[0])
        const bytes = event.target.files[0].size
        const k = 1024
        const decimals = 2
        const dm = decimals < 0 ? 0 : decimals
        const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        setInputImgName(event.target.files[0].name)
        setInputImgSize(
          `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
        )
        setInputImgType(event.target.files[0].name.split(".")[-1])
      }
    } else {
      setInputImgUrl("")
      setInputImg(null)
    }
  }
  const findPeopleAndSetNewChat = async (
    findname: string,
    type: string,
    photoLink: string,
    username: string,
    phoneNumber: string,
    bio: string
  ) => {
    // await fetch(
    //   `${process.env.REACT_APP_SERVER_ENDPOINT}/users/CheckTokenAndReturnAllChats/${findname}/${type}`,
    //   {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       withCredentials: "true",
    //       "Access-Control-Allow-Origin": "*",
    //     },
    //   }
    // ).then(async (response) => {
    //   try {
    //     const resText = await response.json()
    //     if (resText[0] === "Back is good") {
    //       // alert("Succesfull request but bad responce")
    //       let userObj = resText[1]
    //       document.cookie = `botsList=${JSON.stringify(
    //         userObj.botsList
    //       )}; expires=Session; path=/;`
    //       document.cookie = `chatsList=${JSON.stringify(
    //         userObj.chatsList
    //       )}; expires=Session; path=/;`
    //       document.cookie = `groupsList=${JSON.stringify(
    //         userObj.groupsList
    //       )}; expires=Session; path=/;`
    //       document.cookie = `servicesList=${JSON.stringify(
    //         userObj.servicesList
    //       )}; expires=Session; path=/;`
    //       document.cookie = `chanellsList=${JSON.stringify(
    //         userObj.chanellsList
    //       )}; expires=Session; path=/;`
    //       setUserFindName(userObj.findname)
    //       setBotsList(userObj.botsList)
    //       setChatsList(userObj.chatsList)
    //       setGroupsList(userObj.groupsList)
    //       setServicesList(userObj.servicesList)
    //       setChanellsList(userObj.chanellsList)
    //       setAllChatsListInUser(resText[1])
    //       setAllChatsList(resText[2])
    //       console.log(resText[1])
    //       console.log(resText[2])
    //       return resText
    //       // [
    //       //   { botList: userObj.botsList },
    //       //   { chatsList: userObj.chatsList },
    //       //   { groupsList: userObj.groupsList },
    //       //   { servicesList: userObj.servicesList },
    //       //   { chanellsList: userObj.chanellsList },
    //       // ]
    //     }}catch(error){

    //     }})
    if (type == "chanell") {
    }
    if (type == "user") {
      setCurrentChatType("chat")
      setUserStatus("admin")
      setCanSendMsg(true)
      setCurrentChatMsgsList([])
      setCurrentChatMutted("no")
      setCurrentChatFindname(findname)
      setCurrentChatImgSrc(photoLink)
      setCurrentChatPhotoLink(photoLink)
      setCurrentChatName(username)
      setCurrentChatUserName(username)
      setCurrentChatBio(bio)
      setCurrentChatKnownPhone(phoneNumber)
      setSearchFocused(false)
      setChatSearchList([])
      let input = document.getElementById(
        "searchChatsInput"
      ) as HTMLInputElement
      if (input) {
        input.value = ""
      }
    }
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
            for (let l = 0; l < allChatsList[i].partisipants.length; l++) {
              if (allChatsList[i].partisipants[l].findname == userFindName) {
                if (allChatsList[i].partisipants[l].admin == "yes") {
                  setUserStatus("admin")
                  setCanSendMsg(true)
                } else {
                  setUserStatus("user")
                  setCanSendMsg(false)
                }
              }
            }
            if (allChatsListInUser && allChatsListInUser.chanellsList) {
              for (
                let index = 0;
                index < allChatsListInUser.chanellsList.length;
                index++
              ) {
                if (
                  allChatsListInUser.chanellsList[index].findname == findname
                ) {
                  setCurrentChatMutted(
                    allChatsListInUser.chanellsList[index].muted
                  )
                  break
                }
              }
            }
            setCurrentChatFindname(allChatsList[i].findname)
            setCurrentChatImgSrc(allChatsList[i].photoLink)
            setCurrentChatName(allChatsList[i].username)
            setCurrentChatSubs(allChatsList[i].partisipants.length)
            setCurrentChatDiscription(allChatsList[i].chanellDiscription)
            setCurrentChatLink(allChatsList[i].link)
            if (typeof allChatsList[i].messages === "undefined") {
              setCurrentChatMsgsList([])
              setCurrentChatPinnedList([])
              setCurrentPinnedMsgNumber(0)
            } else {
              setCurrentChatMsgsList(allChatsList[i].messages)
              let list: {
                time: any
                comentary: any
                photoLink: any
                index: number
              }[] = []
              let number = 0
              allChatsList[i].messages.forEach((message: any) => {
                if (message.pinned) {
                  list.push({
                    time: message.time,
                    comentary: message.comentary,
                    photoLink: message.img,
                    index: number,
                  })
                  number++
                }
              })
              setCurrentChatPinnedList(list)
              setCurrentPinnedMsgNumber(number ? number - 1 : number)
            }

            // setCurrentChatMsgsList((prevItems) => [
            //   allChatsList[i].list[l].messages,
            // ])
          }
        }
      }
    }
    if (type == "chat") {
      setCurrentChatType("chat")
      for (let i = 0; i < allChatsList.length; i++) {
        if (allChatsList[i].group != "chat") {
          continue
        } else {
          if (allChatsList[i].findname != findname) {
            continue
          } else {
            for (let l = 0; l < allChatsList[i].partisipants.length; l++) {
              if (allChatsList[i].partisipants[l].findname == userFindName) {
                if (allChatsList[i].partisipants[l].admin == "yes") {
                  setUserStatus("admin")
                  setCanSendMsg(true)
                } else {
                  setUserStatus("user")
                  setCanSendMsg(false)
                }
              }
            }

            if (allChatsListInUser && allChatsListInUser.chatsList) {
              for (
                let index = 0;
                index < allChatsListInUser.chatsList.length;
                index++
              ) {
                if (allChatsListInUser.chatsList[index].findname == findname) {
                  setCurrentChatMutted(
                    allChatsListInUser.chatsList[index].muted
                  )
                  setCurrentChatImgSrc(
                    allChatsListInUser.chatsList[index].photoLink
                  )
                  setCurrentChatName(
                    allChatsListInUser.chatsList[index].username
                  )
                  break
                }
              }
            }
            setCurrentChatFindname(allChatsList[i].findname)

            if (typeof allChatsList[i].messages === "undefined") {
              setCurrentChatMsgsList([])
              setCurrentChatPinnedList([])
              setCurrentPinnedMsgNumber(0)
            } else {
              setCurrentChatMsgsList(allChatsList[i].messages)
              let list: {
                time: any
                comentary: any
                photoLink: any
                index: number
              }[] = []
              let number = 0
              allChatsList[i].messages.forEach((message: any) => {
                if (message.pinned) {
                  list.push({
                    time: message.time,
                    comentary: message.comentary,
                    photoLink: message.img,
                    index: number,
                  })
                  number++
                }
              })
              setCurrentChatPinnedList(list)
              setCurrentPinnedMsgNumber(number ? number - 1 : number)
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
              setCurrentChatPinnedList([])
              setCurrentPinnedMsgNumber(0)
            } else {
              setCurrentChatMsgsList(allChatsList[i].messages)
              let list: {
                time: any
                comentary: any
                photoLink: any
                index: number
              }[] = []
              let number = 0
              allChatsList[i].messages.forEach((message: any) => {
                if (message.pinned) {
                  list.push({
                    time: message.time,
                    comentary: message.comentary,
                    photoLink: message.img,
                    index: number,
                  })
                  number++
                }
              })
              setCurrentChatPinnedList(list)
              setCurrentPinnedMsgNumber(number ? number - 1 : number)
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
          document.cookie = `botsList=${JSON.stringify(
            userObj.botsList
          )}; expires=Session; path=/;`
          document.cookie = `chatsList=${JSON.stringify(
            userObj.chatsList
          )}; expires=Session; path=/;`
          document.cookie = `groupsList=${JSON.stringify(
            userObj.groupsList
          )}; expires=Session; path=/;`
          document.cookie = `servicesList=${JSON.stringify(
            userObj.servicesList
          )}; expires=Session; path=/;`
          document.cookie = `chanellsList=${JSON.stringify(
            userObj.chanellsList
          )}; expires=Session; path=/;`
          setUserFindName(userObj.findname)
          setBotsList(userObj.botsList)
          setChatsList(userObj.chatsList)
          setGroupsList(userObj.groupsList)
          setServicesList(userObj.servicesList)
          setChanellsList(userObj.chanellsList)
          setAllChatsListInUser(resText[1])
          setAllChatsList(resText[2])
          setOnlineList(resText[3])
          console.log(resText[1])
          console.log(resText[2])
          console.log(resText[3])
          return resText
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
      setShowChanellImg(!showChanellImg)
    } else {
      setChanellImgUrl("")
      setChanellImg(null)
      setShowChanellImg(false)
    }
  }
  async function createMsgObjectForFiles() {
    let secure_url
    if (inputImg != null) {
      let formData = new FormData()
      formData.append("file", inputImg)
      formData.append("upload_preset", "vbght5om")
      let url = new URL(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`
      )
      await fetch(url, {
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
    let msg: addMsgType
    if (secure_url) {
      msg = {
        type: "add",
        img: secure_url,
        comentary: currentChatComentary,
        emotions: [],
        time: String(new Date().getTime()),
        pinned: false,
        author: userFindName,
      }
    } else {
      msg = {
        type: "add",
        img: "",
        comentary: currentChatComentary,
        emotions: [],
        time: String(new Date().getTime()),
        pinned: false,
        author: userFindName,
      }
    }
    return msg
  }
  async function sendMsgWithFile() {
    let secure_url
    if (inputImg != null) {
      let formData = new FormData()
      formData.append("file", inputImg)
      formData.append("upload_preset", "vbght5om")
      let url = new URL(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`
      )
      await fetch(url, {
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
    let msg
    if (secure_url) {
      msg = {
        type: currentChatType,
        findname: currentChatFindname,
        newMessage: {
          img: secure_url,
          comentary: currentChatComentary,
          emotions: [],
        },
      }
    } else {
      msg = {
        type: currentChatType,
        findname: currentChatFindname,
        newMessage: {
          img: "",
          comentary: currentChatComentary,
          emotions: [],
        },
      }
    }

    await (async () => {
      ws?.send(JSON.stringify(msg))
    })()
    checkIfAtBottom()
    // ДОРОБИТИ
    setCurrentChatComentary("")
    if (document.getElementById("fileUploadCommentaryInput")) {
      let aaa = document.getElementById(
        "fileUploadCommentaryInput"
      ) as HTMLInputElement
      aaa.value = ""
    }
  }
  // document.onkeydown = async function (event) {
  //   let evtobj = window.event ? event : event
  //   if (
  //     (evtobj.key == "V" && evtobj.ctrlKey) ||
  //     (evtobj.key == "v" && evtobj.ctrlKey)
  //   ) {
  //     // let mediaStream
  //     // try {
  //     //   const constraints = { audio: true, video: true }
  //     //   mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
  //     //   console.log(mediaStream)
  //     // } catch (ex) {
  //     //   if (ex instanceof DOMException) {
  //     //     if (ex.name === "NotAllowedError") {
  //     //       // handle permission denied
  //     //     } else if (ex.name === "NotFoundError") {
  //     //       // handle media not found
  //     //     } else {
  //     //       // handle unexpected DOMException
  //     //     }
  //     //   } else {
  //     //     // handle unexpected error
  //     //   }
  //     // }

  //     // if (!mediaStream) {
  //     //   // handle no stream
  //     // } else {
  //     //   // do something with stream
  //     // }
  //     if (chatSelected && canSendMsg) {
  //       try {
  //         // let copiedThing = await navigator.clipboard.readText()
  //         // console.log(JSON.stringify(await navigator.clipboard.read()))
  //       } catch (error) {
  //         setMediaPermissionNotification(true)
  //         // await browser.permissions.request(permissionsToRequest)
  //       }
  //     }
  //     // if(SOME CLIPBOARD API FOR IMAGE IN CLIP){

  //     // }
  //   }
  // }

  async function chatGlobalSearch(value: string) {
    let result: any = []
    return await fetch(
      `${process.env.REACT_APP_SERVER_ENDPOINT}/users/GlobalSearch/${value}`,
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
      let withoutUser: any = []
      resText.forEach((element: any) => {
        if (element.findname != userFindName) {
          withoutUser.push(element)
        }
      })
      return withoutUser
    })
    // result = [
    //   {
    //     findname: "silentalk",
    //     photoLink:
    //       "https://res.cloudinary.com/dy9emuyvs/image/upload/v1691776582/uddsi7lqdr2dw6xc23cv.png",
    //   },
    // ]
  }
  async function convertWebmToMp3(webmBlob: Blob): Promise<Blob> {
    const ffmpeg = new FFmpeg()
    await ffmpeg.load()

    const inputName = "input.webm"
    const outputName = "output.mp3"

    ffmpeg.writeFile(inputName, await fetchFile(URL.createObjectURL(webmBlob)))

    await ffmpeg.exec(["-i", inputName, outputName])

    // const outputData = ffmpeg.FS('readFile', outputName);
    const data = await ffmpeg.readFile(outputName)
    const outputBlob = new Blob([data], { type: "audio/mp3" })

    return outputBlob
  }

  document.onpaste = async function (event) {
    if (chatSelected && canSendMsg) {
      let clipboardData = event.clipboardData ? event.clipboardData : undefined
      let items = clipboardData?.items
      // console.log(JSON.stringify(items)) // might give you mime types
      if (items) {
        for (let index = 0; index < items.length; index++) {
          let item = items[index]
          if (item.kind === "file") {
            let blob = item.getAsFile()
            if (blob) {
              if (blob.type.split("/")[0] == "image") {
                setInputImgType("image")
                setInputImg(blob)
                setInputImgUrl(URL.createObjectURL(blob))
                setShowInputImg(!showInputImg)
                setDisplaySend(!displaySend)
                setTimeout(() => {
                  document.getElementById("fileUploadCommentaryInput")?.focus()
                }, 500)
              } else {
                document.getElementById("fileUploadCommentaryInput")?.focus()
                setInputImg(blob)
                const bytes = blob.size
                const k = 1024
                const decimals = 2
                const dm = decimals < 0 ? 0 : decimals
                const sizes = [
                  "Bytes",
                  "KB",
                  "MB",
                  "GB",
                  "TB",
                  "PB",
                  "EB",
                  "ZB",
                  "YB",
                ]
                const i = Math.floor(Math.log(bytes) / Math.log(k))
                setInputImgName(blob.name)
                setInputImgSize(
                  `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${
                    sizes[i]
                  }`
                )
                setInputImgType(blob.name.split(".")[-1])
                setShowInputImg(!showInputImg)
                setDisplaySend(!displaySend)
                setTimeout(() => {
                  document.getElementById("fileUploadCommentaryInput")?.focus()
                }, 500)
              }

              // let reader = new FileReader()
              // reader.onload = function (event) {
              //   // console.log(event.target?.result) // data url!
              // }
              // reader.readAsDataURL(blob)
            } else {
              setInputImgUrl("")
              setInputImg(null)
            }
          }
        }
      }
    }
  }
  // const AudioVisualizer = (props: any) => {
  //   const audioRef: any = useRef()
  //   console.log(props.link)
  //   useEffect(() => {
  //     if (audioRef.current) {
  //       let audioTrack = WaveSurfer.create({
  //         container: audioRef.current,
  //         height: 80,
  //         progressColor: "#FE6E00",
  //         responsive: true,
  //         waveColor: "#C4C4C4",
  //         cursorColor: "transparent",
  //         barWidth: 3,
  //         barRadius: 3,
  //         barGap: 2,
  //         barMinHeight: 1,
  //         cursorWidth: 1,
  //       })
  //       audioTrack.load(props.link)
  //     }
  //   })

  //   return <div id="audioProgress" ref={audioRef}></div>
  // }

  // const MyVisual = (props: any) => {
  //   const mycanvas: any = useRef()
  //   useEffect(() => {
  //     const canvas = mycanvas.current
  //     const context = canvas.getContext("2d")
  //     context.fillStyle = "black"
  //     let arrayOfData: any[] = [
  //       [0, 50, 4, -8, 4],
  //       [0, 50, 4, -8, 4],
  //       [0, 50, 4, -8, 4],
  //       [0, 50, 4, -8, 4],
  //       [0, 50, 4, -8, 4],
  //     ]
  //     // props.data
  //     arrayOfData.forEach((rectangle: any) => {
  //       context.beginPath()
  //       context.fillStyle = "rgb(92, 168, 83)"
  //       context.roundRect(
  //         rectangle[0],
  //         rectangle[1],
  //         rectangle[2],
  //         rectangle[3],
  //         rectangle[4]
  //       )
  //       context.fill()
  //     }, [])
  //   })
  //   return <canvas ref={mycanvas} width="410" height="50"></canvas>
  // }
  const b64toBlob = (b64Data: any, contentType = "", sliceSize = 512) => {
    const byteCharacters = atob(b64Data)
    const byteArrays = []

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize)

      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }

      const byteArray = new Uint8Array(byteNumbers)
      byteArrays.push(byteArray)
    }

    const blob = new Blob(byteArrays, { type: contentType })
    return blob
  }

  return (
    <>
      <div
        onClick={() => {
          if (smileBarClick) {
            setSmileBarMouseEnter(false)
            setSmileBarClick(false)
          }
        }}
        id="userInterfaceBorder"
        // onMouseMove={(event) => {
        //   if (msgMenuListener) {
        //     let vw = window.innerWidth + 420
        //     let vh = window.innerHeight + 50
        //     let x = (event.pageX / vw) * 100
        //     let y = (event.pageY / vh) * 100
        //     if (msgMenuCoords.left && msgMenuCoords.top) {
        //       if (Math.abs(Number(msgMenuCoords.left) - x) >= 20) {
        //         setMsgMenu(false)
        //         setMsgMenuTargets([])
        //         setMsgMenuListener(false)
        //       }
        //       if (Math.abs(Number(msgMenuCoords.top) - y) >= 22) {
        //         setMsgMenu(false)
        //         setMsgMenuTargets([])
        //         setMsgMenuListener(false)
        //       }
        //     }
        //   }
        // }}
      >
        {/* {currentsomespace
          ? currentsomespace.map((audio: any) => {
              return <audio src={URL.createObjectURL(audio)} controls></audio>
            })
          : undefined} */}
        {mediaPermissionNotification ? (
          <div id="mediaPermissionNotification">
            <img src={"./icons8-arrow-up-50.png"} alt="" />
            Allow access to clipboard to paste images
            <img
              src={"./icons8-close-50.png"}
              alt=""
              onClick={() => {
                setMediaPermissionNotification(false)
              }}
            />
          </div>
        ) : undefined}
        {/* <div id="userInterfaceMain"> */}
        <div
          id="userInterfaceChatsColumn"
          className={`${onScreen === "chatsList" ? "" : "leftChatLeft"}`}
          // style={
          //   onScreen === "chatsList"
          //     ? {
          //         transform: "translate(0, 0)",
          //       }
          //     : {
          //         transform: "translate(-100%, 0)",
          //       }
          // }
        >
          <div id="bigInterfaceColumn">
            <div
              className={`regularColumn ${
                userSettingsEdit
                  ? "toleft"
                  : createNewChanell ||
                    createNewGroup ||
                    createNewPrivateChat ||
                    userSettings
                  ? "toleft"
                  : pageJustLoaded
                  ? "none"
                  : "back"
              } `}
            >
              {userMenu ? (
                <div
                  id="userMenu"
                  onClick={(e) => {
                    e.stopPropagation()
                    setUserMenu(false)
                  }}
                >
                  <div id="userMenuMenu">
                    <div id="userMenuMenuDiv">
                      <img src="./icons8-close-50.png" alt="" />
                      <p>Saved Messages</p>
                    </div>
                    <div id="userMenuMenuDiv">
                      <img src="./icons8-close-50.png" alt="" />
                      <p>My Stories</p>
                    </div>
                    <div id="userMenuMenuDiv">
                      <img src="./icons8-close-50.png" alt="" />
                      <p>Contacts</p>
                    </div>
                    <div
                      id="userMenuMenuDiv"
                      onClick={() => {
                        setUserMenu(false)
                        setUserSettings(true)
                      }}
                    >
                      <img src="./icons8-close-50.png" alt="" />
                      <p>Settings</p>
                    </div>
                    <div id="userMenuMenuDiv">
                      <img src="./icons8-close-50.png" alt="" />
                      <p>Dark Mode</p>
                    </div>
                    <div id="userMenuMenuDiv">
                      <img src="./icons8-close-50.png" alt="" />
                      <p>Animations</p>
                    </div>
                    <div id="userMenuMenuDiv">
                      <img src="./icons8-close-50.png" alt="" />
                      <p>Telegram Features</p>
                    </div>
                    <div id="userMenuMenuDiv">
                      <img src="./icons8-close-50.png" alt="" />
                      <p>Report Bug</p>
                    </div>
                    <div id="userMenuMenuDiv">
                      <img src="./icons8-close-50.png" alt="" />
                      <p>Switch to A version</p>
                    </div>
                    <div id="userMenuMenuFooter">SilentTalk WebK 1.0.0</div>
                  </div>
                </div>
              ) : undefined}

              <div id="userInterfaceChatsColumnHead">
                <div id="userInterfaceChatsColumnHeadSettings">
                  {searchFocused ? (
                    <img
                      src="./icons8-close-50.png"
                      alt=""
                      onClick={() => {
                        setSearchFocused(false)
                        setChatSearchList([])
                        let input = document.getElementById(
                          "searchChatsInput"
                        ) as HTMLInputElement
                        if (input) {
                          input.value = ""
                        }
                      }}
                    />
                  ) : (
                    <img
                      src="./menu.png"
                      alt=""
                      onClick={() => {
                        setUserMenu(true)
                      }}
                    />
                  )}
                </div>
                <div
                  id="userInterfaceChatsColumnHeadSearch"
                  onFocus={() => {
                    setSearchFocused(true)
                    if (!searchFocused) {
                      setSelectedSearchMegaOption("Chats")
                    }
                  }}
                >
                  <img src="./search.png" alt="" />
                  <input
                    id="searchChatsInput"
                    type="text"
                    placeholder="Search"
                    onChange={async (event) => {
                      let target = event.target as HTMLInputElement
                      let value = target.value
                      if (!value) {
                        setChatSearchList([])
                        return
                      }
                      let allArray: any = []
                      let theNamesList:
                        | {
                            array: Array<any>
                            target: "Chats"
                            changed: Boolean
                          }
                        | {
                            array: Array<any>
                            target: "Chats"
                            changed: boolean
                          } = { array: [], target: "Chats", changed: false }
                      for (
                        let index = 0;
                        index < allChatsList.length;
                        index++
                      ) {
                        const element = allChatsList[index]
                        if (element.findname) {
                          if (element.findname.includes(value)) {
                            if (element.partisipants) {
                              theNamesList.array.push({
                                photoLink: element.photoLink,
                                findname: element.findname,
                                partisipants: element.partisipants,
                                username: element.username,
                              })
                              continue
                            }
                            // if (condition) {
                            theNamesList.array.push({
                              photoLink: element.photoLink,
                              findname: element.findname,
                              username: element.username,
                            })
                            continue
                            // }
                          }
                        }
                        if (element.username) {
                          if (element.username.includes(value)) {
                            theNamesList.array.push({
                              photoLink: element.photoLink,
                              findname: element.findname,
                              username: element.username,
                              // partisipants: element.partisipants,
                            })
                            continue
                          }
                          // if (condition) {
                          // theNamesList.array.push({
                          //   photoLink: element.photoLink,
                          //   findname: element.findname,
                          // })
                          // console.log("5")
                          // console.log(theNamesList.array)
                          // continue
                          // }
                        }
                      }
                      // element.messages.forEach(message => {
                      // });
                      if (!theNamesList.array.length) {
                        theNamesList.array = await chatGlobalSearch(value)
                        theNamesList.changed = true
                        allArray.push(theNamesList)
                        setChatSearchList(allArray)
                      } else {
                        allArray.push(theNamesList)
                        setChatSearchList(allArray)
                      }
                    }}
                  />
                </div>
              </div>
              {searchFocused ? (
                <div
                  className="userInterfaceChatsColumnChatsSearch"
                  style={searchFocused ? { zIndex: "5" } : { display: "flex" }}
                >
                  {chatSearchList.length ? (
                    <div id="userInterfaceChatsColumnChatsSearchAfterSearch">
                      {/* <div id="userInterfaceChatsColumnChatsSearchAfterSearchTop"></div> */}
                      <div id="userInterfaceChatsColumnChatsSearchOptions">
                        {chatSearchMegaList.map((option) => {
                          return (
                            <div
                              id="userInterfaceChatsColumnChatsSearchOptionsOption"
                              style={
                                option == selectedSearchMegaOption
                                  ? {
                                      color: "#3390ec",
                                      borderBottom: "#3390ec solid 2px",
                                    }
                                  : { display: "flex" }
                              }
                              onClick={() => {
                                setPrevSelectedSearchMegaOption(
                                  selectedSearchMegaOption
                                )
                                setSelectedSearchMegaOption(option)
                              }}
                            >
                              {option}
                            </div>
                          )
                        })}
                      </div>

                      <div id="userInterfaceChatsColumnChatsSearchAfterSearchResultsDiv">
                        {chatSearchMegaList.map((option) => {
                          return (
                            <div
                              className={`userInterfaceChatsColumnChatsSearchAfterSearchResults ${
                                option === selectedSearchMegaOption
                                  ? "selectedSearch"
                                  : chatSearchMegaList.indexOf(option) <
                                    chatSearchMegaList.indexOf(
                                      selectedSearchMegaOption
                                    )
                                  ? "toLeftSearch"
                                  : "toRightSearch"
                              } ${
                                Math.abs(
                                  chatSearchMegaList.indexOf(
                                    prevSelectedSearchMegaOption
                                  ) -
                                    chatSearchMegaList.indexOf(
                                      selectedSearchMegaOption
                                    )
                                ) > 1
                                  ? (chatSearchMegaList.indexOf(option) >
                                      chatSearchMegaList.indexOf(
                                        prevSelectedSearchMegaOption
                                      ) &&
                                      chatSearchMegaList.indexOf(option) <
                                        chatSearchMegaList.indexOf(
                                          selectedSearchMegaOption
                                        )) ||
                                    (chatSearchMegaList.indexOf(option) <
                                      chatSearchMegaList.indexOf(
                                        prevSelectedSearchMegaOption
                                      ) &&
                                      chatSearchMegaList.indexOf(option) >
                                        chatSearchMegaList.indexOf(
                                          selectedSearchMegaOption
                                        ))
                                    ? "instaOpacity"
                                    : ""
                                  : ""
                              }`}
                            >
                              {chatSearchList.map((oneList) => {
                                if (option === "Chats") {
                                  if (oneList.target === "Chats") {
                                    if (!oneList.changed) {
                                      return (
                                        <div>
                                          {oneList.array.length ? (
                                            <div id="userInterfaceChatsColumnChatsSearchAfterSearchResultsName">
                                              Chats
                                            </div>
                                          ) : undefined}

                                          {oneList.array.map(
                                            (oneElement: any) => {
                                              return (
                                                <div id="ChatsSearchAfterSearchResultsResult">
                                                  <img
                                                    src={
                                                      oneElement.photoLink
                                                        ? oneElement.photoLink
                                                        : "./defaultUser.png"
                                                    }
                                                    alt=""
                                                  />
                                                  <div id="ChatsSearchAfterSearchResultsResultColumn">
                                                    <div id="ChatsSearchAfterSearchResultsResultTop">
                                                      {oneElement.username}
                                                    </div>
                                                    <div id="ChatsSearchAfterSearchResultsResultBot">
                                                      {oneElement.findname}
                                                    </div>
                                                  </div>
                                                </div>
                                              )
                                            }
                                          )}
                                        </div>
                                      )
                                    } else {
                                      return (
                                        <div>
                                          {oneList.array.length ? (
                                            <div id="userInterfaceChatsColumnChatsSearchAfterSearchResultsName">
                                              Global Search
                                            </div>
                                          ) : undefined}
                                          {oneList.array.map(
                                            (oneElement: any) => {
                                              return (
                                                <div
                                                  id="ChatsSearchAfterSearchResultsResult"
                                                  onClick={() => {
                                                    findPeopleAndSetNewChat(
                                                      oneElement.findname,
                                                      oneElement.type,
                                                      oneElement.photoLink,
                                                      oneElement.username,
                                                      oneElement.phoneNumber,
                                                      oneElement.bio
                                                    )
                                                  }}
                                                >
                                                  <img
                                                    src={oneElement.photoLink}
                                                    alt=""
                                                  />
                                                  <div id="ChatsSearchAfterSearchResultsResultColumn">
                                                    <div id="ChatsSearchAfterSearchResultsResultTop">
                                                      {oneElement.username}
                                                    </div>
                                                    <div id="ChatsSearchAfterSearchResultsResultBot">
                                                      {oneElement.findname}{" "}
                                                      {oneElement.subscribers
                                                        ? oneElement.subscribers
                                                        : undefined}
                                                    </div>
                                                  </div>
                                                </div>
                                              )
                                            }
                                          )}
                                        </div>
                                      )
                                    }
                                  } else {
                                    if (oneList.target === "Messages") {
                                      return (
                                        <div
                                          className={
                                            selectedSearchMegaOption ==
                                            oneList.target
                                              ? "back"
                                              : "toleftSearch"
                                          }
                                        >
                                          {oneList.array.length ? (
                                            <div id="userInterfaceChatsColumnChatsSearchAfterSearchResultsName">
                                              Messages
                                            </div>
                                          ) : undefined}

                                          {oneList.array.map(
                                            (oneElement: any) => {
                                              return (
                                                <div id="ChatsSearchAfterSearchResultsResult">
                                                  <img
                                                    src={oneElement.photoLink}
                                                    alt=""
                                                  />
                                                  <div id="ChatsSearchAfterSearchResultsResultColumn">
                                                    <div id="ChatsSearchAfterSearchResultsResultTop">
                                                      {oneElement.findname}
                                                    </div>
                                                    <div id="ChatsSearchAfterSearchResultsResultBot">
                                                      {oneElement.findname}
                                                    </div>
                                                  </div>
                                                </div>
                                              )
                                            }
                                          )}
                                        </div>
                                      )
                                    }
                                  }
                                }
                                if (option === "Media") {
                                  return <div>Hi media</div>
                                }
                                if (option === "Links") {
                                  return <div>Hi Links</div>
                                }
                                if (option === "Files") {
                                  return <div>Hi Files</div>
                                }
                                if (option === "Music") {
                                  return <div>Hi Music</div>
                                }
                                if (option === "Voices") {
                                  return <div>Hi Voices</div>
                                }
                              })}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <>
                      <div id="userInterfaceChatsColumnChatsSearchOptions">
                        {chatSearchMegaList.map((option) => {
                          return (
                            <div
                              id="userInterfaceChatsColumnChatsSearchOptionsOption"
                              style={
                                option.name == selectedSearchMegaOption
                                  ? {
                                      color: "#3390ec",
                                      borderBottom: "#3390ec solid 2px",
                                    }
                                  : { display: "flex" }
                              }
                              onClick={() => {
                                setSelectedSearchMegaOption(option.name)
                              }}
                            >
                              {option.name}
                            </div>
                          )
                        })}
                      </div>
                      {selectedSearchMegaOption === "Chats" ? (
                        <>
                          <div id="userInterfaceChatsColumnChatsSearchContacts">
                            {listOfMajorContacts.map((contact) => {
                              return (
                                <div id="userInterfaceChatsColumnChatsSearchContactsContact">
                                  <img src={contact.src} alt="" />
                                  {contact.name}
                                </div>
                              )
                            })}
                          </div>
                          <div id="userInterfaceChatsColumnChatsSearchRecent">
                            <p>Recent</p>{" "}
                            <img src="./icons8-close-50.png" alt="" />
                          </div>
                          <div id="userInterfaceChatsColumnChatsSearchRecentResults">
                            {listOfRecentContacts.map((contact) => {
                              return (
                                <div id="userInterfaceChatsColumnChatsSearchContactsContact">
                                  <img src={contact.src} alt="" />
                                  {contact.name}
                                </div>
                              )
                            })}
                          </div>
                        </>
                      ) : selectedSearchMegaOption === "Media" ? (
                        <div></div>
                      ) : selectedSearchMegaOption === "Links" ? (
                        <div></div>
                      ) : selectedSearchMegaOption === "Files" ? (
                        <div></div>
                      ) : selectedSearchMegaOption === "Music" ? (
                        <div></div>
                      ) : selectedSearchMegaOption === "Voice" ? (
                        <div></div>
                      ) : undefined}
                    </>
                  )}
                </div>
              ) : undefined}

              <div className={`userInterfaceChatsColumnChats`}>
                {allChatsList != undefined
                  ? allChatsList.map((oneChat: any) => {
                      return oneChat.group == "service" ? (
                        <>
                          {allChatsListInUser
                            ? allChatsListInUser.servicesList
                              ? allChatsListInUser.servicesList.map(
                                  (oneService: any) => {
                                    return oneChat.findname ==
                                      oneService.findname ? (
                                      <div
                                        // key={key++}
                                        className="userInterfaceChatsColumnOneChat"
                                        style={
                                          openedChat.findname ==
                                          oneChat.findname
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
                                          setOnScreen("chat")
                                          setChatSelected(true)
                                          setOpenedChat({
                                            type: "service",
                                            findname: oneChat.findname,
                                          })
                                          setMainPageInput(
                                            "service",
                                            oneChat.findname
                                          )
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
                                                    Number(
                                                      oneChat.lastUpdated
                                                    ) -
                                                      Number(
                                                        new Date().getTime()
                                                      )
                                                  ) <= 172800000
                                                ? `${new Date(
                                                    Number(oneChat.lastUpdated)
                                                  )
                                                    .toUTCString()
                                                    .slice(0, 3)}`
                                                : new Date().getFullYear() !=
                                                  new Date(
                                                    Number(oneChat.lastUpdated)
                                                  ).getFullYear()
                                                ? `${new Date(
                                                    Number(oneChat.lastUpdated)
                                                  ).toLocaleDateString(
                                                    "en-GB"
                                                  )}`
                                                : `${new Date(
                                                    Number(oneChat.lastUpdated)
                                                  )
                                                    .toString()
                                                    .slice(4, 10)}`}
                                            </div>
                                          </div>
                                          <div className="userInterfaceChatsColumnOneChatNotImgBotLine">
                                            <div
                                              className="userInterfaceChatsColumnOneChatNotImgLastMsg"
                                              style={
                                                openedChat.findname ==
                                                oneChat.findname
                                                  ? {
                                                      color: "white",
                                                    }
                                                  : {
                                                      color: "#7b7f83",
                                                    }
                                              }
                                              // style={
                                              //   oneChat.messages[-1]
                                              //     ? { color: "black" }
                                              //     : { color: "green" }
                                              // }
                                            >
                                              {oneChat.messages ? (
                                                oneChat.messages[
                                                  oneChat.messages.length - 1
                                                ] ? (
                                                  oneChat.messages[
                                                    oneChat.messages.length - 1
                                                  ].img ? (
                                                    <>
                                                      <img
                                                        src={
                                                          oneChat.messages[
                                                            oneChat.messages
                                                              .length - 1
                                                          ].img
                                                            ? oneChat.messages[
                                                                oneChat.messages
                                                                  .length - 1
                                                              ].img
                                                            : "./blank_photo.png"
                                                        }
                                                      />
                                                      Photo
                                                      {
                                                        oneChat.messages[
                                                          oneChat.messages
                                                            .length - 1
                                                        ].comentary
                                                      }
                                                    </>
                                                  ) : oneChat.messages[
                                                      oneChat.messages.length -
                                                        1
                                                    ].blob ? (
                                                    "Voice message"
                                                  ) : (
                                                    `${
                                                      oneChat.messages[
                                                        oneChat.messages
                                                          .length - 1
                                                      ].comentary
                                                    }`
                                                  )
                                                ) : (
                                                  "Created Succesfully"
                                                )
                                              ) : undefined}
                                            </div>
                                            <div className="userInterfaceChatsColumnOneChatNotImgPindOrMsgCount">
                                              {oneChat.messages ? (
                                                <div>
                                                  {oneChat.messages.length}
                                                </div>
                                              ) : oneService.pinned ? (
                                                <img
                                                  src={"./pinned.png"}
                                                  alt=""
                                                />
                                              ) : undefined}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : undefined
                                  }
                                )
                              : undefined
                            : undefined}
                        </>
                      ) : oneChat.group == "chanell" ? (
                        <>
                          {allChatsListInUser
                            ? allChatsListInUser.chanellsList
                              ? allChatsListInUser.chanellsList.map(
                                  (oneChanell: any) => {
                                    return oneChat.findname ==
                                      oneChanell.findname ? (
                                      <div
                                        // key={key++}
                                        className="userInterfaceChatsColumnOneChat"
                                        style={
                                          openedChat.findname ==
                                          oneChat.findname
                                            ? {
                                                backgroundColor: "#3390EC",
                                                color: "white",
                                              }
                                            : {
                                                backgroundColor: "transparent",
                                                color: "black",
                                              }
                                        }
                                        onClick={async () => {
                                          setOnScreen("chat")
                                          setChatSelected(true)
                                          async function bgbfbf() {
                                            setOpenedChat({
                                              type: "chanell",
                                              findname: oneChat.findname,
                                            })
                                            setMainPageInput(
                                              "chanell",
                                              oneChat.findname
                                            )
                                          }
                                          await bgbfbf()
                                          let meMsgDiv =
                                            document.getElementById(
                                              "userInterfaceChatMainMsgesColumn"
                                            )
                                          if (meMsgDiv) {
                                            let rectmsgDiv =
                                              meMsgDiv?.getBoundingClientRect()
                                            let meelem =
                                              document.querySelectorAll(
                                                '[data-lastmsg="thelastMessage"]'
                                              )[0]

                                            if (meelem) {
                                              // let rect =
                                              //   meelem.getBoundingClientRect()
                                              // let toLowDown =
                                              //   rect?.top - rectmsgDiv?.top
                                              // meMsgDiv.scrollTop = toLowDown
                                              meelem.scrollIntoView(false)
                                            }
                                          }
                                        }}
                                      >
                                        <div className="userInterfaceChatsColumnOneChatImg">
                                          <img src={oneChat.photoLink} alt="" />
                                        </div>
                                        <div className="userInterfaceChatsColumnOneChatNotImg">
                                          <div className="userInterfaceChatsColumnOneChatNotImgTopLine">
                                            <div className="userInterfaceChatsColumnOneChatNotImgName">
                                              {oneChat.username}
                                              {oneChanell.muted != "no" ? (
                                                <img
                                                  src="./muttedSpeaker.png"
                                                  alt=""
                                                />
                                              ) : undefined}
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
                                                    Number(
                                                      oneChat.lastUpdated
                                                    ) -
                                                      Number(
                                                        new Date().getTime()
                                                      )
                                                  ) <= 172800000
                                                ? `${new Date(
                                                    Number(oneChat.lastUpdated)
                                                  )
                                                    .toUTCString()
                                                    .slice(0, 3)}`
                                                : new Date().getFullYear() !=
                                                  new Date(
                                                    Number(oneChat.lastUpdated)
                                                  ).getFullYear()
                                                ? `${new Date(
                                                    Number(oneChat.lastUpdated)
                                                  ).toLocaleDateString(
                                                    "en-GB"
                                                  )}`
                                                : `${new Date(
                                                    Number(oneChat.lastUpdated)
                                                  )
                                                    .toString()
                                                    .slice(4, 10)}`}
                                            </div>
                                          </div>
                                          <div className="userInterfaceChatsColumnOneChatNotImgBotLine">
                                            <div
                                              className="userInterfaceChatsColumnOneChatNotImgLastMsg"
                                              style={
                                                openedChat.findname ==
                                                oneChat.findname
                                                  ? {
                                                      color: "white",
                                                    }
                                                  : {
                                                      color: "#7b7f83",
                                                    }
                                              }
                                              // style={
                                              //   oneChat.messages[-1]
                                              //     ? { color: "black" }
                                              //     : { color: "green" }
                                              // }
                                            >
                                              {oneChat.messages ? (
                                                oneChat.messages[
                                                  oneChat.messages.length - 1
                                                ] ? (
                                                  oneChat.messages[
                                                    oneChat.messages.length - 1
                                                  ].img ? (
                                                    <>
                                                      <img
                                                        src={
                                                          oneChat.messages[
                                                            oneChat.messages
                                                              .length - 1
                                                          ].img
                                                            ? oneChat.messages[
                                                                oneChat.messages
                                                                  .length - 1
                                                              ].img
                                                            : "./blank_photo.png"
                                                        }
                                                      />
                                                      Photo
                                                      {
                                                        oneChat.messages[
                                                          oneChat.messages
                                                            .length - 1
                                                        ].comentary
                                                      }
                                                    </>
                                                  ) : oneChat.messages[
                                                      oneChat.messages.length -
                                                        1
                                                    ].blob ? (
                                                    "Voice message"
                                                  ) : (
                                                    `${
                                                      oneChat.messages[
                                                        oneChat.messages
                                                          .length - 1
                                                      ].comentary
                                                    }`
                                                  )
                                                ) : (
                                                  "Created Succesfully"
                                                )
                                              ) : undefined}
                                            </div>
                                            <div className="userInterfaceChatsColumnOneChatNotImgPindOrMsgCount">
                                              {oneChat.messages &&
                                              oneChanell.lastSeenMsg != "0" &&
                                              oneChat.messages.length -
                                                oneChanell.lastSeenMsg !=
                                                0 ? (
                                                <div
                                                  id="notSeenCounterChats"
                                                  style={
                                                    openedChat.findname ==
                                                    oneChat.findname
                                                      ? {
                                                          backgroundColor:
                                                            "white",
                                                          color: "#3390EC",
                                                        }
                                                      : oneChanell.muted == "no"
                                                      ? {
                                                          backgroundColor:
                                                            "#3390EC",
                                                          color: "white",
                                                        }
                                                      : {
                                                          backgroundColor:
                                                            "rgb(162, 171, 178)",
                                                          color: "white",
                                                        }
                                                  }
                                                >
                                                  {oneChat.messages.length -
                                                    oneChanell.lastSeenMsg}
                                                </div>
                                              ) : oneChanell.pinned == "yes" ? (
                                                <img
                                                  src={"./pinned.png"}
                                                  alt=""
                                                />
                                              ) : undefined}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : undefined
                                  }
                                )
                              : undefined
                            : undefined}
                        </>
                      ) : oneChat.group == "chat" ? (
                        <>
                          {allChatsListInUser
                            ? allChatsListInUser.chatsList
                              ? allChatsListInUser.chatsList.map(
                                  (oneChatChat: any) => {
                                    return oneChat.findname ==
                                      oneChatChat.findname ? (
                                      <div
                                        // key={key++}
                                        className="userInterfaceChatsColumnOneChat"
                                        style={
                                          openedChat.findname ==
                                          oneChat.findname
                                            ? {
                                                backgroundColor: "#3390EC",
                                                color: "white",
                                              }
                                            : {
                                                backgroundColor: "transparent",
                                                color: "black",
                                              }
                                        }
                                        onClick={async () => {
                                          setOnScreen("chat")
                                          setChatSelected(true)
                                          async function bgbfbf() {
                                            setOpenedChat({
                                              type: "chat",
                                              findname: oneChat.findname,
                                            })
                                            setMainPageInput(
                                              "chat",
                                              oneChat.findname
                                            )
                                          }
                                          await bgbfbf()
                                          let meMsgDiv =
                                            document.getElementById(
                                              "userInterfaceChatMainMsgesColumn"
                                            )
                                          if (meMsgDiv) {
                                            let rectmsgDiv =
                                              meMsgDiv?.getBoundingClientRect()
                                            let meelem =
                                              document.querySelectorAll(
                                                '[data-lastmsg="thelastMessage"]'
                                              )[0]

                                            if (meelem) {
                                              // let rect =
                                              //   meelem.getBoundingClientRect()
                                              // let toLowDown =
                                              //   rect?.top - rectmsgDiv?.top
                                              // meMsgDiv.scrollTop = toLowDown
                                              meelem.scrollIntoView(false)
                                            }
                                          }
                                        }}
                                      >
                                        <div className="userInterfaceChatsColumnOneChatImg">
                                          <img
                                            src={oneChatChat.photoLink}
                                            alt=""
                                          />
                                          {onlineList.length ? (
                                            onlineList.find(
                                              (o: any) =>
                                                o.findname ===
                                                oneChatChat.findname.replace(
                                                  userFindName,
                                                  ""
                                                )
                                            ).online === "online" ? (
                                              <div
                                                id="blueOnline"
                                                style={
                                                  oneChatChat.findname ===
                                                  currentChatFindname
                                                    ? {
                                                        backgroundColor:
                                                          "white",
                                                        borderColor: "#3390ec",
                                                      }
                                                    : undefined
                                                }
                                              ></div>
                                            ) : undefined
                                          ) : undefined}
                                          {/* {onlineList.includes({
                                              findname: oneChatChat.findname,
                                              online: "online",
                                            }) ? (
                                              <img
                                                id="blueOnline"
                                                src=""
                                                alt=""
                                              />
                                            ) : undefined} */}
                                        </div>
                                        <div className="userInterfaceChatsColumnOneChatNotImg">
                                          <div className="userInterfaceChatsColumnOneChatNotImgTopLine">
                                            <div className="userInterfaceChatsColumnOneChatNotImgName">
                                              {oneChatChat.username}
                                              {oneChatChat.muted != "no" ? (
                                                <img
                                                  src="./muttedSpeaker.png"
                                                  alt=""
                                                />
                                              ) : undefined}
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
                                                    Number(
                                                      oneChat.lastUpdated
                                                    ) -
                                                      Number(
                                                        new Date().getTime()
                                                      )
                                                  ) <= 172800000
                                                ? `${new Date(
                                                    Number(oneChat.lastUpdated)
                                                  )
                                                    .toUTCString()
                                                    .slice(0, 3)}`
                                                : new Date().getFullYear() !=
                                                  new Date(
                                                    Number(oneChat.lastUpdated)
                                                  ).getFullYear()
                                                ? `${new Date(
                                                    Number(oneChat.lastUpdated)
                                                  ).toLocaleDateString(
                                                    "en-GB"
                                                  )}`
                                                : `${new Date(
                                                    Number(oneChat.lastUpdated)
                                                  )
                                                    .toString()
                                                    .slice(4, 10)}`}
                                            </div>
                                          </div>
                                          <div className="userInterfaceChatsColumnOneChatNotImgBotLine">
                                            <div
                                              className="userInterfaceChatsColumnOneChatNotImgLastMsg"
                                              style={
                                                openedChat.findname ==
                                                oneChat.findname
                                                  ? {
                                                      color: "white",
                                                    }
                                                  : {
                                                      color: "#7b7f83",
                                                    }
                                              }
                                              // style={
                                              //   oneChat.messages[-1]
                                              //     ? { color: "black" }
                                              //     : { color: "green" }
                                              // }
                                            >
                                              {oneChat.messages ? (
                                                oneChat.messages[
                                                  oneChat.messages.length - 1
                                                ] ? (
                                                  oneChat.messages[
                                                    oneChat.messages.length - 1
                                                  ].img ? (
                                                    <>
                                                      <img
                                                        src={
                                                          oneChat.messages[
                                                            oneChat.messages
                                                              .length - 1
                                                          ].img
                                                            ? oneChat.messages[
                                                                oneChat.messages
                                                                  .length - 1
                                                              ].img
                                                            : "./blank_photo.png"
                                                        }
                                                      />
                                                      Photo
                                                      {
                                                        oneChat.messages[
                                                          oneChat.messages
                                                            .length - 1
                                                        ].comentary
                                                      }
                                                    </>
                                                  ) : oneChat.messages[
                                                      oneChat.messages.length -
                                                        1
                                                    ].blob ? (
                                                    "Voice message"
                                                  ) : (
                                                    `${
                                                      oneChat.messages[
                                                        oneChat.messages
                                                          .length - 1
                                                      ].comentary
                                                    }`
                                                  )
                                                ) : (
                                                  "Created Succesfully"
                                                )
                                              ) : undefined}
                                            </div>
                                            <div className="userInterfaceChatsColumnOneChatNotImgPindOrMsgCount">
                                              {oneChat.messages &&
                                              oneChatChat.lastSeenMsg != "0" &&
                                              oneChat.messages.length -
                                                oneChatChat.lastSeenMsg !=
                                                0 ? (
                                                <div
                                                  id="notSeenCounterChats"
                                                  style={
                                                    openedChat.findname ==
                                                    oneChat.findname
                                                      ? {
                                                          backgroundColor:
                                                            "white",
                                                          color: "#3390EC",
                                                        }
                                                      : oneChatChat.muted ==
                                                        "no"
                                                      ? {
                                                          backgroundColor:
                                                            "#3390EC",
                                                          color: "white",
                                                        }
                                                      : {
                                                          backgroundColor:
                                                            "rgb(162, 171, 178)",
                                                          color: "white",
                                                        }
                                                  }
                                                >
                                                  {oneChat.messages.length -
                                                    oneChatChat.lastSeenMsg}
                                                </div>
                                              ) : oneChatChat.pinned ==
                                                "yes" ? (
                                                <img
                                                  src={"./pinned.png"}
                                                  alt=""
                                                />
                                              ) : undefined}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ) : undefined
                                  }
                                )
                              : undefined
                            : undefined}
                        </>
                      ) : // <div
                      //   key={key++}
                      //   className="userInterfaceChatsColumnOneChat"
                      //   style={
                      //     openedChat.findname == oneChat.findname
                      //       ? {
                      //           backgroundColor: "#3390EC",
                      //           color: "white",
                      //         }
                      //       : {
                      //           backgroundColor: "transparent",
                      //           color: "black",
                      //         }
                      //   }
                      //   onClick={() => {
                      //     setOpenedChat({
                      //       type: "chanell",
                      //       findname: oneChat.findname,
                      //     })
                      //     setMainPageInput("chanell", oneChat.findname)
                      //   }}
                      // >
                      //   <div className="userInterfaceChatsColumnOneChatImg">
                      //     <img src={oneChat.photoLink} alt="" />
                      //   </div>
                      //   <div className="userInterfaceChatsColumnOneChatNotImg">
                      //     <div className="userInterfaceChatsColumnOneChatNotImgTopLine">
                      //       <div className="userInterfaceChatsColumnOneChatNotImgName">
                      //         {oneChat.username}
                      //       </div>
                      //       <div className="userInterfaceChatsColumnOneChatNotImgDate">
                      //         {Math.abs(
                      //           Number(oneChat.lastUpdated) -
                      //             Number(new Date().getTime())
                      //         ) <= 86400000
                      //           ? `${new Date(
                      //               Number(oneChat.lastUpdated)
                      //             ).toLocaleTimeString()}`
                      //           : Math.abs(
                      //               Number(oneChat.lastUpdated) -
                      //                 Number(new Date().getTime())
                      //             ) <= 172800000
                      //           ? `${new Date(Number(oneChat.lastUpdated))
                      //               .toUTCString()
                      //               .slice(0, 3)}`
                      //           : new Date().getFullYear() !=
                      //             new Date(
                      //               Number(oneChat.lastUpdated)
                      //             ).getFullYear()
                      //           ? `${new Date(
                      //               Number(oneChat.lastUpdated)
                      //             ).toLocaleDateString("en-GB")}`
                      //           : `${new Date(Number(oneChat.lastUpdated))
                      //               .toString()
                      //               .slice(4, 10)}`}
                      //       </div>
                      //     </div>
                      //     <div className="userInterfaceChatsColumnOneChatNotImgBotLine">
                      //       <div
                      //         className="userInterfaceChatsColumnOneChatNotImgLastMsg"
                      //         // style={
                      //         //   oneChat.messages[
                      //         //     oneChat.messages.length - 1
                      //         //   ]
                      //         //     ? { color: "black" }
                      //         //     : { color: "green" }
                      //         // }
                      //       >
                      //         {oneChat.messages ? (
                      //           oneChat.messages[
                      //             oneChat.messages.length - 1
                      //           ] ? (
                      //             oneChat.messages[
                      //               oneChat.messages.length - 1
                      //             ].img ? (
                      //               <>
                      //                 <img
                      //                   src={
                      //                     oneChat.messages[
                      //                       oneChat.messages.length - 1
                      //                     ].img
                      //                       ? oneChat.messages[
                      //                           oneChat.messages.length - 1
                      //                         ].img
                      //                       : "./blank_photo.png"
                      //                   }
                      //                 />

                      //                 {
                      //                   oneChat.messages[
                      //                     oneChat.messages.length - 1
                      //                   ].comentary
                      //                 }
                      //               </>
                      //             ) : (
                      //               `${
                      //                 oneChat.messages[
                      //                   oneChat.messages.length - 1
                      //                 ].comentary
                      //               }`
                      //             )
                      //           ) : (
                      //             "Created Succesfully"
                      //           )
                      //         ) : undefined}
                      //       </div>
                      //       <div className="userInterfaceChatsColumnOneChatNotImgPindOrMsgCount">
                      //         PindOrMsgCount
                      //       </div>
                      //     </div>
                      //   </div>
                      // </div>
                      undefined
                    })
                  : undefined}
              </div>
            </div>

            {/* <div id="columnForOther"> */}
            <div
              className={`userSettingsEdit ${
                userSettingsEdit ? "toleft" : "back"
              }`}
            >
              <form action="">
                <div id="userSettingsEditHead">
                  <input
                    type="reset"
                    value=" "
                    onClick={() => {
                      setUserSettingsEdit(false)
                      setUserSettings(true)
                    }}
                  />
                  <img src={"./icons8-arrow-left-50.png"} alt="" />
                  <p>Edit Profile</p>
                </div>
                <div id="userSettingsEditImg">
                  <img
                    id="userSettingsEditImgOrigin"
                    src="./defaultUser.png"
                    alt=""
                  />
                  <div id="userSettingsEditImgNotOrigin">
                    <img src="./backlessCamera.png" alt="" />
                  </div>
                </div>
                <div id="userSettingsEditInputs">
                  <div>
                    <input
                      type="text"
                      placeholder=""
                      defaultValue={currentUserName}
                      maxLength={10}
                    />
                    <h2>Name</h2>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder=""
                      defaultValue={currentUserLastName}
                      maxLength={10}
                    />
                    <h2>Last Name</h2>
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder=""
                      defaultValue={currentUserBio}
                      maxLength={30}
                    />
                    <h2>Bio (optional)</h2>
                  </div>
                  <p>
                    Any details such as age, occupation or city. Example: 23
                    y.o. designer from San Francisco
                  </p>
                  <h1>Username</h1>
                  <div>
                    <input
                      type="text"
                      placeholder=""
                      defaultValue={userFindName}
                      maxLength={10}
                    />
                    <h2>Username (optional)</h2>
                  </div>
                  <p>
                    You can choose a username on <b>Telegram</b>. If you do,
                    people will be able to find you by this username and contact
                    you without needing your phone number.
                    <p>
                      You can use a-z, 0-9 and underscores. Minimum length is 5
                      characters.
                    </p>
                  </p>
                </div>
              </form>
            </div>
            <div
              className={`userSettings ${
                userSettings
                  ? "toleft"
                  : userSettingsEdit
                  ? "toHardLeft"
                  : "back"
              }`}
            >
              <div id="userSettingsHead">
                <div
                  id="userSettingsHeadArrow"
                  onClick={() => {
                    setUserSettings(false)
                  }}
                >
                  <img src={"./icons8-arrow-left-50.png"} alt="" />
                </div>
                <p>Settings</p>
                <img
                  src={"./icons8-arrow-left-50.png"}
                  alt=""
                  onClick={() => {
                    setUserSettingsEdit(true)
                    setUserSettings(false)
                  }}
                />
                <img src={"./icons8-arrow-left-50.png"} alt="" />
              </div>
              <div id="userSettingsImg">
                <img src="./defaultUser.png" alt="" />
              </div>
              <div id="otherSettingsStuff"></div>
            </div>
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
              <p> You can provide an optional description for your chanell.</p>
              <div
                id={`${chanellName != "" ? "createNewChanellForward" : "hide"}`}
                onClick={() => {
                  createChanell()
                }}
              >
                <img src={"./icons8-arrow-right-64.png"} alt="" />
              </div>
            </div>
            <div
              className={`createNewGroup ${createNewGroup ? "toleft" : "back"}`}
            ></div>
            <div
              className={`createNewPrivateChat ${
                createNewPrivateChat ? "toleft" : "back"
              }`}
            ></div>
            {/* </div> */}
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
        <div
          className={`userInterfaceChat ${
            onScreen === "chatsList" ? "rightChatRight" : ""
          }`}
          // style={
          //   onScreen === "chatsList"
          //     ? {
          //         transform: "translate(0, 0)",
          //       }
          //     : {
          //         transform: "translate(-100%, 0)",
          //       }
          // }
        >
          <div
            id="userInterfaceChatUnderDiv"
            // className={
            //   showDiscription
            //     ? "shrink-for-info userInterfaceChatUnderDiv"
            //     : "back-for-info userInterfaceChatUnderDiv"
            // }
            // style={
            //   showDiscription
            //     ? { width: "100%" }
            //     : { width: "calc(100% + 420px)" }
            // }
          >
            <div id="userInterfaceChatMainPart">
              <div
                id="userInterfaceChatHead"
                style={
                  currentChatType ? { display: "flex" } : { display: "none" }
                }
              >
                <div
                  id="userInterfaceChatHeadSmallDiv"
                  onClick={() => {
                    setShowDiscription(true)
                  }}
                >
                  <div id="userInterfaceChatHeadImg">
                    <img src={currentChatImgSrc} alt="" />
                  </div>
                  <div id="userInterfaceChatHeadNameColumn">
                    <div id="userInterfaceChatHeadNameColumnName">
                      {currentChatName}
                    </div>
                    <div id="userInterfaceChatHeadNameColumnLastSeen">
                      {currentChatType === "chanell" ? (
                        `${currentChatSubs} subscribers`
                      ) : currentChatType === "chat" ? (
                        // onlineList.includes({
                        //   findname: currentChatFindname.replace(
                        //     userFindName,
                        //     ""
                        //   ),
                        //   online: "online",
                        // })
                        onlineList.find(
                          (o: any) =>
                            o.findname ===
                            currentChatFindname.replace(userFindName, "")
                        ).online === "online" ? (
                          <>
                            {" "}
                            <img src="./online.png" alt="" /> online{" "}
                          </>
                        ) : (
                          `last seen ${
                            Math.abs(
                              Number(
                                onlineList.find(
                                  (o: any) =>
                                    o.findname ===
                                    currentChatFindname.replace(
                                      userFindName,
                                      ""
                                    )
                                ).online
                              ) - Number(new Date().getTime())
                            ) <= 86400000
                              ? `${new Date(
                                  Number(
                                    onlineList.find(
                                      (o: any) =>
                                        o.findname ===
                                        currentChatFindname.replace(
                                          userFindName,
                                          ""
                                        )
                                    ).online
                                  )
                                ).toLocaleTimeString()}`
                              : Math.abs(
                                  Number(
                                    onlineList.find(
                                      (o: any) =>
                                        o.findname ===
                                        currentChatFindname.replace(
                                          userFindName,
                                          ""
                                        )
                                    ).online
                                  ) - Number(new Date().getTime())
                                ) <= 172800000
                              ? `${new Date(
                                  Number(
                                    onlineList.find(
                                      (o: any) =>
                                        o.findname ===
                                        currentChatFindname.replace(
                                          userFindName,
                                          ""
                                        )
                                    ).online
                                  )
                                )
                                  .toUTCString()
                                  .slice(0, 3)}`
                              : new Date().getFullYear() !=
                                new Date(
                                  Number(
                                    onlineList.find(
                                      (o: any) =>
                                        o.findname ===
                                        currentChatFindname.replace(
                                          userFindName,
                                          ""
                                        )
                                    ).online
                                  )
                                ).getFullYear()
                              ? `${new Date(
                                  Number(
                                    onlineList.find(
                                      (o: any) =>
                                        o.findname ===
                                        currentChatFindname.replace(
                                          userFindName,
                                          ""
                                        )
                                    ).online
                                  )
                                ).toLocaleDateString("en-GB")}`
                              : `${new Date(
                                  Number(
                                    onlineList.find(
                                      (o: any) =>
                                        o.findname ===
                                        currentChatFindname.replace(
                                          userFindName,
                                          ""
                                        )
                                    ).online
                                  )
                                )
                                  .toString()
                                  .slice(4, 10)}`
                          }`
                        )
                      ) : (
                        "Bot or participants or subs and online or last seen or service notification"
                      )}
                    </div>
                  </div>
                </div>
                <div
                  id="smallScreenArrow"
                  onClick={() => {
                    if (onScreen === "chatsList") {
                      setOnScreen("chats")
                    } else {
                      setOnScreen("chatsList")
                    }
                  }}
                >
                  <img src="./icons8-arrow-left-50.png" alt="" />
                </div>

                <div id="headerAllButDesignationsOptions">
                  {currentChatPinnedList.length ? (
                    <div
                      className="userInterfaceChatHeadAllPinned allPinnedShowOnBig"
                      onClick={() => {
                        setUseScroll(false)
                        if (currentPinnedMsgNumber === 0) {
                          for (
                            let index = 0;
                            index < currentChatMsgsList.length;
                            index++
                          ) {
                            if (
                              currentChatMsgsList[index].time ===
                              currentChatPinnedList[
                                currentChatPinnedList.length - 1
                              ].time
                            ) {
                              let f = document.querySelectorAll(
                                `[data-msgkey="data-msgkey${index}"]`
                              )[0] as HTMLDivElement
                              f.scrollIntoView({
                                behavior: "smooth",
                                block: "nearest",
                                inline: "center",
                              })

                              f.classList.add("blinkBackground")
                              setTimeout(function () {
                                f.classList.remove("blinkBackground")
                              }, 1000)
                              break
                            }
                          }
                        } else {
                          for (
                            let index = 0;
                            index < currentChatMsgsList.length;
                            index++
                          ) {
                            if (
                              currentChatMsgsList[index].time ===
                              currentChatPinnedList[currentPinnedMsgNumber - 1]
                                .time
                            ) {
                              let f = document.querySelectorAll(
                                `[data-msgkey="data-msgkey${index}"]`
                              )[0] as HTMLDivElement
                              f.scrollIntoView({
                                behavior: "smooth",
                                block: "nearest",
                                // block: "center",
                                inline: "center",
                              })

                              // let msgElement = document.querySelectorAll(
                              //   `[data-msgkey="data-msgkey${index}"]`
                              // )[0] as HTMLElement

                              // let scrolledDiv = document.querySelectorAll(
                              //   `[data-msgkey="data-msgkey${index}"]`
                              // )[0].parentElement as HTMLElement
                              // let msgTop =
                              //   msgElement.getBoundingClientRect().top
                              // let scrolledDivCurrentPos = scrolledDiv.scrollTop

                              // myRef.current.scrollTop =
                              // myRef.current.scrollHeight - myRef.current.clientHeight + 100

                              // різниця між курент позішином діва а також бажаним (102 по топу), ця різниця застосовується
                              // до скролдіва і його позицію скрол топа міняє на знач цієї різниці.
                              // console.log(msgElement)
                              // console.log(msgTop)
                              // console.log(scrolledDiv)
                              // console.log(scrolledDivCurrentPos)

                              f.classList.add("blinkBackground")
                              setTimeout(function () {
                                f.classList.remove("blinkBackground")
                              }, 1000)
                              break
                            }
                          }
                        }
                        setCurrentPinnedMsgNumber(
                          currentPinnedMsgNumber === 0
                            ? currentChatPinnedList.length - 1
                            : currentPinnedMsgNumber - 1
                        )
                      }}
                    >
                      {/* <div className="center">
                        <div className="center2">
                        <div className="mover"></div>
                        </div>
                      </div> */}
                      <div className="userInterfaceChatHeadAllPinnedLine">
                        <div id="circlesWrap">
                          {currentChatPinnedList.map((oneMsg) => {
                            return (
                              <div
                                className={`blueSquare `}
                                // ${
                                //   currentPinnedMsgNumber === 0
                                //     ? "center"
                                //     : oneMsg.index > currentPinnedMsgNumber
                                //     ? "pinnedBottom"
                                //     : "pinnedUp transparent"
                                // }`}
                                style={{
                                  transform: `translateY(${
                                    currentChatPinnedList.length ===
                                    currentPinnedMsgNumber + 1
                                      ? "0"
                                      : currentPinnedMsgNumber <= 3
                                      ? (currentChatPinnedList.length - 4) * 9
                                      : (currentChatPinnedList.length -
                                          currentPinnedMsgNumber -
                                          1) *
                                        9
                                  }px)`,
                                }}
                                // ${
                                //   oneMsg.index == currentPinnedMsgNumber
                                //     ? "blue"
                                //     : "notBlue"
                                // }`}
                              ></div>
                            )
                          })}
                        </div>
                        <div id="moverWrap">
                          <div
                            className={`mover`}
                            style={{
                              transform: `translateY(-${
                                currentPinnedMsgNumber >= 3
                                  ? "0"
                                  : (3 - currentPinnedMsgNumber) * 9
                              }px)`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div id="userInterfaceChatHeadAllPinnedDiv">
                        <div id="userInterfaceChatHeadAllPinnedDivText">
                          Pinned Message
                          {currentPinnedMsgNumber ==
                          currentChatPinnedList.length
                            ? `#${currentPinnedMsgNumber + 1}`
                            : `#${currentPinnedMsgNumber + 1}`}
                        </div>
                        <div id="userInterfaceChatHeadAllPinnedList">
                          {currentChatPinnedList.map((oneMsg) => {
                            return (
                              <div
                                className={`onePinnedMsg 
                                ${
                                  oneMsg.index === currentPinnedMsgNumber
                                    ? "pinnedBack"
                                    : oneMsg.index > currentPinnedMsgNumber
                                    ? "pinnedBottom"
                                    : "pinnedUp transparent"
                                }`}
                              >
                                {oneMsg.photoLink ? (
                                  <>
                                    <img src={oneMsg.photoLink} alt="" />
                                    Photo
                                  </>
                                ) : undefined}
                                {oneMsg.comentary}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                      <div id="pinnedAllbutton">
                        <img src="./settings.png" alt="" />
                      </div>
                    </div>
                  ) : undefined}
                  {/* <div id="userInterfaceChatHeadCall">Call</div> */}
                  {/* <div id="userInterfaceChatHeadHidePinned">HidePinned</div> */}
                  {/* <div id="userInterfaceChatHeadOnePinned">OnePinned</div> */}

                  <div id="userInterfaceChatHeadAllPinnedButton">PinButt</div>
                  <div
                    id="userInterfaceChatHeadNotifications"
                    onClick={() => {
                      if (currentChatMutted != "no") {
                        universalChatManipulationFunction(
                          { type: "unmute" },
                          "unmute"
                        )
                      } else {
                        setNotificationInterval("permanent")
                        setMutedTableOpen(true)
                      }
                    }}
                  >
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
              </div>
              {currentChatPinnedList.length ? (
                <div
                  className="userInterfaceChatHeadAllPinned allPinnedShowOnSmall"
                  onClick={() => {
                    setUseScroll(false)
                    if (currentPinnedMsgNumber === 0) {
                      for (
                        let index = 0;
                        index < currentChatMsgsList.length;
                        index++
                      ) {
                        if (
                          currentChatMsgsList[index].time ===
                          currentChatPinnedList[
                            currentChatPinnedList.length - 1
                          ].time
                        ) {
                          let f = document.querySelectorAll(
                            `[data-msgkey="data-msgkey${index}"]`
                          )[0] as HTMLDivElement
                          f.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                            inline: "center",
                          })

                          f.classList.add("blinkBackground")
                          setTimeout(function () {
                            f.classList.remove("blinkBackground")
                          }, 1000)
                          break
                        }
                      }
                    } else {
                      for (
                        let index = 0;
                        index < currentChatMsgsList.length;
                        index++
                      ) {
                        if (
                          currentChatMsgsList[index].time ===
                          currentChatPinnedList[currentPinnedMsgNumber - 1].time
                        ) {
                          let f = document.querySelectorAll(
                            `[data-msgkey="data-msgkey${index}"]`
                          )[0] as HTMLDivElement
                          f.scrollIntoView({
                            behavior: "smooth",
                            block: "nearest",
                            // block: "center",
                            inline: "center",
                          })

                          // let msgElement = document.querySelectorAll(
                          //   `[data-msgkey="data-msgkey${index}"]`
                          // )[0] as HTMLElement

                          // let scrolledDiv = document.querySelectorAll(
                          //   `[data-msgkey="data-msgkey${index}"]`
                          // )[0].parentElement as HTMLElement
                          // let msgTop =
                          //   msgElement.getBoundingClientRect().top
                          // let scrolledDivCurrentPos = scrolledDiv.scrollTop

                          // myRef.current.scrollTop =
                          // myRef.current.scrollHeight - myRef.current.clientHeight + 100

                          // різниця між курент позішином діва а також бажаним (102 по топу), ця різниця застосовується
                          // до скролдіва і його позицію скрол топа міняє на знач цієї різниці.
                          // console.log(msgElement)
                          // console.log(msgTop)
                          // console.log(scrolledDiv)
                          // console.log(scrolledDivCurrentPos)

                          f.classList.add("blinkBackground")
                          setTimeout(function () {
                            f.classList.remove("blinkBackground")
                          }, 1000)
                          break
                        }
                      }
                    }
                    setCurrentPinnedMsgNumber(
                      currentPinnedMsgNumber === 0
                        ? currentChatPinnedList.length - 1
                        : currentPinnedMsgNumber - 1
                    )
                  }}
                >
                  {/* <div className="center">
                        <div className="center2">
                        <div className="mover"></div>
                        </div>
                      </div> */}
                  <div className="userInterfaceChatHeadAllPinnedLine">
                    <div id="circlesWrap">
                      {currentChatPinnedList.map((oneMsg) => {
                        return (
                          <div
                            className={`blueSquare `}
                            // ${
                            //   currentPinnedMsgNumber === 0
                            //     ? "center"
                            //     : oneMsg.index > currentPinnedMsgNumber
                            //     ? "pinnedBottom"
                            //     : "pinnedUp transparent"
                            // }`}
                            style={{
                              transform: `translateY(${
                                currentChatPinnedList.length ===
                                currentPinnedMsgNumber + 1
                                  ? "0"
                                  : currentPinnedMsgNumber <= 3
                                  ? (currentChatPinnedList.length - 4) * 9
                                  : (currentChatPinnedList.length -
                                      currentPinnedMsgNumber -
                                      1) *
                                    9
                              }px)`,
                            }}
                            // ${
                            //   oneMsg.index == currentPinnedMsgNumber
                            //     ? "blue"
                            //     : "notBlue"
                            // }`}
                          ></div>
                        )
                      })}
                    </div>
                    <div id="moverWrap">
                      <div
                        className={`mover`}
                        style={{
                          transform: `translateY(-${
                            currentPinnedMsgNumber >= 3
                              ? "0"
                              : (3 - currentPinnedMsgNumber) * 9
                          }px)`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div id="userInterfaceChatHeadAllPinnedDiv">
                    <div id="userInterfaceChatHeadAllPinnedDivText">
                      Pinned Message
                      {currentPinnedMsgNumber == currentChatPinnedList.length
                        ? `#${currentPinnedMsgNumber + 1}`
                        : `#${currentPinnedMsgNumber + 1}`}
                    </div>
                    <div id="userInterfaceChatHeadAllPinnedList">
                      {currentChatPinnedList.map((oneMsg) => {
                        return (
                          <div
                            className={`onePinnedMsg 
                                ${
                                  oneMsg.index === currentPinnedMsgNumber
                                    ? "pinnedBack"
                                    : oneMsg.index > currentPinnedMsgNumber
                                    ? "pinnedBottom"
                                    : "pinnedUp transparent"
                                }`}
                          >
                            {oneMsg.photoLink ? (
                              <>
                                <img src={oneMsg.photoLink} alt="" />
                                Photo
                              </>
                            ) : undefined}
                            {oneMsg.comentary}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <div id="pinnedAllbutton">
                    <img src="./settings.png" alt="" />
                  </div>
                </div>
              ) : undefined}
              <div id="userInterfaceChatMainBackground">
                <div
                  style={
                    // currentChatFindname
                    chatSelected && currentChatMsgsList && !notAtBottom
                      ? { display: "flex" }
                      : { display: "none" }
                  }
                  id="toBottom"
                  onClick={async (e) => {
                    e.stopPropagation()
                    await scrollOnFunc()
                    toScrolldown()
                  }}
                >
                  <img src={"./icons8-arrow-down-50.png"} alt="" />
                  <div
                    id="toBottomNumber"
                    style={
                      currentUnreadNumber === 0 || !currentUnreadNumber
                        ? { display: "none" }
                        : { display: "flex" }
                    }
                  >
                    {" "}
                    {currentUnreadNumber}
                  </div>
                </div>
                <div
                  id="userInterfaceChatMainMsgesColumn"
                  ref={myRef}
                  onWheel={() => {
                    setUseScroll(true)
                  }}
                  onScroll={async () => {
                    await scrollOnFunc()
                    checkIfAtBottom()
                    unreadNumberFunc()
                    if (
                      msgMenuTargets &&
                      msgMenuSelectPressed &&
                      msgMenuTargets.length
                    ) {
                    } else {
                      setMsgMenuCoords({ top: "", left: "" })
                      setMsgMenu(false)
                      setMsgMenuTargets([])
                      setMsgMenuListener(false)
                    }
                  }}
                >
                  <div
                    id="msgContextMenu"
                    style={
                      msgMenu
                        ? userStatus == "admin"
                          ? Number(msgMenuCoords.top) > 62 &&
                            Number(msgMenuCoords.left) > 83
                            ? {
                                display: "flex",
                                top: `calc(65% - 1%)`,
                                left: `calc(83% - 2%)`,
                              }
                            : Number(msgMenuCoords.top) > 62
                            ? {
                                display: "flex",
                                top: `calc(65% - 1%)`,
                                left: `calc(${msgMenuCoords.left}% - 1%)`,
                              }
                            : Number(msgMenuCoords.left) > 83
                            ? {
                                display: "flex",
                                top: `calc(${msgMenuCoords.top}% - 5%)`,
                                left: `calc(83% - 2%)`,
                              }
                            : {
                                display: "flex",
                                top: `calc(${msgMenuCoords.top}% - 5%)`,
                                left: `calc(${msgMenuCoords.left}% - 1%)`,
                              }
                          : Number(msgMenuCoords.top) > 70 &&
                            Number(msgMenuCoords.left) > 83
                          ? {
                              display: "flex",
                              top: `calc(73% - 1%)`,
                              left: `calc(83% - 2%)`,
                            }
                          : Number(msgMenuCoords.top) > 62
                          ? {
                              display: "flex",
                              top: `calc(73% - 1%)`,
                              left: `calc(${msgMenuCoords.left}% - 1%)`,
                            }
                          : Number(msgMenuCoords.left) > 83
                          ? {
                              display: "flex",
                              top: `calc(${msgMenuCoords.top}% - 5%)`,
                              left: `calc(83% - 2%)`,
                            }
                          : {
                              display: "flex",
                              top: `calc(${msgMenuCoords.top}% - 5%)`,
                              left: `calc(${msgMenuCoords.left}% - 1%)`,
                            }
                        : { display: "none" }
                    }
                  >
                    <div id="msgContextMenuEmotions">
                      {smileGroups.map((smileGroup) => {
                        let theNumber = 0
                        {
                          if (smileGroup.name == "Frequently Used") {
                            return (
                              <div id="msgContextMenuEmotionsWrapper">
                                {smileGroup.smiles.map((unoSmile) => {
                                  {
                                    if (theNumber <= 7) {
                                      return (
                                        <div
                                          id="contextMenuTheSmile"
                                          onClick={() => {
                                            let smileInfo: smileMsgType = {
                                              type: "changeSmile",
                                              name: unoSmile.name,
                                              smile: unoSmile.symbol,
                                            }
                                            universalChatManipulationFunction(
                                              smileInfo,
                                              "changeSmile"
                                            )
                                          }}
                                        >
                                          {unoSmile.symbol}
                                        </div>
                                      )
                                    }
                                    theNumber++
                                  }
                                })}
                              </div>
                            )
                          }
                        }
                      })}
                      <img src="./icons8-down-50.png" alt="" />
                    </div>
                    <div id="msgContextMenuOptions">
                      {userStatus == "admin" ? (
                        <>
                          <div>
                            <img src="./icons8-reply-50.png" alt="" />
                            Reply
                          </div>
                          <div
                            onClick={() => {
                              if (msgMenuTargets && msgMenuTargets[0]) {
                                let text: any
                                for (
                                  let index = 0;
                                  index <
                                  msgMenuTargets[0].children[0].children.length;
                                  index++
                                ) {
                                  const element =
                                    msgMenuTargets[0].children[0].children[
                                      index
                                    ]
                                  if (element.id == "comentary") {
                                    text =
                                      msgMenuTargets[0].children[0].children[
                                        index
                                      ].children[0].innerHTML
                                  }
                                }
                                setCurrentEditText(text)
                                setCurrentEditingState(true)
                                setCurrentEditTextInput(text)
                                setMsgMenu(false)
                                setMsgMenuCoords({ top: "", left: "" })
                                setMsgMenuListener(false)
                                setCurrentEditTarget(msgMenuTargets[0])
                              }
                            }}
                          >
                            <img src="./icons8-edit-50.png" alt="" />
                            Edit
                          </div>
                          <div
                            onClick={async () => {
                              if (msgMenuTargets && msgMenuTargets[0]) {
                                let text: any
                                for (
                                  let index = 0;
                                  index <
                                  msgMenuTargets[0].children[0].children.length;
                                  index++
                                ) {
                                  const element =
                                    msgMenuTargets[0].children[0].children[
                                      index
                                    ]
                                  if (element.id == "comentary") {
                                    text =
                                      msgMenuTargets[0].children[0].children[
                                        index
                                      ].children[0].innerHTML
                                  }
                                }
                                if (text) {
                                  await navigator.clipboard.writeText(text)
                                }
                              }
                              setMsgMenu(false)
                              setMsgMenuCoords({ left: "", top: "" })
                              setMsgMenuListener(false)
                            }}
                          >
                            <img src="./icons8-copy-50.png" alt="" />
                            Copy
                          </div>
                          <div
                            onClick={() => {
                              if (msgMenuTargets && msgMenuTargets[0]) {
                                universalChatManipulationFunction(
                                  {
                                    type: "nomsg",
                                  },
                                  "pin"
                                )
                              }

                              setMsgMenu(false)
                              setMsgMenuCoords({ left: "", top: "" })
                              setMsgMenuListener(false)
                            }}
                          >
                            <img src="./icons8-pin-50.png" alt="" />
                            Pin
                          </div>
                          <div>
                            <img src="./icons8-forward-50.png" alt="" />
                            Forward
                          </div>

                          <div
                            onClick={async (event) => {
                              if (msgMenuTargets) {
                                if (msgMenuTargets[0]) {
                                  msgMenuTargets[0].style.backgroundColor =
                                    "rgb(112, 117, 121, 0.8)"
                                }
                                setMsgMenuSelectPressed(true)
                                setMsgMenu(false)
                                setMsgMenuCoords({ left: "", top: "" })
                                setMsgMenuListener(false)
                              }
                            }}
                          >
                            <img src="./select.png" alt="" />
                            Select
                          </div>
                          <div style={{ color: "red" }}>
                            <img
                              src="./icons8-trash-can-layout-for-a-indication-to-throw-trash-24.png"
                              alt=""
                            />
                            Delete
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <img src="./icons8-reply-50.png" alt="" />
                            Reply
                          </div>
                          <div
                            onClick={async () => {
                              if (msgMenuTargets && msgMenuTargets[0]) {
                                let text: any
                                for (
                                  let index = 0;
                                  index <
                                  msgMenuTargets[0].children[0].children.length;
                                  index++
                                ) {
                                  const element =
                                    msgMenuTargets[0].children[0].children[
                                      index
                                    ]
                                  if (element.id == "comentary") {
                                    text =
                                      msgMenuTargets[0].children[0].children[
                                        index
                                      ].children[0].innerHTML
                                  }
                                }
                                if (text) {
                                  await navigator.clipboard.writeText(text)
                                }
                              }
                              setMsgMenu(false)
                              setMsgMenuCoords({ left: "", top: "" })
                              setMsgMenuListener(false)
                            }}
                          >
                            <img src="./icons8-copy-50.png" alt="" />
                            Copy
                          </div>
                          <div>
                            <img src="./icons8-forward-50.png" alt="" />
                            Forward
                          </div>
                          <div
                            onClick={async (event) => {
                              if (msgMenuTargets) {
                                if (msgMenuTargets[0]) {
                                  msgMenuTargets[0].style.backgroundColor =
                                    "rgb(112, 117, 121, 0.8)"
                                }
                                setMsgMenuSelectPressed(true)
                                setMsgMenu(false)
                                setMsgMenuCoords({ left: "", top: "" })
                                setMsgMenuListener(false)
                              }
                            }}
                          >
                            <img src="./select.png" alt="" />
                            Select
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {currentChatMsgsList?.length ? (
                    currentChatMsgsList.map((item) => {
                      valToEvalLastMsg = false
                      if (allChatsListInUser) {
                        if (allChatsListInUser.chanellsList) {
                          for (
                            let i = 0;
                            i < allChatsListInUser.chanellsList.length;
                            i++
                          ) {
                            if (
                              allChatsListInUser?.chanellsList[i].findname ==
                              currentChatFindname
                            ) {
                              let msgNumber = Number(
                                allChatsListInUser?.chanellsList[i].lastSeenMsg
                              )
                              if (currentMappedListKey == msgNumber - 1) {
                                valToEvalLastMsg = true
                                break
                              }

                              if (currentMappedListKey > msgNumber - 1) {
                                valToEvalNotSeen = true
                              } else {
                                valToEvalNotSeen = false
                              }
                            } else {
                            }
                          }
                        }
                        if (allChatsListInUser.chatsList) {
                          for (
                            let i = 0;
                            i < allChatsListInUser.chatsList.length;
                            i++
                          ) {
                            if (
                              allChatsListInUser?.chatsList[i].findname ==
                              currentChatFindname
                            ) {
                              let msgNumber = Number(
                                allChatsListInUser?.chatsList[i].lastSeenMsg
                              )
                              if (currentMappedListKey == msgNumber - 1) {
                                valToEvalLastMsg = true
                                break
                              }

                              if (currentMappedListKey > msgNumber - 1) {
                                valToEvalNotSeen = true
                              } else {
                                valToEvalNotSeen = false
                              }
                            } else {
                            }
                          }
                        }
                      }

                      if (
                        currentChatMsgsList.length - 1 ==
                        currentMappedListKey
                      ) {
                        // currentMappedListKey = 0
                      } else {
                        currentMappedListKey++
                      }

                      return (
                        <>
                          {timeForCorrectMsgTime == "0" ? (
                            <div id="msgGlobalTime">Created Successfully</div>
                          ) : timeForCorrectMsgTime != "0" ? (
                            new Date(Number(item.time)).toDateString() !=
                            new Date(
                              Number(timeForCorrectMsgTime)
                            ).toDateString() ? (
                              new Date().getFullYear() ==
                              new Date(Number(item.time)).getFullYear() ? (
                                <div id="msgGlobalTime">
                                  {new Date(Number(item.time))
                                    .toDateString()
                                    .split(" ")[1] +
                                    " " +
                                    new Date(Number(item.time))
                                      .toDateString()
                                      .split(" ")[2]}
                                </div>
                              ) : (
                                <div id="msgGlobalTime">
                                  {new Date(Number(item.time))
                                    .toDateString()
                                    .split(" ")[1] +
                                    " " +
                                    new Date(Number(item.time))
                                      .toDateString()
                                      .split(" ")[2] +
                                    " " +
                                    new Date(Number(item.time))
                                      .toDateString()
                                      .split(" ")[3]}
                                </div>
                              )
                            ) : undefined
                          ) : undefined}

                          <div
                            data-lastmsg={
                              valToEvalLastMsg ? "thelastMessage" : "none"
                            }
                            data-notseen={valToEvalNotSeen ? "notseen" : "none"}
                            id="msg"
                            key={`msgkey${key++}`}
                            data-msgkey={`data-msgkey${key}`}
                            onClick={(event) => {
                              event.preventDefault()
                              let target = event.target as HTMLDivElement
                              if (msgMenuSelectPressed) {
                                if (msgMenuTargets) {
                                  for (
                                    let i = 0;
                                    i < msgMenuTargets.length;
                                    i++
                                  ) {
                                    if (target != msgMenuTargets[i]) {
                                      continue
                                    } else {
                                      let notUndefTarget = msgMenuTargets[i]
                                      if (notUndefTarget) {
                                        notUndefTarget.style.backgroundColor =
                                          "transparent"
                                      }
                                      let oldmsgContextMenu = [
                                        ...msgMenuTargets,
                                      ]
                                      if (msgMenuTargets.length == 1) {
                                        setMsgMenuTargets([])
                                        setMsgMenuSelectPressed(false)
                                        return
                                      }

                                      if (i == 0) {
                                        oldmsgContextMenu.shift()
                                        setMsgMenuTargets(oldmsgContextMenu)
                                        return
                                      } else {
                                        if (
                                          i ==
                                          msgContextMenu.target.length - 1
                                        ) {
                                          oldmsgContextMenu.pop()
                                          setMsgMenuTargets(oldmsgContextMenu)
                                          return
                                        } else {
                                          let oldTarget = oldmsgContextMenu
                                            .slice(0, i)
                                            .concat(
                                              oldmsgContextMenu.slice(i + 1)
                                            )
                                          oldmsgContextMenu = oldTarget
                                          setMsgMenuTargets(oldmsgContextMenu)
                                          return
                                        }
                                      }
                                    }
                                  }
                                  setMsgMenuSelectPressed(true)
                                  let aaaa = [...msgMenuTargets]
                                  aaaa.push(target)
                                  setMsgMenuTargets(aaaa)
                                  target.style.backgroundColor =
                                    "rgb(112, 117, 121, 0.8)"
                                }
                              }
                            }}
                            onContextMenu={(event) => {
                              event.preventDefault()
                              let target = event.target as HTMLDivElement
                              if (msgMenuTargets) {
                                if (msgMenuTargets[0]) {
                                  if (!currentEditingState) {
                                    return
                                  }
                                }
                              }
                              let vw = window.innerWidth + 840
                              let vh = window.innerHeight + 100
                              setMsgMenuCoords({
                                top: String((event.pageY / vh) * 100),
                                left: String((event.pageX / vw) * 100),
                              })
                              setMsgMenu(true)
                              // if(!currentEditingState){
                              setMsgMenuTargets([target])
                              // }
                              setMsgMenuListener(true)
                            }}
                            // className={
                            //   currentChatMsgsList.length - 1 ==
                            //   currentMappedListKey
                            //     ? "trackMe"
                            //     : undefined
                            // }
                            // className={key % 2 ? "rightmsg" : "leftmsg"}
                          >
                            <div
                              id="surroundDiv"
                              className={
                                msgMenuSelectPressed &&
                                msgMenuTargets &&
                                msgMenuTargets.length
                                  ? "toright-msg"
                                  : "back-msg"
                              }
                              // style={ ? {}: {display: "flex"}}
                            >
                              {item.type == "blob" ? (
                                <div id="audioMsgDiv">
                                  <audio
                                    data-keepplaying
                                    onEnded={(event) => {
                                      setTheAudio(undefined)
                                      let target =
                                        event.target as HTMLAudioElement
                                      if (target.parentElement) {
                                        target.parentElement.children[2].children[1].children[0].innerHTML = `${Math.trunc(
                                          Number(item.blobTime) / 60
                                        )} :
                                            ${
                                              Math.trunc(
                                                Number(item.blobTime) % 60
                                              ) < 10
                                                ? "0" +
                                                  Math.trunc(
                                                    Number(item.blobTime) % 60
                                                  )
                                                : Math.trunc(
                                                    Number(item.blobTime) % 60
                                                  )
                                            }`
                                      }
                                    }}
                                    onTimeUpdate={(event) => {
                                      let target =
                                        event.target as HTMLAudioElement
                                      if (target.parentElement) {
                                        if (target.currentTime != 0) {
                                          target.parentElement.children[2].children[1].children[0].innerHTML = `${Math.trunc(
                                            target.currentTime / 60
                                          )} : ${
                                            Math.trunc(
                                              target.currentTime % 60
                                            ) < 10
                                              ? "0" +
                                                Math.trunc(
                                                  target.currentTime % 60
                                                )
                                              : Math.trunc(
                                                  target.currentTime % 60
                                                )
                                          }  /  
                                            ${Math.trunc(
                                              Number(item.blobTime) / 60
                                            )} :
                                            ${
                                              Math.trunc(
                                                Number(item.blobTime) % 60
                                              ) < 10
                                                ? "0" +
                                                  Math.trunc(
                                                    Number(item.blobTime) % 60
                                                  )
                                                : Math.trunc(
                                                    Number(item.blobTime) % 60
                                                  )
                                            }`
                                        } else {
                                          target.parentElement.children[2].children[1].children[0].innerHTML = `
                                              ${Math.trunc(
                                                Number(item.blobTime) / 60
                                              )} :
                                              ${
                                                Math.trunc(
                                                  Number(item.blobTime) % 60
                                                ) < 10
                                                  ? "0" +
                                                    Math.trunc(
                                                      Number(item.blobTime) % 60
                                                    )
                                                  : Math.trunc(
                                                      Number(item.blobTime) % 60
                                                    )
                                              }`
                                        }
                                      }
                                    }}
                                    src={
                                      item.blob
                                      //   URL.createObjectURL(
                                      //   // new Blob([item.blob], {
                                      //   //   type: "audio/webm",
                                      //   // })
                                      //   new Blob(
                                      //     // @ts-ignore
                                      //     [item.blob],
                                      //     {
                                      //       type: "audio/mp3",
                                      //     }
                                      //   )
                                      //   // b64toBlob(item.blob, "audio/webm")
                                      // )
                                    }
                                  ></audio>
                                  <div
                                    id="audioButton"
                                    onClick={(event) => {
                                      // new Audio(
                                      //   URL.createObjectURL(item.blob)
                                      // ).play()
                                      let theAudioNow = (
                                        event.target as HTMLDivElement
                                      ).parentElement?.parentElement
                                        ?.children[0] as HTMLAudioElement
                                      setTheAudio(theAudioNow)
                                      if (theAudio && theAudio == theAudioNow) {
                                        if (theAudio.paused) {
                                          theAudio.play()
                                        } else {
                                          theAudio.pause()
                                        }
                                      } else {
                                        if (theAudioNow) {
                                          if (theAudioNow.paused) {
                                            theAudioNow.play()
                                            // theAudioNow.addEventListener(
                                            //   "canplay",
                                            //   function handler(e) {
                                            //     theAudioNow.play()
                                            //     console.log("play2")
                                            //     e.currentTarget?.removeEventListener(
                                            //       e.type,
                                            //       handler
                                            //     )
                                            //   }
                                            // )
                                          } else {
                                            theAudioNow.pause()
                                          }
                                        }
                                      }
                                      //  else if () {
                                      //   theAudio.pause();
                                      //   theAudio.currentTime = 0;
                                      // }
                                      // else {
                                      //   return false;
                                      // }
                                    }}
                                  >
                                    <img src="./audioForward.png" alt="" />
                                  </div>
                                  <div id="notAudioButton">
                                    <div id="audioProgress">
                                      {/* <MyVisual /> */}
                                      {item.blobWave.map((height: any) => {
                                        return (
                                          <div
                                            id="oneAudioRect"
                                            style={{
                                              height: `${height}px`,
                                            }}
                                          >
                                            {" "}
                                          </div>
                                        )
                                      })}
                                      {/* <AudioVisualizer
                                            blob={item.blob}
                                            width={205}
                                            height={50}
                                            barWidth={3}
                                            gap={2}
                                            barColor={"#5CA853"}
                                            // barColor={"#BAE3B5"}
                                            // link={
                                            //   theAudio
                                            //     ? theAudio.src
                                            //     : URL.createObjectURL(item.blob)
                                            // }
                                          /> */}
                                      {/* {item.blobWave} */}
                                    </div>
                                    <div id="audioTimeWraper">
                                      <div id="audioTime">{item.blobTime}</div>
                                      {item.comentary ? (
                                        <></>
                                      ) : (
                                        <div
                                          id="time"
                                          data-msgtime={
                                            (timeForCorrectMsgTime = item.time)
                                          }
                                        >
                                          {new Date(
                                            Number(item.time)
                                          ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ) : item.img ? (
                                <div id="msgImgWithCommentary">
                                  <img src={item.img} alt="" />
                                  {item.comentary ? undefined : (
                                    <div
                                      id="time"
                                      data-msgtime={
                                        (timeForCorrectMsgTime = item.time)
                                      }
                                    >
                                      {new Date(
                                        Number(item.time)
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </div>
                                  )}{" "}
                                </div>
                              ) : (
                                <></>
                              )}
                              {item.comentary ? (
                                <div id="comentary">
                                  <p>{item.comentary}</p>
                                  {!item.emotions.length &&
                                  currentChatMsgsList[key].comentary &&
                                  getTextWidth(
                                    currentChatMsgsList[key].comentary,
                                    "16px open sans"
                                  ) <= 429 ? (
                                    <div
                                      id="time"
                                      data-msgtime={
                                        (timeForCorrectMsgTime = item.time)
                                      }
                                    >
                                      {item.pinned ? (
                                        <img src="./icons8-pin-50.png" alt="" />
                                      ) : undefined}
                                      {new Date(
                                        Number(item.time)
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </div>
                                  ) : undefined}
                                </div>
                              ) : undefined}
                              {item.emotions.length ? (
                                <div id="emotions">
                                  {item.emotions
                                    ? item.emotions.map((emotion) => {
                                        return (
                                          <div
                                            id="oneemo"
                                            style={
                                              emotion.users.includes(
                                                userFindName
                                              )
                                                ? {
                                                    backgroundColor: "#3390ec",
                                                    color: "white",
                                                  }
                                                : { display: "flex" }
                                            }
                                            // key={key++} CHAGE "KEY" TO SOME OTHER WORD OR EMOTIONS WONT WORK
                                          >
                                            <p>{emotion.smile}</p>
                                            <p>{emotion.count}</p>
                                          </div>
                                        )
                                      })
                                    : undefined}
                                  {item.emotions.length ||
                                  getTextWidth(
                                    currentChatMsgsList[key].comentary,
                                    "16px open sans"
                                  ) > 429 ? (
                                    <div
                                      id="time"
                                      data-msgtime={
                                        (timeForCorrectMsgTime = item.time)
                                      }
                                    >
                                      {item.pinned ? (
                                        <img src="./icons8-pin-50.png" alt="" />
                                      ) : undefined}
                                      {new Date(
                                        Number(item.time)
                                      ).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}
                                    </div>
                                  ) : undefined}
                                </div>
                              ) : getTextWidth(
                                  currentChatMsgsList[key].comentary,
                                  "16px open sans"
                                ) > 429 ? (
                                <div
                                  id="time"
                                  data-msgtime={
                                    (timeForCorrectMsgTime = item.time)
                                  }
                                >
                                  {item.pinned ? (
                                    <img src="./icons8-pin-50.png" alt="" />
                                  ) : undefined}
                                  {new Date(
                                    Number(item.time)
                                  ).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              ) : undefined}
                            </div>
                          </div>
                        </>
                      )
                    })
                  ) : currentChatType ? (
                    <div id="noMessagesYet">
                      No Messages Yet
                      <img src="" alt="" />
                    </div>
                  ) : undefined}
                </div>
                {msgMenuSelectPressed &&
                msgMenuTargets &&
                msgMenuTargets.length ? (
                  <div id="userInterfaceChatMainInputBarOnSelectReplacement">
                    <div id="userInterfaceChatMainInputBarOnSelectReplacementLine">
                      <div className="wide">
                        <img src="./icons8-close-50.png" alt="" />
                        <p>
                          {msgMenuTargets.length}{" "}
                          {msgMenuTargets.length == 1 ? "message" : "messages"}
                        </p>
                      </div>
                      <div>
                        <img src="./icons8-forward-50.png" alt="" />
                        <p>Forward</p>
                      </div>
                      <div
                        className="red-text"
                        onClick={() => {
                          universalChatManipulationFunction(
                            { type: "nomsg" },
                            "delete"
                          )
                        }}
                      >
                        <img
                          src="./icons8-trash-can-layout-for-a-indication-to-throw-trash-24.png"
                          alt=""
                        />
                        <p>Delete</p>
                      </div>
                    </div>
                  </div>
                ) : currentEditingState ? (
                  <div
                    id="userInterfaceChatMainInputBar"
                    className="h-120"
                    style={
                      userStatus == "admin"
                        ? { display: "flex" }
                        : { display: "none" }
                    }
                  >
                    <div id="userInterfaceChatMainInputBarDevider">
                      <div id="editReference">
                        <img src="./icons8-edit-50.png" alt="" />
                        <div>
                          <p>Editing</p>
                          <p>{currentEditText}</p>
                        </div>
                        <img
                          src="./icons8-close-50.png"
                          alt=""
                          onClick={() => {
                            setCurrentEditText("")
                            setCurrentEditingState(false)
                            setCurrentEditTextInput("")
                            setMsgMenuTargets([])
                            setCurrentEditTarget(undefined)
                          }}
                        />
                      </div>

                      <div id="userInterfaceChatMainInputLineEdit">
                        <div id="userInterfaceChatMainInputSmile">
                          {" "}
                          <img
                            onMouseEnter={() => {
                              setSmileBarMouseEnter(true)
                            }}
                            onClick={() => {
                              if (smileBarClick) {
                                setSmileBarMouseEnter(false)
                                setSmileBarClick(!smileBarClick)
                              } else {
                                setSmileBarClick(!smileBarClick)
                              }
                            }}
                            onMouseLeave={() => {
                              setSmileBarMouseEnter(false)
                            }}
                            src={
                              smileBarClick || smileBarMouseEnter
                                ? `./inputSmileBlue.png`
                                : `./inputSmile.png`
                            }
                          />
                          {smileBarClick || smileBarMouseEnter ? (
                            <div id="userInterfaceChatMainInputSmileMainScreen">
                              <div id="smilesGroupsDiv">
                                {smileGroups.map((smileGroup) => {
                                  return (
                                    <img src={smileGroup.mainSmile} alt="" />
                                  )
                                })}
                              </div>
                              <div id="smilesSearchDiv">some search</div>
                              {smileGroups.map((smileGroup) => {
                                return (
                                  <div id="smilesWholeGroupDiv">
                                    <div id="smilesGroupNameDiv">
                                      {smileGroup.name}
                                    </div>
                                    <div id="smilesGroupSmilesDiv">
                                      {smileGroup.smiles.map((unoSmile) => {
                                        return (
                                          <div
                                            id="theSmile"
                                            onClick={() => {
                                              let text =
                                                currentEditTextInput +
                                                `${unoSmile.symbol}`
                                              setCurrentEditTextInput(text)
                                              document
                                                .getElementById(
                                                  "userInterfaceChatMainInputTextInputEdit"
                                                )
                                                ?.focus()
                                            }}
                                          >
                                            {unoSmile.symbol}
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          ) : undefined}
                        </div>
                        <div id="userInterfaceChatMainInputTextEdit">
                          <input
                            id="userInterfaceChatMainInputTextInputEdit"
                            type="text"
                            value={currentEditTextInput}
                            onChange={(event) => {
                              let target = event.target as HTMLInputElement
                              setCurrentEditTextInput(target.value)
                            }}
                            onKeyDown={async (event) => {
                              let target = event.target as HTMLInputElement
                              if (event.key == "Enter") {
                                if (!target.value) {
                                  return
                                }

                                let mainInfo: editMsgType = {
                                  type: "edit",
                                  msgObjToEdit: {
                                    currentEditTarget: currentEditTarget,
                                    currentEditTextInput: currentEditTextInput,
                                  },
                                }
                                await universalChatManipulationFunction(
                                  mainInfo,
                                  "edit"
                                )
                              }
                            }}
                            placeholder="Message"
                          />
                        </div>

                        <div id="userInterfaceChatMainInputFileEdit">
                          <input
                            type="file"
                            id="fileUploadInput"
                            // onChange={async (event) => {
                            //   await onImageChooseForInput(event)
                            //   setDisplaySend(true)
                            // }}
                          />
                          <label htmlFor="fileUploadInput">
                            <img src={`./fileInput.png`} />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div
                      id="userInterfaceChatMainInputVoice"
                      onClick={async (event) => {
                        event.preventDefault()
                        let mainInfo: editMsgType = {
                          type: "edit",
                          msgObjToEdit: {
                            currentEditTarget: currentEditTarget,
                            currentEditTextInput: currentEditTextInput,
                          },
                        }
                        await universalChatManipulationFunction(
                          mainInfo,
                          "edit"
                        )
                      }}
                    >
                      <img src={`./select.png`} />
                    </div>

                    {/* const [inputImgUrl, setInputImgUrl] = useState("")
                    const [inputImg, setInputImg] = useState<File | null>(null)
                    const [showInputImg, setShowInputImg] = useState(false) */}

                    {inputImgType == "image" ? (
                      <div
                        id="inputImgShowBackground"
                        style={
                          displaySend
                            ? { display: "flex" }
                            : { display: "none" }
                        }
                      >
                        <div id="inputImgDisplay">
                          <div id="inputImgDisplayTop">
                            <div id="imgInputClose">
                              <img
                                src={"./icons8-close-50.png"}
                                alt=""
                                onClick={() => {
                                  setDisplaySend(false)
                                }}
                              />
                            </div>
                            <p>Send Photo</p>
                            <img
                              id="imgInputSetting"
                              src={"./settings.png"}
                              alt=""
                            />
                          </div>
                          <div id="inputImgimg">
                            {" "}
                            <img
                              src={
                                inputImgUrl ? inputImgUrl : "./blank_photo.png"
                              }
                              alt=""
                            />
                          </div>
                          <div id="inputImgDisplayBottom">
                            <input
                              type="text"
                              id="fileUploadCommentaryInput"
                              placeholder="Add a caption..."
                              value={currentChatComentary}
                              onChange={(event) => {
                                let target = event.target as HTMLInputElement
                                setCurrentChatComentary(target.value)
                              }}
                              onKeyDown={async (event) => {
                                let target = event.target as HTMLInputElement
                                if (event.key == "Enter") {
                                  if (!target.value) {
                                    return
                                  }
                                  let mainInfo = await createMsgObjectForFiles()
                                  universalChatManipulationFunction(
                                    mainInfo,
                                    "add"
                                  )
                                  setCurrentChatComentary("")
                                  setDisplaySend(false)
                                }
                              }}
                            />
                            <div
                              id="inputImgSend"
                              onClick={async () => {
                                let mainInfo = await createMsgObjectForFiles()
                                universalChatManipulationFunction(
                                  mainInfo,
                                  "add"
                                )

                                setCurrentChatComentary("")
                                setDisplaySend(false)
                              }}
                            >
                              SEND
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        id="inputImgShowBackground"
                        style={
                          displaySend
                            ? { display: "flex" }
                            : { display: "none" }
                        }
                      >
                        <div id="inputImgDisplay">
                          <div id="inputImgDisplayTop">
                            <div id="imgInputClose">
                              <img
                                src={"./icons8-close-50.png"}
                                alt=""
                                onClick={() => {
                                  setDisplaySend(false)
                                }}
                              />
                            </div>
                            <p>Send File</p>
                            <img
                              id="imgInputSetting"
                              src={"./settings.png"}
                              alt=""
                            />
                          </div>
                          <div id="inputImgimg">
                            {" "}
                            <img src={"./icons8-file-48.png"} alt="" />
                            <p>
                              {inputImgType}
                              {inputImgName}
                              {inputImgSize}
                            </p>
                          </div>
                          <div id="inputImgDisplayBottom">
                            <input
                              type="text"
                              placeholder="Add a caption..."
                              value={currentChatComentary}
                              onChange={(event) => {
                                let target = event.target as HTMLInputElement
                                setCurrentChatComentary(target.value)
                              }}
                              onKeyDown={async (event) => {
                                let target = event.target as HTMLInputElement
                                if (event.key == "Enter") {
                                  if (!target.value) {
                                    return
                                  }
                                  let mainInfo = await createMsgObjectForFiles()
                                  universalChatManipulationFunction(
                                    mainInfo,
                                    "add"
                                  )
                                  setCurrentChatComentary("")
                                  setDisplaySend(false)
                                }
                              }}
                            />
                            <div id="inputImgSend">SEND</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : isRecording ? (
                  <div
                    id="userInterfaceChatMainInputBarRecord"
                    className="h-60"
                    style={
                      userStatus == "admin"
                        ? { display: "flex" }
                        : { display: "none" }
                    }
                  >
                    <div id="userInterfaceChatMainInputLineRecord">
                      <div id="userInterfaceChatMainInputTextRecord">
                        <input
                          id="userInterfaceChatMainInputTextInput"
                          type="text"
                          value={currentChatComentary}
                          onChange={(event) => {
                            let target = event.target as HTMLInputElement
                            setCurrentChatComentary(target.value)
                          }}
                          onKeyDown={async (event) => {
                            let target = event.target as HTMLInputElement
                          }}
                          placeholder="Message"
                        />
                      </div>
                      <div id="recordTimer">
                        {/* <p>{time}</p> */}
                        <p>{"111111"}</p>
                        <div id="flashingRed"></div>{" "}
                      </div>
                    </div>
                    <div
                      id="stopRecord"
                      onClick={() => {
                        if (
                          microphonePermissionState === "granted" &&
                          isRecording
                        ) {
                          handleClickStopRecord("stop")
                        }
                      }}
                    >
                      <img
                        src={`./icons8-trash-can-layout-for-a-indication-to-throw-trash-24.png`}
                      />
                    </div>
                    <div
                      id="userInterfaceChatMainInputVoiceApprove"
                      onClick={() => {
                        handleClickStopRecord("go")
                      }}
                    >
                      <img src={`./icons8-arrow-right-64.png`} />
                    </div>

                    {/* const [inputImgUrl, setInputImgUrl] = useState("")
                const [inputImg, setInputImg] = useState<File | null>(null)
                    const [showInputImg, setShowInputImg] = useState(false) */}
                    {mutedTableOpen ? (
                      <div id="inputImgShowBackground">
                        <div id="notificationSetDiv">
                          <div id="notificationSetDivHeader">
                            <img src={currentChatImgSrc} alt="" /> Notifications
                          </div>

                          <div
                            id="notificationSetDivTimer"
                            onClick={() => {
                              setNotificationInterval("3600000")
                            }}
                          >
                            <div
                              id="notificationSetDivCircle"
                              style={
                                notificationInterval == "3600000"
                                  ? {
                                      backgroundColor: "#3390ec",
                                      borderColor: "#3390ec",
                                    }
                                  : { display: "flex" }
                              }
                            >
                              <div></div>
                            </div>
                            For 1 Hour
                          </div>
                          <div
                            id="notificationSetDivTimer"
                            onClick={() => {
                              setNotificationInterval("14400000")
                            }}
                          >
                            <div
                              id="notificationSetDivCircle"
                              style={
                                notificationInterval == "14400000"
                                  ? {
                                      backgroundColor: "#3390ec",
                                      borderColor: "#3390ec",
                                    }
                                  : { display: "flex" }
                              }
                            >
                              <div></div>
                            </div>
                            For 4 Hour
                          </div>
                          <div
                            id="notificationSetDivTimer"
                            onClick={() => {
                              setNotificationInterval("28800000")
                            }}
                          >
                            <div
                              id="notificationSetDivCircle"
                              style={
                                notificationInterval == "28800000"
                                  ? {
                                      backgroundColor: "#3390ec",
                                      borderColor: "#3390ec",
                                    }
                                  : { display: "flex" }
                              }
                            >
                              <div></div>
                            </div>
                            For 8 Hour
                          </div>
                          <div
                            id="notificationSetDivTimer"
                            onClick={() => {
                              setNotificationInterval("86400000")
                            }}
                          >
                            <div
                              id="notificationSetDivCircle"
                              style={
                                notificationInterval == "86400000"
                                  ? {
                                      backgroundColor: "#3390ec",
                                      borderColor: "#3390ec",
                                    }
                                  : { display: "flex" }
                              }
                            >
                              <div></div>
                            </div>
                            For 1 Day
                          </div>
                          <div
                            id="notificationSetDivTimer"
                            onClick={() => {
                              setNotificationInterval("259200000")
                            }}
                          >
                            <div
                              id="notificationSetDivCircle"
                              style={
                                notificationInterval == "259200000"
                                  ? {
                                      backgroundColor: "#3390ec",
                                      borderColor: "#3390ec",
                                    }
                                  : { display: "flex" }
                              }
                            >
                              <div></div>
                            </div>
                            For 3 Days
                          </div>
                          <div
                            id="notificationSetDivTimer"
                            onClick={() => {
                              setNotificationInterval("permanent")
                            }}
                          >
                            <div
                              id="notificationSetDivCircle"
                              style={
                                notificationInterval == "permanent"
                                  ? {
                                      backgroundColor: "#3390ec",
                                      borderColor: "#3390ec",
                                    }
                                  : { display: "flex" }
                              }
                            >
                              <div></div>
                            </div>
                            Forever
                          </div>
                          <div id="notificationSetDivFooter">
                            <p
                              onClick={() => {
                                setMutedTableOpen(false)
                              }}
                            >
                              CANCEL
                            </p>
                            <p
                              onClick={() => {
                                let info: {
                                  type: "mute"
                                  time: string
                                } = {
                                  type: "mute",
                                  time: notificationInterval,
                                }
                                universalChatManipulationFunction(info, "mute")
                                setMutedTableOpen(false)
                              }}
                            >
                              MUTE
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : undefined}
                    {inputImgType == "image" ? (
                      <div
                        id="inputImgShowBackground"
                        style={
                          displaySend
                            ? { display: "flex" }
                            : { display: "none" }
                        }
                      >
                        <div id="inputImgDisplay">
                          <div id="inputImgDisplayTop">
                            <div id="imgInputClose">
                              <img
                                src={"./icons8-close-50.png"}
                                alt=""
                                onClick={() => {
                                  setDisplaySend(false)
                                }}
                              />
                            </div>
                            <p>Send Photo</p>
                            <img
                              id="imgInputSetting"
                              src={"./settings.png"}
                              alt=""
                            />
                          </div>
                          <div id="inputImgimg">
                            {" "}
                            <img
                              src={
                                inputImgUrl ? inputImgUrl : "./blank_photo.png"
                              }
                              alt=""
                            />
                          </div>
                          <div id="inputImgDisplayBottom">
                            <input
                              type="text"
                              id="fileUploadCommentaryInput"
                              placeholder="Add a caption..."
                              value={currentChatComentary}
                              onChange={(event) => {
                                let target = event.target as HTMLInputElement
                                setCurrentChatComentary(target.value)
                              }}
                              onKeyDown={async (event) => {
                                let target = event.target as HTMLInputElement
                                if (event.key == "Enter") {
                                  if (!target.value) {
                                    return
                                  }
                                  let mainInfo = await createMsgObjectForFiles()
                                  universalChatManipulationFunction(
                                    mainInfo,
                                    "add"
                                  )
                                  setCurrentChatComentary("")
                                  setDisplaySend(false)
                                }
                              }}
                            />
                            <div
                              id="inputImgSend"
                              onClick={async () => {
                                let mainInfo = await createMsgObjectForFiles()
                                universalChatManipulationFunction(
                                  mainInfo,
                                  "add"
                                )

                                setCurrentChatComentary("")
                                setDisplaySend(false)
                              }}
                            >
                              SEND
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        id="inputImgShowBackground"
                        style={
                          displaySend
                            ? { display: "flex" }
                            : { display: "none" }
                        }
                      >
                        <div id="inputImgDisplay">
                          <div id="inputImgDisplayTop">
                            <div id="imgInputClose">
                              <img
                                src={"./icons8-close-50.png"}
                                alt=""
                                onClick={() => {
                                  setDisplaySend(false)
                                }}
                              />
                            </div>
                            <p>Send File</p>
                            <img
                              id="imgInputSetting"
                              src={"./settings.png"}
                              alt=""
                            />
                          </div>
                          <div id="inputImgimg">
                            {" "}
                            <img src={"./icons8-file-48.png"} alt="" />
                            <p>
                              {inputImgType}
                              {inputImgName}
                              {inputImgSize}
                            </p>
                          </div>
                          <div id="inputImgDisplayBottom">
                            <input
                              type="text"
                              placeholder="Add a caption..."
                              value={currentChatComentary}
                              onChange={(event) => {
                                let target = event.target as HTMLInputElement
                                setCurrentChatComentary(target.value)
                              }}
                              onKeyDown={async (event) => {
                                let target = event.target as HTMLInputElement
                                if (event.key == "Enter") {
                                  if (!target.value) {
                                    return
                                  }
                                  let mainInfo = await createMsgObjectForFiles()
                                  universalChatManipulationFunction(
                                    mainInfo,
                                    "add"
                                  )
                                  setCurrentChatComentary("")
                                  setDisplaySend(false)
                                }
                              }}
                            />
                            <div id="inputImgSend">SEND</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    id="userInterfaceChatMainInputBar"
                    className="h-60"
                    style={
                      userStatus == "admin"
                        ? { display: "flex" }
                        : { display: "none" }
                    }
                  >
                    <div id="userInterfaceChatMainInputLine">
                      <div id="userInterfaceChatMainInputSmile">
                        {" "}
                        <img
                          onMouseEnter={() => {
                            setSmileBarMouseEnter(true)
                          }}
                          onClick={() => {
                            if (smileBarClick) {
                              setSmileBarMouseEnter(false)
                              setSmileBarClick(!smileBarClick)
                            } else {
                              setSmileBarClick(!smileBarClick)
                            }
                          }}
                          onMouseLeave={() => {
                            setSmileBarMouseEnter(false)
                          }}
                          src={
                            smileBarClick || smileBarMouseEnter
                              ? `./inputSmileBlue.png`
                              : `./inputSmile.png`
                          }
                        />
                        {smileBarClick || smileBarMouseEnter ? (
                          <div id="userInterfaceChatMainInputSmileMainScreen">
                            <div id="smilesGroupsDiv">
                              {smileGroups.map((smileGroup) => {
                                return <img src={smileGroup.mainSmile} alt="" />
                              })}
                            </div>
                            <div id="smilesSearchDiv">some search</div>
                            {smileGroups.map((smileGroup) => {
                              return (
                                <div id="smilesWholeGroupDiv">
                                  <div id="smilesGroupNameDiv">
                                    {smileGroup.name}
                                  </div>
                                  <div id="smilesGroupSmilesDiv">
                                    {smileGroup.smiles.map((unoSmile) => {
                                      return (
                                        <div
                                          id="theSmile"
                                          onClick={() => {
                                            let text =
                                              currentChatComentary +
                                              `${unoSmile.symbol}`
                                            setCurrentChatComentary(text)
                                            document
                                              .getElementById(
                                                "userInterfaceChatMainInputTextInput"
                                              )
                                              ?.focus()
                                          }}
                                        >
                                          {unoSmile.symbol}
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        ) : undefined}
                      </div>
                      <div id="userInterfaceChatMainInputText">
                        <input
                          id="userInterfaceChatMainInputTextInput"
                          type="text"
                          value={currentChatComentary}
                          onChange={(event) => {
                            let target = event.target as HTMLInputElement
                            setCurrentChatComentary(target.value)
                          }}
                          onKeyDown={async (event) => {
                            let target = event.target as HTMLInputElement
                            if (event.key == "Enter") {
                              if (!target.value) {
                                return
                              }

                              let mainInfo: addMsgType = {
                                type: "add",
                                img: "",
                                comentary: target.value,
                                emotions: [],
                                time: String(new Date().getTime()),
                                pinned: false,
                                author: userFindName,
                              }

                              await universalChatManipulationFunction(
                                mainInfo,
                                "add"
                              )
                            }
                          }}
                          placeholder="Message"
                        />
                      </div>
                      <div id="userInterfaceChatMainInputFile">
                        <input
                          type="file"
                          id="fileUploadInput"
                          onChange={async (event) => {
                            await onImageChooseForInput(event)
                            setDisplaySend(true)
                          }}
                        />
                        <label htmlFor="fileUploadInput">
                          <img src={`./fileInput.png`} />
                        </label>
                      </div>
                    </div>
                    <div
                      id="userInterfaceChatMainInputVoice"
                      onClick={() => {
                        if (
                          microphonePermissionState === "granted" &&
                          !isRecording
                        ) {
                          handleClickStartRecord()
                        }
                      }}
                      // onClick={() => {
                      //   setCurrentChatMsgsList((prevItems) => [
                      //     ...prevItems,
                      //     {
                      //       img: "https://res.cloudinary.com/dy9emuyvs/image/upload/v1691776582/uddsi7lqdr2dw6xc23cv.png",
                      //       comentary: "fat",
                      //       emotions: [
                      //         { name: "laughface", count: 1 },
                      //         { name: "angryface", count: 3 },
                      //       ],
                      //     },
                      //   ])
                      // }}
                    >
                      <img src={`./microphone.png`} />
                    </div>
                    {/* <AudioRecorder
                        onRecordingComplete={addAudioElement}
                        downloadOnSavePress={false}
                        downloadFileExtension="mp3"
                        // classes={}
                      /> */}
                    {/* <div id="givePermission">
                        <audio src={getAudioRef()} controls></audio>
                      </div> */}
                    {/* const [inputImgUrl, setInputImgUrl] = useState("")
                  const [inputImg, setInputImg] = useState<File | null>(null)
                      const [showInputImg, setShowInputImg] = useState(false) */}
                    {mutedTableOpen ? (
                      <div id="inputImgShowBackground">
                        <div id="notificationSetDiv">
                          <div id="notificationSetDivHeader">
                            <img src={currentChatImgSrc} alt="" /> Notifications
                          </div>

                          <div
                            id="notificationSetDivTimer"
                            onClick={() => {
                              setNotificationInterval("3600000")
                            }}
                          >
                            <div
                              id="notificationSetDivCircle"
                              style={
                                notificationInterval == "3600000"
                                  ? {
                                      backgroundColor: "#3390ec",
                                      borderColor: "#3390ec",
                                    }
                                  : { display: "flex" }
                              }
                            >
                              <div></div>
                            </div>
                            For 1 Hour
                          </div>
                          <div
                            id="notificationSetDivTimer"
                            onClick={() => {
                              setNotificationInterval("14400000")
                            }}
                          >
                            <div
                              id="notificationSetDivCircle"
                              style={
                                notificationInterval == "14400000"
                                  ? {
                                      backgroundColor: "#3390ec",
                                      borderColor: "#3390ec",
                                    }
                                  : { display: "flex" }
                              }
                            >
                              <div></div>
                            </div>
                            For 4 Hour
                          </div>
                          <div
                            id="notificationSetDivTimer"
                            onClick={() => {
                              setNotificationInterval("28800000")
                            }}
                          >
                            <div
                              id="notificationSetDivCircle"
                              style={
                                notificationInterval == "28800000"
                                  ? {
                                      backgroundColor: "#3390ec",
                                      borderColor: "#3390ec",
                                    }
                                  : { display: "flex" }
                              }
                            >
                              <div></div>
                            </div>
                            For 8 Hour
                          </div>
                          <div
                            id="notificationSetDivTimer"
                            onClick={() => {
                              setNotificationInterval("86400000")
                            }}
                          >
                            <div
                              id="notificationSetDivCircle"
                              style={
                                notificationInterval == "86400000"
                                  ? {
                                      backgroundColor: "#3390ec",
                                      borderColor: "#3390ec",
                                    }
                                  : { display: "flex" }
                              }
                            >
                              <div></div>
                            </div>
                            For 1 Day
                          </div>
                          <div
                            id="notificationSetDivTimer"
                            onClick={() => {
                              setNotificationInterval("259200000")
                            }}
                          >
                            <div
                              id="notificationSetDivCircle"
                              style={
                                notificationInterval == "259200000"
                                  ? {
                                      backgroundColor: "#3390ec",
                                      borderColor: "#3390ec",
                                    }
                                  : { display: "flex" }
                              }
                            >
                              <div></div>
                            </div>
                            For 3 Days
                          </div>
                          <div
                            id="notificationSetDivTimer"
                            onClick={() => {
                              setNotificationInterval("permanent")
                            }}
                          >
                            <div
                              id="notificationSetDivCircle"
                              style={
                                notificationInterval == "permanent"
                                  ? {
                                      backgroundColor: "#3390ec",
                                      borderColor: "#3390ec",
                                    }
                                  : { display: "flex" }
                              }
                            >
                              <div></div>
                            </div>
                            Forever
                          </div>
                          <div id="notificationSetDivFooter">
                            <p
                              onClick={() => {
                                setMutedTableOpen(false)
                              }}
                            >
                              CANCEL
                            </p>
                            <p
                              onClick={() => {
                                let info: {
                                  type: "mute"
                                  time: string
                                } = {
                                  type: "mute",
                                  time: notificationInterval,
                                }
                                universalChatManipulationFunction(info, "mute")
                                setMutedTableOpen(false)
                              }}
                            >
                              MUTE
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : undefined}
                    {inputImgType == "image" ? (
                      <div
                        id="inputImgShowBackground"
                        style={
                          displaySend
                            ? { display: "flex" }
                            : { display: "none" }
                        }
                      >
                        <div id="inputImgDisplay">
                          <div id="inputImgDisplayTop">
                            <div id="imgInputClose">
                              <img
                                src={"./icons8-close-50.png"}
                                alt=""
                                onClick={() => {
                                  setDisplaySend(false)
                                }}
                              />
                            </div>
                            <p>Send Photo</p>
                            <img
                              id="imgInputSetting"
                              src={"./settings.png"}
                              alt=""
                            />
                          </div>
                          <div id="inputImgimg">
                            {" "}
                            <img
                              src={
                                inputImgUrl ? inputImgUrl : "./blank_photo.png"
                              }
                              alt=""
                            />
                          </div>
                          <div id="inputImgDisplayBottom">
                            <input
                              type="text"
                              id="fileUploadCommentaryInput"
                              placeholder="Add a caption..."
                              value={currentChatComentary}
                              onChange={(event) => {
                                let target = event.target as HTMLInputElement
                                setCurrentChatComentary(target.value)
                              }}
                              onKeyDown={async (event) => {
                                let target = event.target as HTMLInputElement
                                if (event.key == "Enter") {
                                  if (!target.value) {
                                    return
                                  }
                                  let mainInfo = await createMsgObjectForFiles()
                                  universalChatManipulationFunction(
                                    mainInfo,
                                    "add"
                                  )
                                  setCurrentChatComentary("")
                                  setDisplaySend(false)
                                }
                              }}
                            />
                            <div
                              id="inputImgSend"
                              onClick={async () => {
                                let mainInfo = await createMsgObjectForFiles()
                                universalChatManipulationFunction(
                                  mainInfo,
                                  "add"
                                )

                                setCurrentChatComentary("")
                                setDisplaySend(false)
                              }}
                            >
                              SEND
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        id="inputImgShowBackground"
                        style={
                          displaySend
                            ? { display: "flex" }
                            : { display: "none" }
                        }
                      >
                        <div id="inputImgDisplay">
                          <div id="inputImgDisplayTop">
                            <div id="imgInputClose">
                              <img
                                src={"./icons8-close-50.png"}
                                alt=""
                                onClick={() => {
                                  setDisplaySend(false)
                                }}
                              />
                            </div>
                            <p>Send File</p>
                            <img
                              id="imgInputSetting"
                              src={"./settings.png"}
                              alt=""
                            />
                          </div>
                          <div id="inputImgimg">
                            {" "}
                            <img src={"./icons8-file-48.png"} alt="" />
                            <p>
                              {inputImgType}
                              {inputImgName}
                              {inputImgSize}
                            </p>
                          </div>
                          <div id="inputImgDisplayBottom">
                            <input
                              type="text"
                              placeholder="Add a caption..."
                              value={currentChatComentary}
                              onChange={(event) => {
                                let target = event.target as HTMLInputElement
                                setCurrentChatComentary(target.value)
                              }}
                              onKeyDown={async (event) => {
                                let target = event.target as HTMLInputElement
                                if (event.key == "Enter") {
                                  if (!target.value) {
                                    return
                                  }
                                  let mainInfo = await createMsgObjectForFiles()
                                  universalChatManipulationFunction(
                                    mainInfo,
                                    "add"
                                  )
                                  setCurrentChatComentary("")
                                  setDisplaySend(false)
                                }
                              }}
                            />
                            <div id="inputImgSend">SEND</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div
              id="userInterfaceChatInfo"
              className={`${
                showDiscription ? "backDiscription" : "rightDiscription"
              }`}
            >
              <div id="userInterfaceChatInfoHeader">
                <div className="wide">
                  <img
                    src="./icons8-close-50.png"
                    alt=""
                    onClick={() => {
                      setShowDiscription(false)
                      console.log(showDiscription)
                    }}
                  />
                  <p>{`${
                    currentChatType == "chat" ? "user" : currentChatType
                  } Info`}</p>
                </div>
                <img src="././icons8-edit-50.png" alt="" />
              </div>
              <div id="userInterfaceChatInfoPhoto">
                <img src={currentChatImgSrc} alt="" />
                <h1>{currentChatName}</h1>
                {currentChatType == "chat" ? (
                  <p>{
                    // ${currentChatLastSeen}
                    `currentChatLastSeen`
                  }</p>
                ) : (
                  <p>{`${currentChatSubs} subscribers`}</p>
                )}
              </div>
              <div id="userInterfaceChatInfoOptions">
                {currentChatType == "chat" ? (
                  currentChatKnownPhone ? (
                    <div id="commonOption">
                      <img src="" alt="" />
                      <div>
                        <h1>{currentChatKnownPhone}</h1>
                        <p>Phone</p>
                      </div>
                    </div>
                  ) : undefined
                ) : undefined}
                {currentChatType == "chat" ? (
                  <div id="commonOption">
                    <img src="" alt="" />
                    <div>
                      <h1>{currentChatUserName}</h1>
                      <p>Username</p>
                    </div>
                  </div>
                ) : undefined}
                {currentChatType == "chat" ? (
                  currentChatBio ? (
                    <div id="commonOption">
                      <img src="" alt="" />
                      <div>
                        <h1>{currentChatBio}</h1>
                        <p>Bio</p>
                      </div>
                    </div>
                  ) : undefined
                ) : undefined}
                {currentChatType == "chanell" ? (
                  <>
                    <div id="commonOption">
                      <img src="" alt="" />
                      <div>
                        <h1>{currentChatDiscription}</h1>
                        <p>Info</p>
                      </div>
                    </div>
                    <div id="commonOption">
                      <img src="" alt="" />
                      <div>
                        <a
                          href={`${process.env.REACT_APP_MAIN_DOMAIN}/addTo/${currentChatLink}/${currentChatType}`}
                        >
                          {`${process.env.REACT_APP_MAIN_DOMAIN}/addTo/${currentChatLink}/${currentChatType}`}
                        </a>
                        <p>Link</p>
                      </div>
                    </div>
                  </>
                ) : undefined}
                <div id="unCommonOption">
                  <div>
                    <img src="" alt="" />
                    <h1>Notifications</h1>
                  </div>
                  <img src="" alt="" />
                </div>
                <div id="userInterfaceChatInfoLinks">all Links</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </div> */}
    </>
  )
}
