import "./Register.css"
import { useState } from "react";
import axios from "axios"
import { useNavigate } from "react-router-dom";;

export default function Register(props) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const registerUser = async event => {
        event.preventDefault()
        try {
            const response = await axios.post(`${props.baseUrl}/accounts/register`, { username, email, password })
            props.setToken(response.data.token)
            props.setLoggedInUser(response.data.user)
            props.setFlash({ type: "success", message: response.data.flash })
            navigate(`/user/${response.data.user._id}`)
        } catch (err) {
            props.setFlash({ type: "danger", message: err.response.data.flash })
        }
    }

    return (
        <form className="register-form" onSubmit={evt => registerUser(evt)}>
            <h1>Register</h1>
            <label htmlFor="username">
                <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Username"
                    onChange={evt => setUsername(evt.target.value)} />
            </label>
            <label htmlFor="email">
                <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Email"
                    onChange={evt => setEmail(evt.target.value)} />
            </label>

            <label htmlFor="password">
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    onChange={evt => setPassword(evt.target.value)} />
            </label>
            <button>Submit</button>
        </form>
    )
}