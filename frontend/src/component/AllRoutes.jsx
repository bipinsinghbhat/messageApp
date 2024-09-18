import { Route, Routes } from "react-router-dom"
import HomePage from "./HomePage"
import ChatPage from "./ChatPage"
import Register from "./Register"
import Login from "./Login"
import PrivateRoutes from "./PrivateRoutes"

const AllRoutes=()=>{
    return (
      <Routes>
        <Route path={"/login"} element={<Login/>} />
        <Route path={"/chat/:chatId"} element={<ChatPage/>} />
        <Route path={"/register"} element={<Register/>} />
        <Route path={"/"} element={ <PrivateRoutes><HomePage/></PrivateRoutes> }/>
      </Routes>
    );
}

export default AllRoutes