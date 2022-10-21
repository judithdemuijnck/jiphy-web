import "./Login.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const loginUser = async event => {
        event.preventDefault();
        try {
            const response = await axios.post("http://localhost:8080/accounts/login", { username, password })
            props.setToken(response.data.token)
            props.setLoggedInUser(response.data.user)
            props.setFlash({ type: "success", message: response.data.flash })
            navigate(`/user/${response.data.user._id}`)
        } catch (err) {
            console.log(err)
            props.setFlash({ type: "danger", message: err.response.data.flash })
        }
    }

    return (
        <form className="login-form" onSubmit={e => loginUser(e)}>
            <h1>Login</h1>
            <label htmlFor="username">
                <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Username"
                    onChange={e => setUsername(e.target.value)} />
            </label>

            <label htmlFor="password">
                <input
                    type="password"
                    name="password"
                    id="password"
                    placeholder="Password"
                    onChange={e => setPassword(e.target.value)} />
            </label>
            <button>Submit</button>

        </form>)
}