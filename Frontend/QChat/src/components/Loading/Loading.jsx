import { CircularProgress } from "@mui/material";
import '../../assets/css/Loading/Loading.css'

function Loading() {
  return (
    <div className="loading-box flex-center">
        <CircularProgress />
    </div>
  )
}

export default Loading