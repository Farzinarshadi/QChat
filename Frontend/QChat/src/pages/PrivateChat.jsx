import { useParams } from 'react-router-dom'
import ChatSideBar from '../components/Chat/ChatSideBar'
import { useEffect, useState } from 'react'
import { API_URL, privateApi } from '../config/Base'
import '../assets/css/Chat/Chat.css'
import send from '../assets/images/paper-plane.png'
import emojy from '../assets/images/happiness.png'
import eyes from '../assets/images/eyes.png'
import default_image from '../assets/images/profile.png'



export default function PrivateChat() {
    const { sender, reciver } = useParams()

    
    const [UserName, setUserName] = useState(null)
    const [UserImage, setUserImage] = useState(null)
    const [ShowEmojy, setShowEmojy] = useState(false)
    const [InputValue, setInputValue] = useState('')
    const [Messages, setMessages] = useState([])
    const userId = parseInt(localStorage.getItem('user_id'))
    
    const [Chats, setChats] = useState([])
    
    useEffect(() => {
        privateApi.get('/chat/get_inbox_messages/')
        .then((response) => {
            setChats(response.data)
            console.log("a", response.data)
        })
        .catch((error) => {
            console.log(error.response.data.error)
        })
    }, [])
    
    useEffect(() => {
        privateApi.get('/chat/get_messages/' + sender + '/' + reciver + '/')
            .then((response) => {
                console.log('m', response.data)
                if (response.data[0]?.sender === userId) {
                    setMessages(response.data)
                    setUserName(response.data[0]?.reciver_name)
                    setUserImage(response.data[0]?.reciver_image)
                } else {
                    setMessages(response.data)
                    setUserName(response.data[0]?.sender_name)
                    setUserImage(response.data[0]?.sender_image)
                }
                
            })
            .catch((error) => {
                console.log(error.response.data.error)
            })
        }, [sender, reciver])

        
        const [socket, setSocket] = useState(null);
        
        useEffect(() => {
            if (!sender || !reciver) return;
            
            const ws = new WebSocket(`ws://localhost:8000/ws/chat/${sender}/${reciver}/`);
            
            ws.onopen = () => {
                console.log('WebSocket connected ✅');
            };
            
            ws.onmessage = (e) => {
                const data = JSON.parse(e.data);
                console.log("new message:", data);
                
                setMessages((prev) => [...prev, {
                id: data.id,
                message: data.message,
                sender: data.sender,
                reciver: data.reciver,
                is_read: data.is_read,
            }]);
        };
        
        ws.onclose = () => {
            console.log('WebSocket closed');
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


    return (
        <div className="home-main flex-center">
            <div className='chat-sec flex-center'>
                {/* Chat Side Bar */}
                <ChatSideBar Chats={Chats} Type='private' />

                <div className="chat-main flex-jc-start">
                    {
                        !UserName ? (
                            <div className="select-chat">Select a chat from sidebar</div>

                        ) : (
                            <>
                                {/* Chat Info */}
                                {
                                    < div className="chat-info-section flex-jc-start">
                                        <div className="chat-info-flex flex-center">
                                            <img src={UserImage ? API_URL + UserImage : default_image} className='chat-profile' />
                                            <div className="chat-name-text felx-jc-cebter">
                                                <div className="chat-name flex-jc-start">{UserName}</div>
                                                <div className="chat-followers flex-jc-start">is offline</div>
                                            </div>
                                        </div>
                                    </div>
                                }


                                {/* Chat Messages */}
                                <div className="chat-messages-sec flex-ai-start">
                                    {
                                        Messages && Messages?.map((item) => (
                                            <div key={item.id} className={`chat-message-item-sec ${userId == item.reciver ? 'reciver' : 'sender'}`}>
                                                <div className="chat-message-item">
                                                    <span className='message-text'>{item.message}</span>
                                                    <div className="is_read">
                                                        {
                                                            item.is_read ? (
                                                                <img src={eyes} className='seen-icon flex-center' />
                                                            ) : (
                                                                <span></span>
                                                            )
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>

                                {/* Input Sec */}
                                <div className="input-sec flex-jc-start">
                                    <input
                                        type="text"
                                        className="chat-input"
                                        placeholder='Write a message ...'
                                        autoComplete='off'
                                        value={InputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                    />
                                    {
                                        InputValue && InputValue?.length > 0 ? (
                                            <button
                                                className='chat-send-button flex-center'
                                                onClick={HandleSendWebsocket}
                                            >
                                                <img src={send} className='chat-send-icon' />
                                            </button>
                                        ) : (
                                            <>
                                                <div
                                                    className="emojy-wrapper"
                                                    onMouseEnter={() => setShowEmojy(true)}
                                                    onMouseLeave={() => setShowEmojy(false)}
                                                >
                                                    <button
                                                        className='chat-send-button flex-center'
                                                    >
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
                            </>
                        )

                    }
                </div>

            </div >
        </div>

    )
}