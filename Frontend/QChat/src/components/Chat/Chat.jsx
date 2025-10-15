import { useParams } from 'react-router-dom'
import '../../assets/css/Chat/Chat.css'
import ChatSideBar from './ChatSideBar'
import { useEffect, useState } from 'react'
import { API_URL, privateApi } from '../../config/Base'
import send from '../../assets/images/paper-plane.png'
import emojy from '../../assets/images/happiness.png'



export default function Chat() {
    const id = useParams()
    const [Group, setGroup] = useState([])
    const [ShowEmojy, setShowEmojy] = useState(false)
    const [InputValue, setInputValue] = useState('')

    useEffect(() => {
        privateApi.get('/chat/get_group/' + id.id + '/')
            .then((response) => {
                console.log(response.data)
                setGroup(response.data)
            })
            .catch((error) => {
                console.log(error.response.data.error)
            })
    }, [id])

    return (
        <div className='chat-sec flex-center'>
            {/* Chat Side Bar */}
            <ChatSideBar />

            <div className="chat-main flex-ai-start">
                {/* Chat Info */}
                <div className="chat-info-section flex-jc-start">
                    <div className="chat-info-flex flex-center">
                        <img src={API_URL + Group?.image} className='chat-profile' />
                        <div className="chat-name-text felx-jc-cebter">
                            <div className="chat-name flex-jc-start">{Group?.name}</div>
                            <div className="chat-followers flex-jc-start">{Group?.chat_members_count} Member</div>
                        </div>
                    </div>
                </div>

                {/* Input Sec */}
                <div className="input-sec flex-jc-start">
                    <input
                        type="text"
                        className="chat-input"
                        placeholder='Write a message ...'
                        autoComplete='off'
                        onChange={(e) => setInputValue(e.target.value)}
                    />
                    {
                        InputValue && InputValue?.length > 0 ? (
                            <button className='chat-send-button flex-center'>
                                <img src={send} className='chat-send-icon' />
                            </button>
                        ) : (
                            <>
                            <div 
                                className="emojy-wrapper"
                                onMouseEnter={() => setShowEmojy(true)}
                                onMouseLeave={() => setShowEmojy(false)}
                            >
                                <button className='chat-send-button flex-center'>
                                <img src={emojy} className='chat-emojy-icon' />
                                </button>

                                {ShowEmojy && (
                                <div className="emojy-box">
                                    <div className="emojy-item flex-center">😂</div>
                                    <div className="emojy-item flex-center">😐</div>
                                    <div className="emojy-item flex-center">😭</div>
                                </div>
                                )}
                            </div>
                            </>
                        )
                    }
                </div>

            </div>

        </div>

    )
}