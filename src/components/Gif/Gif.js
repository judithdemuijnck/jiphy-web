import "./Gif.css"

export default function Gif(props) {
    return (
        <img className="gif" src={props.url} alt={`${props.searchTerm} gif`} />
    )
}