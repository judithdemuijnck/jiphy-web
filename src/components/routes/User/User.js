import "./User.css";
import Profile from "../../Profile/Profile";
import Gif from "../../Gif/Gif";
import Login from "../../Login/Login";



export default function User(props) {
    const displayGifs = props.favoriteGifs.map((gif, idx) => {
        return (
            <Gif
                key={gif.id}
                gif={gif}
                handleClick={props.toggleFavorite} />
        )
    })

    if (!props.token) {
        return (<Login setToken={props.setToken} />)
    }

    return (
        <div className="user-profile">
            <Profile />
            <div className="display-favorites">
                <h1>Favorite Gifs</h1>
                <div className="favorite-gifs">
                    {displayGifs}
                </div>
            </div>
        </div>
    )
}