import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"


import { Navigate } from "react-router-dom"

const PrivateRoutes=({children})=>{
    const {token}=useContext(AuthContext)    
    return (
          <div>
             {token?  children: <Navigate to="/login"/>}
          </div>
    )
}

export default PrivateRoutes