import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchBar from "../../SearchBar/SearchBar";
import Gif from "../../Gif/Gif";
import "./SearchEngine.css"

export default function SearchEngine(props) {
    const [offset, setOffset] = useState("")
    const navigate = useNavigate();
    const gifSearchConfig = { searchTerm: props.searchTerm, offset: offset }


    // useEffect(() => {
    // to me it seems hacky to make this call in useEffect ... is this the best solution?
    // SE: Answer: Well identified. The action here is not a side effect, but rather a direct implication of you hitting the search button
    // Therefore, searchGifs should be called within the function called configureGifSearch, and then once thats completed, you call setGifs
    //    const configureGifSearch = async (event, offset = 0) => {
    //      event.preventDefault();
    //      {fetch data}
    //      props.setGifs(data)
    // However, I have noticed that gifs is not used by anything else in App.js, therefore, do you need to send the state back up? Could you move setGifs into this component?

    // JdM: searchTerm and gifs are only used in this route/component
    // however during logout I would think it is good practice to set everything back to 0
    // is there a way to set all states to null
    // or an event listener for when the user leaves the component?

    // SE: I see your logic! No thats fair enough, especially if you want the state to persist between navigation between the dashboard and the search.
    // The more advanced way involves refactoring the state to use the 'context' api / using global app state. Lets keep this out of scope for now and tackle as an independent refactor (its a more advanced topic).



    const configureGifSearch = (configOffset) => {
        // JdM: need to do this 2-liner because the state doesn't update before I make the api call
        // that's why fetchData was originally in useEffect
        // is there a better way of doing this?


        // SE: as in the offset wasn't being updated before you make the API call?
        // Any reason you can't pass the new offset through to fetchGifs as a parameter? That way it will always be correct when you make the API call and you don't need to wait for the state to update
        // If you subsequently then need to update the state then you can, i.e.

        // const searchGifs = async (event, configOffset = 0) => {
        //     event.preventDefault()
        //     const newOffset = configOffset ? offset + configOffset : configOffset
        //     const response = await fetchGifs(newOffset)
        //     if (response) {
        //         props.setGifs(prevGifs => newOffset
        //             ? [...prevGifs, ...response.data]
        //             : [...response.data])
        //     }
        //      setOffset(newOffset)
        // }

        // const fetchGifs = async (offset) => {
        //     try {
        //         const data = await axios.get(`${props.baseUrl}/gifs`,
        //             { params: {...gifSearchConfig, offset } },
        //             props.headerConfig);
        //         return data
        //     } catch (err) {
        //             props.setFlash({ type: "danger", message: err.response.data.flash })
        //     }
        // }



        gifSearchConfig.offset = configOffset ? offset + configOffset : configOffset
        setOffset(configOffset ? gifSearchConfig.offset : configOffset)
    }

    const fetchGifs = async () => {
        try {
            const data = await axios.get(`${props.baseUrl}/gifs`,
                { params: gifSearchConfig },
                props.headerConfig);
            return data
        } catch (err) {
            props.setFlash({ type: "danger", message: err.response.data.flash })
        }
    }

    const searchGifs = async (event, configOffset = 0) => {
        event.preventDefault()
        configureGifSearch(configOffset)
        const response = await fetchGifs()
        if (response) {
            props.setGifs(prevGifs => gifSearchConfig.offset
                ? [...prevGifs, ...response.data]
                : [...response.data])
        }
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