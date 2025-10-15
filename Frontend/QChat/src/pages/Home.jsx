import Chat from "../components/Chat/Chat";
import '../assets/css/Home/home.css'
import ChatSideBar from "../components/Chat/ChatSideBar";

export default function Home(){
    return (
        <>
            <div className="home-main flex-center">

                {/* Chat */}
                <Chat />

            </div>
        </>
    )
}