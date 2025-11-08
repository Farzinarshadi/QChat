import { useEffect, useState } from "react";
import { API_URL } from "./Base";

const channel = new BroadcastChannel("online_status"); 
let ws = null; 

function UserStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const token = localStorage.getItem("access");

    if(!token){
      return;
    }
   
    if (!ws) {
      ws = new WebSocket(`wss://localhost:8000/ws/online/?token=${token}`);

      ws.onopen = () => {
        if (navigator.onLine) sendStatus(true);
      };

      ws.onclose = () => {
        ws = null;
      };

      ws.onmessage = (e) => {
        const data = JSON.parse(e.data);
        console.log("Server:", data);
      };
    }

    const sendStatus = (online) => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ action: online ? "online" : "offline" }));
      }
    };

    const handleOnlineStatus = () => {
      const online = navigator.onLine;
      setIsOnline(online);
      sendStatus(online);
      channel.postMessage(online); 
    };

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOnlineStatus);


    const handleUnload = () => sendStatus(false);
    window.addEventListener("beforeunload", handleUnload);


    channel.onmessage = (e) => setIsOnline(e.data);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOnlineStatus);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, []);

  return (
    <></>
  );
}

export default UserStatus;
