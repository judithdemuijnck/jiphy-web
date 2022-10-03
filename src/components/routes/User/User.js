import "./User.css";
import Profile from "../../Profile/Profile";
import Gif from "../../Gif/Gif";
import Login from "../../Login/Login";
import Friend from "../../Friend/Friend";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";


export default function User(props) {
    const [selectedUser, setSelectedUser] = useState({})
    const params = useParams()

    useEffect(() => {
        console.log("triggered")
        axios.get(`http://localhost:8080/user/${params.userId}`, { headers: { token: props.token } })
            .then(response => setSelectedUser(response.data.user))
            .catch(err => console.log(err))
    }, [params.userId, props.loggedInUser])


    const tempFavorite = JSON.parse(sessionStorage.getItem("tempFavorite"))

    if (tempFavorite) {
        props.toggleFavorite(tempFavorite)
        sessionStorage.removeItem("tempFavorite")
    }

    const displayGifs = selectedUser?.favoriteGifs?.map((gif) => {
        return (
            <Gif
                key={gif._id}
                gif={gif}
                handleClick={props.toggleFavorite} />
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

    // send message if you have been logged out?

    //renders Login component if no user is logged in
    if (!props.token) {
        return (<Login
            setToken={props.setToken}
            setLoggedInUser={props.setLoggedInUser}
        />)
    }



    return (
        <div className="user-profile">
            <div className="user-infos">
                <Profile
                    loggedInUser={props.loggedInUser}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    token={props.token}
                    setLoggedInUser={props.setLoggedInUser} />
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
    )
}