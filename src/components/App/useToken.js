import { useState } from "react";


// SE: Praise: Good use of custom hooks
export default function useToken() {
    const [token, setToken] = useState(localStorage.getItem("token"))

    const saveToken = (userToken) => {
        localStorage.setItem("token", userToken)
        setToken(userToken)
    }

    const clearToken = () => {
        localStorage.removeItem("token")
        setToken(localStorage.getItem("token"))
    }

    return {
        setToken: saveToken,
        clearToken,
        token
    }
}