import "./Friend.css"
import Spinner from "../Spinner/Spinner";
import Placeholder from 'react-bootstrap/Placeholder';
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Friend({ friend }) {
    const [isLoading, setIsLoading] = useState(true)
    const navigate = useNavigate();

    const redirectToProfile = (userId) => {
        const path = `/user/${userId}`;
        navigate(path);
    }

    return (
        <div className="friend">
            {isLoading && <Placeholder as="h2" animation="glow">
                <Placeholder xs={8} />
            </Placeholder>}
            <h2 style={{ display: !isLoading ? "block" : "none" }}>{friend.username}</h2>
            {isLoading && <Spinner />}
            <img
                className="avatar-thumbnail"
                src={friend.profilePic?.url}
                alt={`${friend.username}'s avatar`}
                style={{ display: !isLoading ? "block" : "none" }}
                onLoad={() => setIsLoading(false)}
                onClick={() => redirectToProfile(friend._id)} />
        </div>
    )
}