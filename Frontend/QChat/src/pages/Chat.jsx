import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import ChatSideBar from '../components/Chat/ChatSideBar'
import { useEffect, useState } from 'react'
import { API_URL, privateApi } from '../config/Base'
import '../assets/css/Chat/Chat.css'
import send from '../assets/images/paper-plane.png'
import emojy from '../assets/images/happiness.png'
import eyes from '../assets/images/eyes.png'
import default_image from '../assets/images/profile.png'
import UserInfo from '../components/Chat/UserInfo'
import ChatInfo from '../components/Chat/ChatInfo'
import Loading from '../components/Loading/Loading'
import { FaArrowLeft } from "react-icons/fa6";
import InputSec from '../components/Chat/InputSec'



export default function Chat() {

    function getTextDirection(text) {
        const firstLetter = text.trim()[0];
        if (!firstLetter) return 'ltr';
        return /[\u0600-\u06FF]/.test(firstLetter) ? 'rtl' : 'ltr';
    }

    const { id, sender } = useParams()
    const [Group, setGroup] = useState(null)
    const [ShowEmojy, setShowEmojy] = useState(false)
    const [InputValue, setInputValue] = useState('')
    const [Messages, setMessages] = useState([])
    const [userId, setuserId] = useState(null)
    const [OpenUserInfo, setOpenUserInfo] = useState(null)
    const [ChatCurrentUser, setChatCurrentUser] = useState(null)
    const [OpenChatInfo, setOpenChatInfo] = useState(false)
    const location = useLocation()
    const send_navigate = useNavigate()
    const [showSidebar, setShowSidebar] = useState(window.innerWidth > 800);
    const isChatRoute = location.pathname.startsWith('/Group/') || location.pathname.startsWith('/Friend/');
    const [IsIsLoading, setIsLoading] = useState(false)


    const [Chats, setChats] = useState([])

    const [socket, setsocket] = useState(null)

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 800) {
                setShowSidebar(true);
            } else {
                if (location.pathname.startsWith('/Group/') || location.pathname.startsWith('/Friend/')) {
                    setShowSidebar(false)
                } else {
                    setShowSidebar(true)
                }
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [location.pathname]);

    useEffect(() => {
        if (window.innerWidth <= 800) {
            if (location.pathname.startsWith('/Group/') || location.pathname.startsWith('/Friend/')) {
                setShowSidebar(false);
            } else {
                setShowSidebar(true);
            }
        } else {
            setShowSidebar(true);
        }
    }, [location.pathname]);


    useEffect(() => {
        document.title = 'QChat - Groups'
    })

    useEffect(() => {
        setIsLoading(true)
        privateApi.get('/auth/get_user/')
            .then((response) => {
                setuserId(response.data.id)
            })
            .catch((error) => {
                console.log(error.response.data.error)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])


    useEffect(() => {
        if (!id || !sender) return;

        const ws = new WebSocket(`wss://localhost:8000/ws/group/${sender}/${id}/`)

        ws.onopen = () => {
            console.log('success websocket')
        }

        ws.onclose = () => {
            console.log('lose closed')
        }

        ws.onmessage = (e) => {
            const data = JSON.parse(e.data)
            console.log('newww', data.message)
            setMessages((prev) => [...prev, {
                id: data.id,
                message: data.message,
                sender: data.sender,
                chat: data.chat,
                is_read: data.is_read,
                sender_name: data.sender_name,
                sender_image: data.sender_image,
            }])
        }

        setsocket(ws)

        return () => ws.close()
    }, [id, sender])



    const HandleSendRequest = () => {
        if (socket && InputValue.trim()) {
            socket.send(JSON.stringify({
                message: InputValue,
                user: sender,
                sender: sender,
                reciver: id,
                is_read: false
            }))
            setInputValue('')
        }
    }


    useEffect(() => {
        setIsLoading(true)
        privateApi.get('/chat/get_groups/')
            .then((response) => {
                setChats(response.data)
            })
            .catch((error) => {
                console.log(error.response.data.error)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])


    useEffect(() => {
        if (!id) return;
        setIsLoading(true)
        privateApi.get('/chat/get_group/' + id + '/')
            .then((response) => {
                setGroup(response.data)
            })
            .catch((error) => {
                console.log(error.response.data.error)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [id])

    useEffect(() => {
        if (!id) return;
        setIsLoading(true)
        privateApi.get('/chat/get_group_messages/' + id + '/')
            .then((response) => {
                console.log('asdsad', response.data)
                setMessages(response.data)
            })
            .catch((error) => {

            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [id])

    useEffect(() => {
        const chatContainer = document.querySelector('.chat-messages-sec');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [Messages]);


    const HandleOpenUserInfo = (userId) => {
        setOpenUserInfo(true)
        setChatCurrentUser(userId)
    }


    return (
        <div className="home-main flex-center">
            <div className='chat-sec flex-center'>
                {
                    // IsLoading
                    IsIsLoading ? (
                        <Loading />
                    ) : (
                        <>

                            {/* Chat Side Bar */}
                            {showSidebar && <ChatSideBar Chats={Chats} Type='group' setShowSidebar={setShowSidebar} />}

                            {/* Open Group Info */}
                            {OpenChatInfo && (
                                <>
                                    <div className="shadow" onClick={() => setOpenChatInfo(false)}></div>
                                    <div className="fixed-box">
                                        <ChatInfo data={Group?.id} type="public_group" setOpenChatInfo={setOpenChatInfo} />
                                    </div>
                                </>
                            )}

                            {/* Open User Info */}
                            {OpenUserInfo && (
                                <>
                                    <div className="shadow" onClick={() => setOpenUserInfo(false)}></div>
                                    <div className="fixed-box">
                                        <UserInfo userId={ChatCurrentUser} setOpenUserInfo={setOpenUserInfo} />
                                    </div>
                                </>
                            )}

                            {/* Chat Main */}
                            {(isChatRoute || window.innerWidth > 800) && (
                                <div className="chat-main flex-jc-start">
                                    {!Group && window.innerWidth > 800 ? (
                                        <div className="select-chat">Select a chat from sidebar</div>
                                    ) : Group ? (
                                        <>
                                            {/* Chat Info */}
                                            <div className="chat-info-section flex-jc-start">
                                                {window.innerWidth <= 800 && (
                                                    <FaArrowLeft
                                                        className='back-icon'
                                                        onClick={() => send_navigate('/')}
                                                    />
                                                )}
                                                <div className="chat-info-flex flex-jc-start" onClick={() => setOpenChatInfo(true)}>
                                                    <img src={Group?.image ? API_URL + Group?.image : default_image} className='chat-profile' />
                                                    <div className="chat-name-text felx-jc-cebter">
                                                        <div className="chat-name flex-jc-start">{Group?.name}</div>
                                                        <div className="chat-followers flex-jc-start">{Group?.chat_members_count} Member</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Chat Messages */}
                                            <div className="chat-messages-sec">
                                                {Messages.map((item) => (
                                                    <div key={item.id} className={`chat-message-item-sec-flex ${userId == item.sender ? 'sender' : 'reciver'}`}>
                                                        <img
                                                            src={item?.sender_image ? API_URL + item?.sender_image : default_image}
                                                            className='chat-message-item-image'
                                                            onClick={() => HandleOpenUserInfo(item?.sender)}
                                                        />
                                                        <div className="chat-message-item-sec">
                                                            <div className="chat-message-item">
                                                                <span className='message-sender-name' onClick={() => HandleOpenUserInfo(item?.sender)}>
                                                                    {item?.sender_name}
                                                                </span>
                                                                <span className="message-text" style={{ direction: getTextDirection(item.message) }}>
                                                                    {item.message}
                                                                </span>
                                                                <div className="is_read">
                                                                    {item.is_read ? (
                                                                        <img src={eyes} className='seen-icon flex-center' />
                                                                    ) : (
                                                                        <span></span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Input Sec */}
                                            <InputSec InputValue={InputValue} setInputValue={setInputValue} ShowEmojy={ShowEmojy} setShowEmojy={setShowEmojy} HandleSendWebsocket={HandleSendRequest} />

                                        </>
                                    ) : null}
                                </div>
                            )}
                        </>
                    )
                }
            </div>
        </div>
    );
}