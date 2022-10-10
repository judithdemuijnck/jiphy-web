import "./Gif.css"
import Spinner from "../Spinner/Spinner"
import { useState } from "react"

export default function Gif(props) {
    const [copiedLink, setCopiedLink] = useState("")
    let copyClass = ""
    let copyColor = "black"

    const copyUrl = (url) => {
        setCopiedLink(url)
        navigator.clipboard.writeText(url)
        setTimeout(() => {
            setCopiedLink("")
        }, 5000)
    }


    return (
        <div className="gif-container">
            <img
                className="gif"
                src={props.gif.url}
                alt={`${props.gif.title}`}
                style={{ display: !props.gifIsLoading[props.gif._id] ? "block" : "none" }}
                onLoad={() => props.handleLoad(props.gif._id)} />
            {props.gifIsLoading[props.gif._id] && <Spinner />}
            <button
                style={{
                    color: props.isFavorite ? "red" : "black",
                    display: !props.gifIsLoading[props.gif._id] ? "block" : "none"
                }}
                onClick={() => props.handleClick(props.gif)}
                className={`favorite-btn material-symbols-outlined ${props.isFavorite ? "filled" : ""}`}>
                favorite</button>
            <button
                style={{
                    display: !props.gifIsLoading[props.gif._id] ? "block" : "none",
                    color: copiedLink ? "green" : "black"
                }}
                onClick={() => copyUrl(props.gif.url)}
                className={`copy-btn material-symbols-outlined ${copiedLink ? "filled" : ""}`}>content_copy</button>
        </div>
    )
}

// change class on HOVER??

// BUTTON FRIEND

// SET FRONT PAGE /