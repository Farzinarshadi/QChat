import { useEffect, useState } from 'react'
import '../../assets/css/ChatSideBar/ChatSideBar.css'
import tick from '../../assets/images/blue tick.png'
import { API_URL, privateApi } from '../../config/Base'
import { Link, NavLink } from 'react-router-dom'
import default_image from '../../assets/images/profile.png'

export default function ChatSideBar({ Chats, Type }) {
    const userId = parseInt(localStorage.getItem('user_id'))
    const [User, setUser] = useState()

    useEffect(() => {
        privateApi.get('/auth/get_user/' + userId + '/')
            .then((response) => {
                setUser(response.data)
            })
            .catch((error) => {
                console.log(error.response.data.error)
            })
    }, [])

    return (
        <div className="chat-sidebar-main flex-jc-start">
            <div className="change-sidebar-section flex-center">
                <NavLink
                    to='/'
                    className={({ isActive, isPending }) =>
                        isPending
                            ? "change-sidebar-item flex-center"
                            : isActive
                                ? "change-sidebar-item flex-center active"
                                : "change-sidebar-item flex-center"
                    }
                >
                    Groups
                </NavLink>
                <NavLink
                    to='/PrivateChat/'
                    className={({ isActive, isPending }) =>
                        isPending
                            ? "change-sidebar-item flex-center"
                            : isActive
                                ? "change-sidebar-item flex-center active"
                                : "change-sidebar-item flex-center"
                    }
                >
                    Private
                </NavLink>
            </div>

            <div className="chat-sliderbar-items">

                {Chats && Chats.length > 0 ? (
                    Type === 'group' ? (
                        Chats.map((item) => (
                            <Link
                                to={`/Group/${item?.id}/`}
                                className='chat-sidebar-item flex-jc-start'
                                key={item.id}
                            >
                                <img src={item?.image ? API_URL + item?.image : default_image} className='chat-sidebar-item-image' />
                                <div className="sidebar-chat-name-text felx-jc-cebter">
                                    <div className="name-and-member-count-flex flex-center">
                                        <div className="chat-item-name flex-jc-start">{item?.name}</div>
                                        {item.verify && <img src={tick} className='blue-tick flex-center' />}
                                    </div>
                                    <div className="chat-item-followers flex-jc-start">
                                        {item?.chat_members_count} Member
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        Chats.map((item) => {
                            const isSender = String(userId) === String(item.sender)
                            const chatUserName = isSender ? item.reciver_name : item.sender_name
                            const chatUserImage = isSender ? item.reciver_image : item.sender_image
                            const chatUserId = isSender ? item.reciver : item.sender

                            return (
                                <Link
                                    to={`/Friend/${userId}/${chatUserId}/`}
                                    className='chat-sidebar-item flex-jc-start'
                                    key={item.id}
                                >
                                    <img src={chatUserImage ? API_URL + chatUserImage : default_image} className='chat-sidebar-item-image' />
                                    <div className="sidebar-chat-name-text">
                                        <div className="name-and-member-count-flex flex-center">
                                            <div className="chat-item-name flex-jc-start">{chatUserName}</div>
                                            <span className='is-online'></span>
                                            {item.verify && <img src={tick} className='blue-tick flex-center' />}
                                        </div>
                                        <div className="user-profile-online">
                                            <span>
                                                {item?.message?.split(" ").slice(0, 5).join(" ")}
                                                {item?.message?.split(" ").length > 5 ? "..." : ""}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })
                    )
                ) : (
                    <div className="not-found flex-center">Not Found</div>
                )}
            </div>

            {/* Profile Section */}
            <div className="user-profile-section flex-jc-start">
                <img src={User?.custom_profile?.image ? API_URL + User?.custom_profile?.image : default_image} className='user-profile-img' />
                <div className="name-and-online-flex">
                    <div className="user-profile-name">{User?.username}</div>
                    <div className="user-profile-online flex-jc-start">
                        <span>is online</span>
                        <span className='is-online active'></span>
                    </div>
                </div>
            </div>

        </div>
    )
}