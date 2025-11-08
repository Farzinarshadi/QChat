import { useNavigate, useParams } from 'react-router-dom'
import ChatSideBar from '../components/Chat/ChatSideBar'
import { useEffect, useState } from 'react'
import { API_URL, privateApi } from '../config/Base'
import '../assets/css/Chat/Chat.css'
import send from '../assets/images/paper-plane.png'
import emojy from '../assets/images/happiness.png'
import eyes from '../assets/images/eyes.png'
import default_image from '../assets/images/profile.png'
import ChatInfo from '../components/Chat/ChatInfo'
import { FaArrowLeft } from "react-icons/fa6";
import InputSec from '../components/Chat/InputSec'
import Loading from '../components/Loading/Loading'


export default function PrivateChat() {

    function getTextDirection(text) {
        const firstLetter = text.trim()[0];
        if (!firstLetter) return 'ltr';
        return /[\u0600-\u06FF]/.test(firstLetter) ? 'rtl' : 'ltr';
    }

    const { sender, reciver } = useParams()

    const [OpenChatInfo, setOpenChatInfo] = useState(false)

    const [UserName, setUserName] = useState(null)
    const [UserImage, setUserImage] = useState(null)
    const [UserOnline, setUserOnline] = useState(null)
    const [ShowEmojy, setShowEmojy] = useState(false)
    const [InputValue, setInputValue] = useState('')
    const [Messages, setMessages] = useState([])
    const [userId, setuserId] = useState(null)
    const send_navigate = useNavigate()
    const [IsIsLoading, setIsLoading] = useState(false)


    const [showSidebar, setShowSidebar] = useState(window.innerWidth > 800);
    const isChatRoute = location.pathname.startsWith('/Group/') || location.pathname.startsWith('/Friend/');

    const [Chats, setChats] = useState([])

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
        document.title = 'QChat - Private Chat'
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
        setIsLoading(true)
        privateApi.get('/chat/get_inbox_messages/')
            .then((response) => {
                setChats(response.data)
                console.log("a", response.data)
            })
            .catch((error) => {
                console.log(error.response.data.error)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])

    useEffect(() => {
        setIsLoading(true)
        privateApi.get('/chat/get_messages/' + sender + '/' + reciver + '/')
            .then((response) => {
                const data = response.data;
                if (data.length > 0) {
                    setMessages(data);
                    if (data[0].sender === userId) {
                        setUserName(data[0].reciver_name);
                        setUserImage(data[0].reciver_image);
                        setUserOnline(data[0].reciver_online);
                    } else {
                        setUserName(data[0].sender_name);
                        setUserImage(data[0].sender_image);
                        setUserOnline(data[0].sender_online);
                    }
                } else {
                    setMessages([]);
                }
            })
            .catch((error) => console.log(error.response?.data?.error))
            .finally(() => {
                setIsLoading(false)
            })
    }, [sender, reciver, userId]);



    const [socket, setSocket] = useState(null);

    useEffect(() => {
        if (!sender || !reciver) return;

        const ws = new WebSocket(`wss://localhost:8000/ws/chat/${sender}/${reciver}/`);

        ws.onopen = () => {
        };

        ws.onmessage = (e) => {
            const data = JSON.parse(e.data);

            setMessages((prev) => [...prev, {
                id: data.id,
                message: data.message,
                sender: data.sender,
                reciver: data.reciver,
                is_read: data.is_read,
            }]);
        };

        ws.onclose = () => {
        };

        setSocket(ws);

        return () => ws.close();
    }, [sender, reciver]);


    const HandleSendWebsocket = () => {
        if (socket && InputValue.trim()) {
            socket.send(JSON.stringify({
                message: InputValue,
                user: sender,
                sender: sender,
                reciver: reciver,
                is_read: false
            }));
            setInputValue('');
        }
    }

    const HandleOpenChatInfo = () => {
        setOpenChatInfo(true)
    }

    useEffect(() => {
        if (!UserName) {
            setIsLoading(true)

            privateApi.get(`/auth/get_user_with_id/${reciver}/`)
                .then((res) => {
                    setUserName(res.data.username);
                    setUserImage(res.data.custom_profile?.image || null);
                })
                .catch((err) => console.log(err.response?.data?.error))
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }, [reciver, UserName]);

    useEffect(() => {
        const chatContainer = document.querySelector('.chat-messages-sec');
        if (chatContainer) {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    }, [Messages]);


    return (
        <div className="home-main flex-center">
            <div className='chat-sec flex-center'>
                {
                    IsIsLoading ? (
                        <Loading />
                    ) : (
                        <>
                            {/* Chat Side Bar */}
                            {showSidebar && <ChatSideBar Chats={Chats} Type='private' setShowSidebar={setShowSidebar} />}

                            {
                                OpenChatInfo && (
                                    <>
                                        <div className="shadow" onClick={() => setOpenChatInfo(false)}></div>
                                        <div className="fixed-box">
                                            <ChatInfo data={reciver} type="private_chat" setOpenChatInfo={setOpenChatInfo} />
                                        </div>
                                    </>
                                )
                            }

                            {/* Chat Main */}
                            {(isChatRoute || window.innerWidth > 800) && (
                                <div className="chat-main flex-jc-start">
                                    {
                                        !UserName ? (
                                            <div className="select-chat">Select a chat from sidebar</div>

                                        ) : (
                                            <>
                                                {/* Chat Info */}
                                                {
                                                    < div className="chat-info-section flex-jc-start">
                                                        {window.innerWidth <= 800 && (
                                                            <FaArrowLeft
                                                                className='back-icon'
                                                                onClick={() => send_navigate('/PrivateChat/')}
                                                            />
                                                        )}
                                                        <div className="chat-info-flex flex-jc-start" onClick={HandleOpenChatInfo}>
                                                            <img src={UserImage ? API_URL + UserImage : default_image} className='chat-profile' />
                                                            <div className="chat-name-text flex-ai-start">
                                                                <div className="chat-name flex-jc-start">{UserName}</div>
                                                                <div className="chat-followers flex-jc-start">
                                                                    {UserOnline ? 'is online' : 'is offline'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }


                                                {/* Chat Messages */}
                                                <div className="chat-messages-sec">
                                                    {
                                                        Messages && Messages?.map((item) => (
                                                            <div key={item?.id} className={`chat-message-item-sec-flex ${userId == item.sender ? 'sender' : 'reciver'}`}>
                                                                <div className="chat-message-item private">
                                                                    <span
                                                                        className="message-text private"
                                                                        style={{ direction: getTextDirection(item.message) }}>{item?.message}</span>
                                                                </div>
                                                            </div>
                                                        ))
                                                    }
                                                </div>

                                                {/* Input Sec */}
                                                <InputSec InputValue={InputValue} setInputValue={setInputValue} ShowEmojy={ShowEmojy} setShowEmojy={setShowEmojy} HandleSendWebsocket={HandleSendWebsocket} />

                                            </>
                                        )

                                    }
                                </div>
                            )}
                        </>
                    )

                }
            </div >
        </div>

    )
}