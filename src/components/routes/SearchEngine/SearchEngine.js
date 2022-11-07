import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBar from "../../SearchBar/SearchBar";
import Gif from "../../Gif/Gif";
import "./SearchEngine.css"

export default function SearchEngine(props) {
    const [offset, setOffset] = useState("")
    const navigate = useNavigate();

    const fetchGifs = async (offset) => {
        try {
            const data = await axios.get(`${props.baseUrl}/gifs`,
                { params: { searchTerm: props.searchTerm, offset } },
                props.headerConfig);
            return data
        } catch (err) {
            props.setFlash({ type: "danger", message: err.response.data.flash })
        }
    }

    const searchGifs = async (event, configOffset = 0) => {
        event.preventDefault()
        const newOffset = configOffset ? offset + configOffset : configOffset
        const response = await fetchGifs(newOffset)
        if (response) {
            props.setGifs(prevGifs => newOffset
                ? [...prevGifs, ...response.data]
                : [...response.data])
        }
        setOffset(newOffset)
    }

    const redirectLogin = (gif) => {
        sessionStorage.setItem("tempFavorite", JSON.stringify(gif))
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
                handleChange={e => props.setSearchTerm(e.target.value)}
                value={props.searchTerm}
                handleClick={searchGifs} />

            <div className="display-gifs">
                {displayGifs}
                {displayGifs.length > 0 && <button onClick={e => searchGifs(e, 24)} className="more-gifs-btn">Load more Gifs</button>}
            </div>
        </div>

    )
}