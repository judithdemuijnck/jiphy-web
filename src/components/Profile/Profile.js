import "./Profile.css";
import axios from "axios";
import { useState } from "react";

export default function Profile(props) {
    const [editingLoggedInUser, setEditingLoggedInUser] = useState(false)
    const isLoggedInUser = props.selectedUser._id === props.loggedInUser._id ? true : false
    const defaultAvatar = "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=870&q=80"
    console.log(isLoggedInUser)

    const sendData = async event => {
        setEditingLoggedInUser(false)
        if (event.target.name === "profilePic") {
            const formData = new FormData();
            formData.append("profilePic", event.target.files[0])
            const response = await axios.post("http://localhost:8080/user/edit", formData, { headers: { token: props.token, "Content-Type": "multipart/form-data" } })
            props.setLoggedInUser(response.data.user)
            props.setSelectedUser(response.data.user)
        } else {
            const data = {}
            data[event.target.name] = event.target.value
            const response = await axios.post("http://localhost:8080/user/edit", { ...data }, { headers: { token: props.token } })
            props.setLoggedInUser(response.data.user)
            props.setSelectedUser(response.data.user)
        }
    } //CLEAN UP

    const handleInputChange = event => {
        props.setLoggedInUser(prevUserData => {
            prevUserData[event.target.name] = event.target.value;
            return { ...prevUserData }
        })
    }

    const editBtn = (data) => {
        return (
            <button
                name={data}
                onClick={evt => setEditingLoggedInUser(evt.target.name)}
                className="material-symbols-outlined">
                Edit
            </button>)
    }

    const displayOrEditUserData = (data) => {
        //make extra condition for password
        if (editingLoggedInUser === data) {
            if (data === "description") {
                return (
                    <textarea
                        autoFocus
                        value={props.loggedInUser[data]}
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
                        value={props.loggedInUser[data]}
                        onChange={evt => handleInputChange(evt)}
                        onBlur={evt => sendData(evt)}
                        placeholder={props.loggedInUser[data]}
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
                            src={props.selectedUser[data]?.url ? props.selectedUser[data].url : defaultAvatar}
                            alt={`User ${props.selectedUser.username} avatar`}
                        />
                        {isLoggedInUser && editBtn(data)}
                    </div>
                )
            } else {
                return (
                    <div className={`profile-section ${data}`}>
                        <span>{props.selectedUser[data] ? props.selectedUser[data] : `no ${data}`}</span>
                        {isLoggedInUser && editBtn(data)}
                    </div>
                )
            }
        }
    }

    const toggleFriend = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/user/${props.selectedUser._id}/friend`, { headers: { token: props.token } });
            props.setLoggedInUser(response.data.matchedUser)
            props.setSelectedUser(response.data.selectedUser)
        } catch (err) {
            console.log(err)
        }

    }

    return (
        <div className="profile-card">
            {!isLoggedInUser && <button onClick={toggleFriend}>Become {`${props.selectedUser.username}`}'s friend</button>}
            {displayOrEditUserData("username")}
            {displayOrEditUserData("profilePic")}
            {displayOrEditUserData("email")}
            {displayOrEditUserData("location")}
            {displayOrEditUserData("description")}
        </div>
    )
}