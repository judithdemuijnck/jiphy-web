import "./User.css";
import Profile from "../../Profile/Profile";
import Gif from "../../Gif/Gif";



export default function User(props) {
    const displayGifs = props.favoriteGifs.map((gif, idx) => {
        return (
            <Gif
                key={idx}
                url={gif.url}
                searchTerm={gif.searchTerm}
                handleClick={gif.handleClick} />
        )
    })


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