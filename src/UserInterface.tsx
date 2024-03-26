import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
export function UserInterface() {
  const [chatsList, setChatsList] = useState(["", "", ""])
  const [msgsList, setMsgsList] = useState(["", "", "", "", "", ""])
  const [searchParams, setSearchParams] = useSearchParams()
  const username = searchParams.get("username")
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
