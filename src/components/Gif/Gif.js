import "./Gif.css"

export default function Gif(props) {
    //send reaction when copied to clipboard - fill in?
    return (
        <div className="gif-container">
            <img className="gif" src={props.gif.url} alt={`${props.gif.title}`} />
            <button style={{ color: props.isFavorite ? "red" : "black" }} onClick={() => props.handleClick(props.gif)} className="favorite-btn material-symbols-outlined">
                favorite</button>
            <button onClick={() => navigator.clipboard.writeText(props.gif.url)} className="material-symbols-outlined copy-Btn">content_copy</button>
        </div>
    )
}