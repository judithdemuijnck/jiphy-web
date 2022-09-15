import "./Register.css"
import { useState } from "react";
import axios from "axios";

export default function Register(props) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const registerUser = async event => {
        event.preventDefault()
        const response = await axios.post("http://localhost:8080/register", { username, email, password })
        props.setToken(response.data.token)
        props.setCurrentUser(response.data.user)
        // HOW DO YOU REDIRECT IN REACT
    }

    return (
        <form onSubmit={evt => registerUser(evt)}>
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