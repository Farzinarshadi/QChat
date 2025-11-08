import { useEffect, useState } from 'react'
import '../../assets/css/Chat/ChatInfo.css'
import { API_URL, privateApi } from '../../config/Base'
import default_image from '../../assets/images/profile.png'
import { IoMdClose } from "react-icons/io";
import Loading from '../../components/Loading/Loading'


function ChatInfo({ data, type, setOpenChatInfo }) {
    const [username, setusername] = useState(null)
    const [image, setimage] = useState(null)
    const [bio, setbio] = useState(null)
    const [title, setTitle] = useState('')
    const [IsLoading, setIsLoading] = useState(false)


    useEffect(() => {
        setIsLoading(true)
        if (type === 'private_chat') {
            setTitle('User Info')
            privateApi.get('/auth/get_user_with_id/' + data + '/')
                .then((response) => {
                    setusername(response.data.username)
                    setimage(response.data.custom_profile.image)
                    setbio(response.data.custom_profile.bio)
                })
                .catch((error) => {
                    console.log(error.response?.data?.error)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        } else if (type === 'public_group') {
            setTitle('Group Info')

            privateApi.get('/chat/get_group/' + data + '/')
                .then((response) => {
                    setusername(response.data.name)
                    setimage(response.data.image)
                    setbio(response.data.bio)
                })
                .catch((error) => {
                    console.log(error.response?.data?.error)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }, [type, data])

    return (
        <>
            {
                IsLoading ? (
                    <Loading />
                ) : (
                    <>
                        {/* Close Section */}
                        <div className="close-section">
                            <div className="close-title">{title}</div>
                            <div className='close-icons flex-center'>
                                <IoMdClose
                                    className='close-icon flex-center'
                                    onClick={() => setOpenChatInfo(false)}
                                />
                            </div>
                        </div>

                        <div className="chat-info-main">
                            <img
                                src={image ? API_URL + image : default_image}
                                className='chat-info-image'
                            />
                            <div className="chat-info-username-bio flex-center">
                                <div className="chat-info-username-sec flex-jc-start">
                                    <span>{username}</span>
                                </div>
                                <div className="chat-info-bio-sec flex-jc-start">
                                    <pre>{bio}</pre>
                                </div>
                            </div>
                        </div>
                    </>
                )
            }
        </>
    )
}

export default ChatInfo
