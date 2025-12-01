import { useEffect } from "react"
import AdminAuth from "./AdminAuth";
import { useNavigate } from "react-router-dom"
type ProtectedAuthType = {
    children : React.ReactNode
}

function GuestLayout({children}:ProtectedAuthType) {
    const navigate = useNavigate()
    const {getToken} = AdminAuth()


    useEffect(()=>{
        if(getToken()){
            navigate('/');
        }
    },[getToken,navigate])
  return (
      <>
        {children}
      </>
  )
}

export default GuestLayout
