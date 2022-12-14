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
    const [dataIsLoading, setDataIsLoading] = useState(false);
    const params = useParams()
    const navigate = useNavigate();
    const isLoggedInUser = selectedUser?._id === props.loggedInUser._id
    const isOnFriendList = props.loggedInUser.friends?.some(friend => friend._id === selectedUser?._id)
    const dataFields = ["username", "profilePic", "email", "location", "description"]

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await axios.get(`${props.baseUrl}/users/${params.userId}`, props.headerConfig)
                setSelectedUser(response.data.user)
            } catch (err) {
                props.setFlash({ type: "danger", message: err.response.data.flash })
                navigate("/user")
            }
        }
        fetchData()
    }, [params.userId, props.loggedInUser])

    const sendData = async (name, data) => {
        setDataIsLoading(true)
        try {
            const response = await axios.patch(
                `${props.baseUrl}/users/${selectedUser._id}`,
                data,
                { headers: { ...props.headerConfig.headers, "Content-Type": "multipart/form-data" } }
            )
            props.setLoggedInUser(response.data.user)
            setSelectedUser(response.data.user)
            setDataIsLoading(false)
        } catch (err) {
            props.setFlash({ type: "danger", message: err.response.data.flash })
        }
    }

    const toggleFriend = async () => {
        try {
            const response = await axios.patch(`${props.baseUrl}/users/${selectedUser._id}/friends`, {}, props.headerConfig);
            props.setLoggedInUser(response.data.loggedInUser)
            setSelectedUser(response.data.selectedUser)
        } catch (err) {
            props.setFlash({ type: "danger", message: err.response.data.flash })
        }
    }

    const displayUserData = dataFields.map(dataField => {
        if (dataField === "profilePic") {
            return (<ProfileImg
                key={dataField}
                image={selectedUser?.profilePic?.url}
                username={selectedUser?.username}
                sendData={sendData}
                isLoggedInUser={isLoggedInUser}
                profileIsUploading={dataIsLoading} />)
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
                    isLoggedInUser={isLoggedInUser}
                    profileIsUploading={dataIsLoading} />
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
                        {Object.keys(selectedUser).length !== 0 && !isLoggedInUser && <button onClick={toggleFriend} className="material-symbols-outlined friend-btn">
                            {isOnFriendList ? "group_remove" : "group_add"}
                        </button>}
                        {displayUserData}
                    </div>
                    <div className="friends-section">
                        <h1>Friends</h1>
                        <div className="display-friends">
                            {selectedUser?.friends?.length !== 0 ? displayFriends : "No friends yet."}
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
