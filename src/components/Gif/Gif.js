import "./Gif.css"

export default function Gif(props) {
    return (
        <div className="gif-container">
            <img className="gif" src={props.gif.url} alt={`${props.gif.title}`} />
            <button onClick={() => props.handleClick(props.gif.url, props.gif.searchTerm, props.handleClick)} className="favorite-btn">&hearts;</button>
            {/* check how to fill in heart */}
            {/* create state isFavorite - if isFavorite, func removeFromFaves */}
        </div>
    )
}