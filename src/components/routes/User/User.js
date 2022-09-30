import "./User.css";
import Profile from "../../Profile/Profile";
import Gif from "../../Gif/Gif";
import Login from "../../Login/Login";
import Friends from "../../Friends/Friends";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function User(props) {
    const [selectedUser, setSelectedUser] = useState({})
    const navigate = useNavigate();
    const params = useParams()

    useEffect(() => {
        console.log("triggered")
        axios.get(`http://localhost:8080/user/${params.userId}`, { headers: { token: props.token } })
            .then(response => setSelectedUser(response.data.user))
            .catch(err => console.log(err))
    }, [params.userId])
    //or maybe if there is change to params.userId? would this trigger a re-render?

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

    // send message if you have been logged out?

    //renders Login component if no user is logged in
    if (!props.token) {
        return (<Login
            setToken={props.setToken}
            setLoggedInUser={props.setLoggedInUser}
        />)
    }

    const routeChange = () => {
        let path = `/user/632ac19415a8da2d37d32566`;
        navigate(path);
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
                <Friends
                    selectedUser={selectedUser} />
            </div>
            <div className="display-favorites">
                <h1>Favorite Gifs</h1>
                <div className="favorite-gifs">
                    {displayGifs}
                </div>
            </div>
        </div>
    )
}