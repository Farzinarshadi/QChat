import { useEffect, useState } from 'react'
import '../../assets/css/ChatSideBar/ChatSideBar.css'
import tick from '../../assets/images/blue tick.png'
import { API_URL, privateApi, publicApi } from '../../config/Base'
import { Link } from 'react-router-dom'


export default function ChatSideBar() {

    const [Groups, setGroups] = useState([])

    useEffect(() => {
        privateApi.get('/chat/get_groups/')
            .then((response) => {
                setGroups(response.data)
            })
            .catch((error) => {
                console.log(error.response.data.error)
            })
    }, [])

    return (
        <div className="chat-sidebar-main flex-jc-start">
            {
                Groups && Groups?.length > 0 ? (
                    Groups?.map((item) => (
                        <Link to={`/Group/${item?.id}/`} className='chat-sidebar-item flex-jc-start'>
                            <img src={API_URL + item?.image} className='chat-sidebar-item-image' />
                            <div className="sidebar-chat-name-text felx-jc-cebter">
                                {
                                    item.verify ? (
                                        <>
                                            <div className="name-and-member-count-flex flex-center">
                                                <div className="chat-item-name flex-jc-start">{item?.name}</div>
                                                <img src={tick} className='blue-tick flex-center' />
                                            </div>
                                            <div className="chat-item-followers flex-jc-start">{item?.chat_members_count} Member</div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="chat-item-name flex-jc-start">{item?.name}</div>
                                            <div className="chat-item-followers flex-jc-start">{item?.chat_members_count} Member</div>
                                        </>
                                    )
                                }

                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="not-found flex-center">Not Found Group</div>
                )
            }
        </div>
    )
}