import "./User.css";
import Gif from "../../Gif/Gif";
import Login from "../../Login/Login";
import Friend from "../../Friend/Friend";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileText from "../../ProfileText/ProfileText";
import ProfileImg from "../../ProfileImg/ProfileImg";

export default function User(props) {
    const [selectedUser, setSelectedUser] = useState({})
    const params = useParams()
    const navigate = useNavigate();
    const isLoggedInUser = selectedUser?._id === props.loggedInUser._id
    const isOnFriendList = props.loggedInUser.friends?.some(friend => friend._id === selectedUser?._id)
    const dataFields = ["username", "profilePic", "email", "location", "description"]

    useEffect(() => {
        // SE: Best practice: This is async code and so you'll need to declare it in a function like you did in SearchEngine (line 22)
        axios.get(`${props.baseUrl}/users/${params.userId}`, props.headerConfig)
            .then(response => setSelectedUser(response.data.user))
            .catch(err => {
                window.flash(err.response.data.flash, "danger")
                navigate("/user")
            })
    }, [params.userId, props.loggedInUser])

    const sendData = async (name, data) => {
        // SE: Question: What problem are you trying to solve here :) ?
        setSelectedUser(prevUser => {
            prevUser[name] = null
            return { ...prevUser }
        })
        try {
            const response = await axios.patch(
                `${props.baseUrl}/users/${selectedUser._id}`,
                data,
                { headers: { ...props.headerConfig.headers, "Content-Type": "multipart/form-data" } }
            )
            // SE: Question: Are loggedInUser and selectedUser different things?
            props.setLoggedInUser(response.data.user)
            setSelectedUser(response.data.user)
        } catch (err) {
            window.flash(err.response.data.flash, "danger")
        }
    }

    const toggleFriend = async () => {
        try {
            const response = await axios.patch(`${props.baseUrl}/users/${selectedUser._id}/friends`, {}, props.headerConfig);
            props.setLoggedInUser(response.data.loggedInUser)
            setSelectedUser(response.data.selectedUser)
        } catch (err) {
            window.flash(err.response.data.flash, "danger")
        }
    }

    const displayUserData = dataFields.map(dataField => {
        if (dataField === "profilePic") {
            return (<ProfileImg
                key={dataField}
                image={selectedUser.profilePic?.url}
                username={selectedUser?.username}
                sendData={sendData}
                isLoggedInUser={isLoggedInUser} />)
        } else if (dataField === "email") {
            return isLoggedInUser && (
                <ProfileText
                    key={dataField}
                    content={selectedUser[dataField]}
                    name={dataField}
                    selectedUser={selectedUser}
                    loggedInUser={props.loggedInUser}
                    setLoggedInUser={props.setLoggedInUser}
                    sendData={sendData}
                    isLoggedInUser={isLoggedInUser} />
            )
        } else {
            return (
                <ProfileText
                    key={dataField}
                    content={selectedUser[dataField]}
                    name={dataField}
                    selectedUser={selectedUser}
                    loggedInUser={props.loggedInUser}
                    setLoggedInUser={props.setLoggedInUser}
                    sendData={sendData}
                    isLoggedInUser={isLoggedInUser} />
            )
        }
    })

    const displayGifs = selectedUser?.favoriteGifs?.map(gif => {
        return (
            <Gif
                key={gif._id}
                gif={gif}
                handleClick={props.toggleFavorite}
                isFavorite={props.loggedInUser.favoriteGifs?.some(favGif => favGif._id === gif._id)} />
        )
    })

    const displayFriends = selectedUser?.friends?.map(friend => {
        return (
            <Friend
                key={friend._id}
                friend={friend}
            />
        )
    })

    // saves tempFavporte to user favorites
    const tempFavorite = JSON.parse(sessionStorage.getItem("tempFavorite"))
    if (tempFavorite) {
        props.toggleFavorite(tempFavorite)
        sessionStorage.removeItem("tempFavorite")
    }

    //renders Login component if no user is logged in
    if (!props.token) {
        return (<Login
            setToken={props.setToken}
            setLoggedInUser={props.setLoggedInUser}
        />)
    }

    return (
        <div>
            <div className="user-profile">
                <div className="user-infos">
                    <div className="profile-card">
                        {/* SE: Question: Should clicking on the profileCard toggleFriend? */}
                        {Object.keys(selectedUser).length !== 0 && !isLoggedInUser && <button onClick={toggleFriend} className="material-symbols-outlined friend-btn">
                            {isOnFriendList ? "group_remove" : "group_add"}
                        </button>}
                        {displayUserData}
                    </div>
                    <div className="friends-section">
                        <h1>Friends</h1>
                        <div className="display-friends">
                            {displayFriends}
                        </div>
                    </div>
                </div>
                <div className="favorite-gifs-section">
                    <h1>Favorite Gifs</h1>
                    <div className="display-favorites">
                        {displayGifs}
                    </div>
                </div>
            </div>
        </div>
    )
}