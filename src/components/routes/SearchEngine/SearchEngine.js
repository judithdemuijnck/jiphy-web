import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBar from "../../SearchBar/SearchBar";
import Gif from "../../Gif/Gif";
import "./SearchEngine.css"

export default function SearchEngine(props) {
    const [gifSearchConfig, setGifSearchConfig] = useState({})
    const navigate = useNavigate();

    useEffect(() => {
        // to me it seems hacky to make this call in useEffect ... is this the best solution?
        const searchGifs = async () => {
            try {
                const response = await axios.get(`${props.baseUrl}/gifs`,
                    { params: gifSearchConfig },
                    props.headerConfig);
                props.setGifs(prevGifs => gifSearchConfig.offset
                    ? [...prevGifs, ...response.data]
                    : [...response.data])
            }
            catch (err) {
                window.flash(err.response.data.flash, "danger")
            }
        }

        if (props.searchTerm) {
            searchGifs()
        }
    }, [gifSearchConfig])

    const configureGifSearch = async (event, offset = 0) => {
        event.preventDefault();
        setGifSearchConfig(prevConfig => ({
            searchTerm: props.searchTerm,
            offset: offset ? prevConfig.offset += offset : 0
        })
        )
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
                handleClick={configureGifSearch} />

            <div className="display-gifs">
                {displayGifs}
                {displayGifs.length > 0 && <button onClick={e => configureGifSearch(e, 24)} className="more-gifs-btn">Load more Gifs</button>}
            </div>
        </div>

    )
}