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
        // SE: Answer: Well identified. The action here is not a side effect, but rather a direct implication of you hitting the search button
        // Therefore, searchGifs should be called within the function called configureGifSearch, and then once thats completed, you call setGifs
        //    const configureGifSearch = async (event, offset = 0) => {
        //      event.preventDefault();
        //      {fetch data}
        //      props.setGifs(data)
        // However, I have noticed that gifs is not used by anything else in App.js, therefore, do you need to send the state back up? Could you move setGifs into this component?
    
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