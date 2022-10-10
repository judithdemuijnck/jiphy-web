import "./User.css";
import Profile from "../../Profile/Profile";
import Gif from "../../Gif/Gif";
import Login from "../../Login/Login";
import Friend from "../../Friend/Friend";
import Spinner from "../../Spinner/Spinner";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function User(props) {
    const [selectedUser, setSelectedUser] = useState({})
    const [favGifIsLoading, setFavGifIsLoading] = useState({})
    const [friendIsLoading, setFriendIsLoading] = useState({})
    const params = useParams()
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${props.baseUrl}/user/${params.userId}`, props.headerConfig)
            .then(response => setSelectedUser(response.data.user))
            .catch(err => {
                window.flash(err.response.data.flash, "danger")
                navigate("/user/")
            })
    }, [params.userId, props.loggedInUser])

    useEffect(() => {
        setFavGifIsLoading(prevLoading => {
            selectedUser?.favoriteGifs?.map(gif => prevLoading[gif._id] = true)
            return { ...prevLoading }
        })
    }, [])

    useEffect(() => {
        setFriendIsLoading(prevLoading => {
            selectedUser?.friends?.map(friend => prevLoading[friend._id] = true)
            return { ...prevLoading }
        })
    }, [])

    const gifFinishedLoading = (gifId) => {
        setFavGifIsLoading(prevLoading => {
            prevLoading[gifId] = false
            return { ...prevLoading }
        })
    }

    const friendFinishedLoading = (friendId) => {
        setFriendIsLoading(prevLoading => {
            prevLoading[friendId] = false
            return { ...prevLoading }
        })
    }

    const tempFavorite = JSON.parse(sessionStorage.getItem("tempFavorite"))

    if (tempFavorite) {
        props.toggleFavorite(tempFavorite)
        sessionStorage.removeItem("tempFavorite")
    }

    const displayGifs = selectedUser?.favoriteGifs?.map(gif => {
        return (
            <Gif
                key={gif._id}
                gif={gif}
                gifIsLoading={favGifIsLoading}
                handleLoad={gifFinishedLoading}
                handleClick={props.toggleFavorite}
                isFavorite={props.loggedInUser.favoriteGifs?.some(favGif => favGif._id === gif._id)} />
        )
    })

    const displayFriends = selectedUser?.friends?.map(friend => {
        return (
            <Friend
                key={friend._id}
                friend={friend}
                friendIsLoading={friendIsLoading}
                handleLoad={friendFinishedLoading}
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
                        setLoggedInUser={props.setLoggedInUser}
                        baseUrl={props.baseUrl}
                        headerConfig={props.headerConfig} />
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