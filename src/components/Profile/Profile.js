import "./Profile.css";
import axios from "axios";
import { useState } from "react";

export default function Profile(props) {
    const [editingCurrentUser, setEditingCurrentUser] = useState(false)

    const sendData = async event => {
        setEditingCurrentUser(false)
        if (event.target.name === "profilePic") {
            const formData = new FormData();
            formData.append("profilePic", event.target.files[0])
            const response = await axios.post("http://localhost:8080/user/edit", formData, { headers: { token: props.token, "Content-Type": "multipart/form-data" } })
            props.setCurrentUser(response.data.user)
        } else {
            const data = {}
            data[event.target.name] = event.target.value
            const response = await axios.post("http://localhost:8080/user/edit", { ...data }, { headers: { token: props.token } })
            props.setCurrentUser(response.data.user)
        }

    }

    const handleInputChange = event => {
        props.setCurrentUser(prevUserData => {
            prevUserData[event.target.name] = event.target.value;
            return { ...prevUserData }
        })
    }

    const displayOrEditUserData = (data) => {
        //make extra condition for password
        if (editingCurrentUser === data) {
            if (data === "description") {
                return (
                    <textarea
                        autoFocus
                        value={props.currentUser[data]}
                        name={data}
                        onChange={evt => handleInputChange(evt)}
                        onBlur={evt => sendData(evt)} />
                )
            } else if (data === "profilePic") {
                return (
                    <input
                        type="file"
                        name={data}
                        onChange={evt => sendData(evt)} />
                )
            } else {
                return (
                    <input
                        autoFocus
                        type="text"
                        name={data}
                        value={props.currentUser[data]}
                        onChange={evt => handleInputChange(evt)}
                        onBlur={evt => sendData(evt)}
                        placeholder={props.currentUser[data]}
                    />
                )
            }

        } else {
            // make conditions depending whether h1, h2, p (description), password, etc
            if (data === "profilePic") {
                return (
                    <div className={`profile-section ${data}`}>
                        <img
                            className="profile-pic"
                            src={props.currentUser[data.url]}
                            alt={`User ${props.currentUser.username} avatar`} />
                        <button
                            name={data}
                            onClick={evt => setEditingCurrentUser(evt.target.name)}
                            className="material-symbols-outlined">
                            Edit</button>
                    </div>
                )
            } else {
                return (
                    <div className={`profile-section ${data}`}>
                        <span>{props.currentUser[data] ? props.currentUser[data] : `no ${data}`}</span>
                        <button
                            name={data}
                            onClick={evt => setEditingCurrentUser(evt.target.name)}
                            className="material-symbols-outlined">
                            Edit</button>
                    </div>
                )
            }
        }
    }

    return (
        <div className="profile-card">
            {displayOrEditUserData("username")}
            {displayOrEditUserData("profilePic")}
            <img className="profile-pic" src="https://images.unsplash.com/photo-1576518985988-ff8f8fc5a623?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" alt="user" />
            {displayOrEditUserData("email")}
            {displayOrEditUserData("location")}
            {displayOrEditUserData("description")}
        </div>
    )
}