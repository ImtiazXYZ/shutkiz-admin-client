import { useEffect } from "react"
import AdminAuth from "./AdminAuth";
import { useNavigate } from "react-router-dom"
import DefaultLayout from "../../layout/DefaultLayout"
type ProtectedAuthType = {
    children : React.ReactNode
}

function ProtectedLayout({children}:ProtectedAuthType) {
    const navigate = useNavigate()
    const {getToken} = AdminAuth()


    useEffect(()=>{
        if(!getToken()){
            navigate('/login');
        }
    },[getToken,navigate])
  return (
      <>
        <DefaultLayout>
        {children}
        </DefaultLayout>
      </>
  )
}

export default ProtectedLayout
