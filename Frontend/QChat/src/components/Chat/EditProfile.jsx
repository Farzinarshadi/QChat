import '../../assets/css/ChatSideBar/EditProfile.css'
import { IoMdClose } from "react-icons/io";
import { AiOutlineSave } from "react-icons/ai";
import { API_URL, privateApi } from '../../config/Base';
import default_image from '../../assets/images/profile.png'
import { useState, useRef, useEffect } from 'react';
import Alert from '@mui/material/Alert';

export default function EditProfile({ User, setOpenEditProfile }) {

    const [bio, setBio] = useState(User?.custom_profile?.bio || "");
    const [previewImage, setPreviewImage] = useState(User?.custom_profile?.image ? API_URL + User?.custom_profile?.image : default_image);
    const [selectedFile, setSelectedFile] = useState(null);

    const [ShowAlert, setShowAlert] = useState(false)
    const [AlertText, setAlertText] = useState('')
    const [AlertType, setAlertType] = useState('error')

    const fileInputRef = useRef(null);

    const handleImageClick = () => {
        fileInputRef.current.click();
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    }


    const handleSave = () => {
        var formData = new FormData();
        formData.append('image',selectedFile);
        formData.append('bio',bio);

        privateApi.post('/auth/update-profile/', formData)
            .then((response) => {
                setAlertText('Profile Successfully Changed, Refresh Page!')
                setAlertType('success')
                setShowAlert(true)
            })
            .catch((error) => {
                setAlertText(error.response.data.error)
                setAlertType('error')
                setShowAlert(true)
            })
    };


    useEffect(() => {
        let timer;
        if (ShowAlert) {
            timer = setTimeout(() => setShowAlert(false), 3000);
        }
        return () => clearTimeout(timer);
    }, [ShowAlert]);

    return (
        <>
            {ShowAlert && (
                <Alert
                    severity={AlertType}
                    variant='filled'
                    sx={{
                        position: "fixed",
                        top: 20,
                        right: "50%",
                        transform: "translateX(50%)",
                        width: "320px",
                        zIndex: 9999,
                    }}
                >
                    {AlertText}
                </Alert>
            )}

            {/* Close Section */}
            <div className="close-section">
                <div className="close-title">Edit Profile</div>
                <div className='close-icons flex-center'>
                    <button className='save-button flex-center' onClick={handleSave}>
                        <AiOutlineSave className='save-icon' />
                        <span className='save-text'>Save</span>
                    </button>
                    <IoMdClose className='close-icon flex-center' onClick={() => setOpenEditProfile(false)} />
                </div>
            </div>

            {/* Change Image Section */}
            <div className="account-info-section flex-jc-start">
                <img
                    src={previewImage}
                    className='change-image-image'
                    onClick={handleImageClick}
                    style={{ cursor: "pointer" }}
                />
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                />

                <div className="change-profile-input-section flex-ai-start">
                    <input
                        type="text"
                        className="change-username-input"
                        placeholder='Username'
                        value={User?.username}
                        disabled
                    />
                    <textarea
                        className='change-bio-input'
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                    />
                </div>
            </div>
        </>
    )
}
