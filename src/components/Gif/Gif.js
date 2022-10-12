import "./Gif.css"
import Spinner from "../Spinner/Spinner"
import { useState } from "react"

export default function Gif(props) {
    const [copiedLink, setCopiedLink] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const displayStyles = !isLoading ? "block" : "none"

    const copyUrl = (url) => {
        setCopiedLink(url)
        navigator.clipboard.writeText(url)
        setTimeout(() => {
            setCopiedLink("")
        }, 5000)
    }

    return (
        <div className="gif-container">
            {isLoading && <Spinner />}
            <img
                className="gif"
                src={props.gif.url}
                alt={`${props.gif.title}`}
                style={{ display: displayStyles }}
                onLoad={() => setIsLoading(false)}
            />
            <button
                style={{
                    color: props.isFavorite ? "red" : "black",
                    display: displayStyles
                }}
                onClick={() => props.handleClick(props.gif)}
                className={`favorite-btn material-symbols-outlined ${props.isFavorite ? "filled" : ""}`}>
                favorite</button>
            <button
                style={{
                    display: displayStyles,
                    color: copiedLink ? "green" : "black"
                }}
                onClick={() => copyUrl(props.gif.url)}
                className={`copy-btn material-symbols-outlined ${copiedLink ? "filled" : ""}`}>content_copy</button>
        </div>
    )
}
