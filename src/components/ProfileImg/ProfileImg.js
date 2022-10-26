import { useState } from "react"
import Spinner from "../Spinner/Spinner"

export default function ProfileImg(props) {
    const [isLoading, setIsLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)

    const handleSubmit = (event) => {
        setIsEditing(false)
        setIsLoading(true)
        const data = new FormData()
        data.append("profilePic", event.target.files[0])
        props.sendData("profilePic", data)
    }

    return (
        <div>
            {(isLoading || props.imageIsUploading) && <Spinner />}
            {props.image && <div className="profile-section profilePic">
                {!isEditing && <img src={props.image}
                    className="profile-pic"
                    alt={`User ${props.username}' avatar`}
                    style={{ display: isLoading ? "none" : "block" }}
                    onLoad={() => setIsLoading(false)} />}
                {!isEditing && props.isLoggedInUser && <button name="profilePic" onClick={() => setIsEditing(true)}
                    className="material-symbols-outlined"> Edit
                </button>}
                {isEditing && props.isLoggedInUser && <input
                    type="file"
                    name="profilePic"
                    onChange={e => handleSubmit(e)}
                />}
            </div>}
        </div>
    )
}