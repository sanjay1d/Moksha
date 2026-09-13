import { GoogleLogin, type CredentialResponse } from "@react-oauth/google"
import { useNavigate } from "react-router-dom"

import { useAuth } from "@/context/AuthContext"
import { api } from "@/services/api"

export function GoogleLoginButton() {
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  const onSuccess = async (response: CredentialResponse) => {
    if (!response.credential) return
    try {
      const res = await api.post("/auth/google", { credential: response.credential })
      const { access_token, user } = res.data
      setAuth(access_token, user)
      navigate("/")
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="w-full h-full p-1.5 flex items-center justify-center">
      <GoogleLogin
        onSuccess={onSuccess}
        onError={() => console.error("Google login failed")}
        theme="outline"
        size="large"
        shape="rectangular"
        text="continue_with"
        width="100%"
      />
    </div>
  )
}
