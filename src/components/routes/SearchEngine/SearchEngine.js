import SearchBar from "../../SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";
import Gif from "../../Gif/Gif";
import "./SearchEngine.css"

export default function SearchEngine(props) {
    const navigate = useNavigate();

    const redirectLogin = (gif) => {
        sessionStorage.setItem("tempFavorite", JSON.stringify(gif))
        console.log(sessionStorage.getItem("tempFavorite"))
        navigate("/login")
    }

    const displayGifs = props.gifs.map(gif => {
        return (
            <Gif
                key={gif._id}
                gif={gif}
                handleClick={props.token ? props.toggleFavorite : redirectLogin}
                isFavorite={props.loggedInUser.favoriteGifs?.some(favGif => favGif._id === gif._id)} />)
    })

    return (
        <div>
            <SearchBar
                handleChange={props.getSearchTerm}
                value={props.searchTerm}
                handleClick={props.configureGifSearch} />

            <div className="display-gifs">
                {displayGifs}
                {displayGifs.length > 0 && <button onClick={e => props.configureGifSearch(e, 24)} className="more-gifs-btn">Load more Gifs</button>}
            </div>
        </div>

    )
}