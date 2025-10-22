import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function IsAuthenticated({children}){

    const navigate = useNavigate()

    useEffect(() => {
        const refresh = localStorage.getItem('refresh')
        const access = localStorage.getItem('access')

        if (!refresh || !access) {
        navigate("/signin");
        }

    }, [])

    return children;
}