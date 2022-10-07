import "./Profile.css";
import axios from "axios";
import { useState } from "react";

export default function Profile(props) {
    const [editingLoggedInUser, setEditingLoggedInUser] = useState(false)
    const isLoggedInUser = props.selectedUser?._id === props.loggedInUser._id
    const isOnFriendList = props.loggedInUser.friends?.some(friend => friend._id === props.selectedUser?._id)

    const sendData = async event => {
        setEditingLoggedInUser(false)
        let data
        if (event.target.name === "profilePic") {
            data = new FormData()
            data.append("profilePic", event.target.files[0])
        } else {
            data = {}
            data[event.target.name] = event.target.value
        }
        try {
            const response = await axios.put(
                `${props.baseUrl}/user/${props.selectedUser._id}`,
                data,
                { headers: { ...props.headerConfig.headers, "Content-Type": "multipart/form-data" } }
            )
            props.setLoggedInUser(response.data.user)
            props.setSelectedUser(response.data.user)
            window.flash(response.data.flash)
        } catch (err) {
            window.flash(err.response.data.flash, "danger")
        }
    }


    const handleInputChange = event => {
        props.setLoggedInUser(prevUserData => {
            prevUserData[event.target.name] = event.target.value;
            return { ...prevUserData }
        })
    }

    const editBtn = (data) => {
        return (
            <button name={data} onClick={evt => setEditingLoggedInUser(evt.target.name)}
                className="material-symbols-outlined"> Edit
            </button>)
    }

    const displayOrEditUserData = (dataField) => {
        if (editingLoggedInUser === dataField) {
            if (dataField === "description") {
                return (
                    <textarea autoFocus
                        value={props.loggedInUser[dataField]}
                        name={dataField} onChange={evt => handleInputChange(evt)}
                        onBlur={evt => sendData(evt)} />
                )
            } else if (dataField === "profilePic") {
                return (
                    <input type="file"
                        name={dataField} onChange={evt => sendData(evt)} />
                )
            } else {
                return (
                    <input autoFocus type="text"
                        value={props.loggedInUser[dataField]}
                        name={dataField} onChange={evt => handleInputChange(evt)}
                        onBlur={evt => sendData(evt)}
                        placeholder={props.loggedInUser[dataField]}
                    />
                )
            }

        } else {
            if (dataField === "profilePic") {
                return (
                    <div className={`profile-section ${dataField}`}>
                        <img
                            className="profile-pic"
                            src={props.selectedUser[dataField]?.url}
                            alt={`User ${props.selectedUser.username} avatar`}
                        />
                        {isLoggedInUser && editBtn(dataField)}
                    </div>
                )
            } else {
                return (
                    <div className={`profile-section ${dataField}`}>
                        <span>{props.selectedUser[dataField] ? props.selectedUser[dataField] : `no ${dataField}`}</span>
                        {isLoggedInUser && editBtn(dataField)}
                    </div>
                )
            }
        }
    }

    const toggleFriend = async () => {
        try {
            const response = await axios.patch(`${props.baseUrl}/user/${props.selectedUser._id}/friends`, {}, props.headerConfig);
            props.setLoggedInUser(response.data.loggedInUser)
            props.setSelectedUser(response.data.selectedUser)
        } catch (err) {
            window.flash(err.response.data.flash, "danger")
        }
    }

    return (
        <div className="profile-card">
            {!isLoggedInUser && <button onClick={toggleFriend}>{isOnFriendList ? `Unfriend ${props.selectedUser?.username}` : `Become ${props.selectedUser?.username}'s friend`}</button>}
            {displayOrEditUserData("username")}
            {displayOrEditUserData("profilePic")}
            {displayOrEditUserData("email")}
            {displayOrEditUserData("location")}
            {displayOrEditUserData("description")}
        </div>
    )
}

// setLoading for when profilePic is uploaded
// change to fit mobile screen