import "./Login.css";
import { useState } from "react";
import axios from "axios";

export default function Login(props) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const loginUser = async event => {
        event.preventDefault();
        const response = await axios.post("http://localhost:8080/login", { username, password })
        props.setToken(response.data)
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