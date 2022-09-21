import "./User.css";
import Profile from "../../Profile/Profile";
import Gif from "../../Gif/Gif";
import Login from "../../Login/Login";



export default function User(props) {
    // props.verifyToken()
    //     .then(res => console.log(res))

    const tempFavorite = JSON.parse(sessionStorage.getItem("tempFavorite"))

    if (tempFavorite) {
        props.toggleFavorite(tempFavorite)
        sessionStorage.removeItem("tempFavorite")
    }

    const displayGifs = props.currentUser.favoriteGifs?.map((gif) => {
        return (
            <Gif
                key={gif._id}
                gif={gif}
                handleClick={props.toggleFavorite} />
        )
    })

    // send message if you have been logged out?

    if (!props.token) {
        return (<Login
            setToken={props.setToken}
            setCurrentUser={props.setCurrentUser}
        />)
    }

    return (
        <div className="user-profile">
            <Profile
                user={props.currentUser} />
            <div className="display-favorites">
                <h1>Favorite Gifs</h1>
                <div className="favorite-gifs">
                    {displayGifs}
                </div>
            </div>
        </div>
    )
}