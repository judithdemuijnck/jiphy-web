import { useState } from "react";

export default function useToken() {
    const [token, setToken] = useState(sessionStorage.getItem("token"))

    const saveToken = (userToken) => {
        sessionStorage.setItem("token", userToken.token)
        setToken(userToken.token)
    }

    const clearToken = () => {
        sessionStorage.removeItem("token")
        setToken(sessionStorage.getItem("token"))
    }

    return {
        setToken: saveToken,
        clearToken,
        token
    }
}