import SearchBar from "../../SearchBar/SearchBar";
import Gif from "../../Gif/Gif";
import { useState, useEffect } from "react";
import axios from "axios";
import "./SearchEngine.css"

export default function SearchEngine(props) {
    const displayGifs = props.gifs.map(gif => {
        return (
            <Gif
                key={gif.id}
                id={gif.id}
                url={gif.images.fixed_height.url}
                searchTerm={props.searchTerm}
                handleClick={props.addToFavorites} />)
    })

    return (
        <div>
            <SearchBar
                handleChange={props.getSearchTerm}
                value={props.searchTerm}
                handleClick={props.getGifs} />

            <div className="display-gifs">
                {displayGifs}
                {displayGifs.length > 0 && <button onClick={props.getGifs} className="more-gifs-btn">Load more Gifs</button>}
            </div>
        </div>

    )
}