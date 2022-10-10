import "./Profile.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Spinner from "../Spinner/Spinner";
import Placeholder from 'react-bootstrap/Placeholder';

export default function Profile(props) {
    const [editingLoggedInUser, setEditingLoggedInUser] = useState(false)
    const [userIsLoading, setUserIsLoading] = useState({})
    const isLoggedInUser = props.selectedUser?._id === props.loggedInUser._id
    const isOnFriendList = props.loggedInUser.friends?.some(friend => friend._id === props.selectedUser?._id)
    const dataFields = ["username", "profilePic", "email", "location", "description"]


    useEffect(() => {
        setUserIsLoading(prevLoading => {
            dataFields.map(field => prevLoading[field] = true)
            return { ...prevLoading }
        })
    }, [])

    const sendData = async event => {
        setEditingLoggedInUser(false)
        setUserIsLoading(prevLoad => {
            prevLoad[event.target.name] = true
            return { ...prevLoad }
        })
        let data
        if (event.target.name === "profilePic") {
            data = new FormData()
            data.append("profilePic", event.target.files[0])
        } else {
            data = {}
            data[event.target.name] = event.target.value
        }
        props.setSelectedUser(prevUser => {
            prevUser[event.target.name] = null
            return { ...prevUser }
        })
        try {
            const response = await axios.put(
                `${props.baseUrl}/user/${props.selectedUser._id}`,
                data,
                { headers: { ...props.headerConfig.headers, "Content-Type": "multipart/form-data" } }
            )
            props.setLoggedInUser(response.data.user)
            props.setSelectedUser(response.data.user)
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

    const editBtn = (dataField) => {
        return (
            <button name={dataField} onClick={evt => setEditingLoggedInUser(evt.target.name)}
                className="material-symbols-outlined"> Edit
            </button>)
    }

    const finishedLoading = (dataField) => {
        setUserIsLoading(prevLoad => {
            prevLoad[dataField] = false
            return { ...prevLoad }
        })
    }

    const displayUserData = (dataField) => {
        if (dataField === "profilePic") {
            return (
                <div className={`profile-section ${dataField}`}>
                    <img
                        className="profile-pic"
                        src={props.selectedUser[dataField]?.url}
                        alt={`User ${props.selectedUser.username} avatar`}
                        style={{ display: !userIsLoading[dataField] ? "block" : "none" }}
                        onLoad={() => finishedLoading(dataField)}
                    />
                    {isLoggedInUser && editBtn(dataField)}
                </div>
            )
        } else {
            return (
                <div className={`profile-section ${dataField}`}>
                    {userIsLoading[dataField] && finishedLoading(dataField)}
                    <span>
                        {props.selectedUser[dataField] ? props.selectedUser[dataField] : `no ${dataField}`}</span>
                    {isLoggedInUser && editBtn(dataField)}
                </div>
            )
        }
    }

    const editUserData = (dataField) => {
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

    const displayOrEditData = dataFields.map(dataField => {
        const loadingIcon = dataField === "profilePic" ? <Spinner /> : <Placeholder as="p" animation="glow">
            <Placeholder xs={8} />
        </Placeholder>
        const loading = userIsLoading[dataField] && loadingIcon
        const display = Object.keys(props.selectedUser).length !== 0 && displayUserData(dataField)
        const edit = editUserData(dataField)
        if (dataField === "email") {
            return isLoggedInUser && [loading, editingLoggedInUser === dataField ? edit : display]
        }
        return [loading, editingLoggedInUser === dataField ? edit : display]

    })

    return (
        <div className="profile-card">
            {Object.keys(props.selectedUser).length !== 0 && !isLoggedInUser && <button onClick={toggleFriend} className="material-symbols-outlined friend-btn">
                {isOnFriendList ? "group_remove" : "group_add"}
            </button>}
            {displayOrEditData}
        </div>
    )
}

// change to fit mobile screen