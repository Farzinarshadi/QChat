import { useEffect, useState } from 'react'
import '../../assets/css/Chat/ChatInfo.css'
import { API_URL, privateApi } from '../../config/Base'
import default_image from '../../assets/images/profile.png'
import { IoMdClose } from "react-icons/io";
import { Link } from 'react-router-dom';
import Loading from '../../components/Loading/Loading'


function UserInfo({ userId, setOpenUserInfo }) {
    const [username, setusername] = useState(null)
    const [image, setimage] = useState(null)
    const [bio, setbio] = useState(null)
    const [title, setTitle] = useState('')
    const [Myid, setMyid] = useState(null)
    const [IsLoading, setIsLoading] = useState(false)

    useEffect(() => {
        setIsLoading(true)
        setTitle('User Info')
        privateApi.get('/auth/get_user_with_id/' + userId + '/')
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
    }, [userId])


    useEffect(() => {
        setIsLoading(true)
        privateApi.get('/auth/get_user/')
            .then((response) => {
                setMyid(response.data.id)
            })
            .catch((error) => {
                console.log(error.response?.data?.error)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])


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
                                    onClick={() => setOpenUserInfo(false)}
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
                                    <span>{bio}</span>
                                </div>
                            </div>
                        </div>

                        <Link className="send-message-button-sec flex-center" to={`/Friend/${Myid}/${userId}/`}>
                            <button className="send-message-button">Send Message</button>
                        </Link>
                    </>
                )
            }
        </>
    )
}

export default UserInfo
