import "./User.css";
import Profile from "../../Profile/Profile";
import Gif from "../../Gif/Gif";
import Login from "../../Login/Login";
import Friend from "../../Friend/Friend";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


export default function User(props) {
    const [selectedUser, setSelectedUser] = useState({})
    const params = useParams()
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8080/user/${params.userId}`, { headers: { token: props.token } })
            .then(response => setSelectedUser(response.data.user))
            .catch(err => {
                window.flash(err.response.data.flash, "danger")
                navigate("/user/")
            })
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
        </div >
    )
}