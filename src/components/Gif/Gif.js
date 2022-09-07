import "./Gif.css"

export default function Gif(props) {
    return (
        <div className="gif-container">
            <img className="gif" src={props.url} alt={`${props.searchTerm} gif`} />
            <button onClick={props.handleClick(props.url, props.searchTerm, props.handleClick)} className="favorite-btn">&hearts;</button>
            {/* check how to fill in heart */}
            {/* create state isFavorite - if isFavorite, func removeFromFaves */}
        </div>
    )
}