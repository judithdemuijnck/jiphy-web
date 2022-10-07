import "./Profile.css";
import axios from "axios";
import { useState } from "react";

export default function Profile(props) {
    const [editingLoggedInUser, setEditingLoggedInUser] = useState(false)
    const isLoggedInUser = props.selectedUser?._id === props.loggedInUser._id
    const isOnFriendList = props.loggedInUser.friends?.some(friend => friend._id === props.selectedUser?._id)

    const sendData = async event => {
        setEditingLoggedInUser(false)
        if (event.target.name === "profilePic") {
            const formData = new FormData();
            formData.append("profilePic", event.target.files[0])
            try {
                const response = await axios.put(`http://localhost:8080/user/${props.selectedUser._id}`, formData, { headers: { token: props.token, "Content-Type": "multipart/form-data" } })
                props.setLoggedInUser(response.data.user)
                props.setSelectedUser(response.data.user)
                window.flash(response.data.flash)
            } catch (err) {
                window.flash(err.response.data.flash, "danger")
            }

        } else {
            const data = {}
            data[event.target.name] = event.target.value
            try {
                const response = await axios.put(`http://localhost:8080/user/${props.selectedUser._id}`, data, { headers: { token: props.token } })
                props.setLoggedInUser(response.data.user)
                props.setSelectedUser(response.data.user)
                window.flash(response.data.flash)
            } catch (err) {
                window.flash(err.response.data.flash, "danger")
            }
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
                            src={props.selectedUser[data]?.url}
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
            const response = await axios.patch(`http://localhost:8080/user/${props.selectedUser._id}/friends`, {}, { headers: { token: props.token } });
            props.setLoggedInUser(response.data.loggedInUser)
            props.setSelectedUser(response.data.selectedUser)
        } catch (err) {
            window.flash(err.response.data.flash, "danger")
        }

    }

    return (
        <div className="profile-card">
            {!isLoggedInUser && <button onClick={toggleFriend}>{isOnFriendList ? `Unfriend ${props.selectedUser?.username}` : `Become ${props.selectedUser?.username}'s friend`}</button>}
            {props.selectedUser && displayOrEditUserData("username")}
            {props.selectedUser && displayOrEditUserData("profilePic")}
            {props.selectedUser && displayOrEditUserData("email")}
            {props.selectedUser && displayOrEditUserData("location")}
            {props.selectedUser && displayOrEditUserData("description")}
        </div>
    )
}

// setLoading for when profilePic is uploaded
// change to fit mobile screen