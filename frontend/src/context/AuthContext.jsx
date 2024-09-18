import { createContext, useState } from "react"

export const AuthContext=createContext()

const AuthProvider=({children})=>{

  const [token,setToken]=useState("")
  const [isAuth,setIsAuth]=useState(false)
  const [currentuserId,setCurrentUserId]=useState("")
  

  


     return (
       <AuthContext.Provider
         value={{
           token,
           setToken,
           isAuth,
           setIsAuth,
           currentuserId,
           setCurrentUserId,
         }}
       >
         {children}
       </AuthContext.Provider>
     );
}

export default AuthProvider