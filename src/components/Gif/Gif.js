import "./Gif.css"

export default function Gif(props) {
    return (
        <div className="gif-container">
            <img className="gif" src={props.gif.url} alt={`${props.gif.title}`} />
            <button style={{ color: props.gif.isFavorite ? "red" : "black" }} onClick={() => props.handleClick(props.gif)} className="favorite-btn">&hearts;</button>
        </div>
    )
}