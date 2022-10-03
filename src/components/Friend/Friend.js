import "./Friend.css"
import { useNavigate } from "react-router-dom";

export default function Friend({ friend }) {
    const navigate = useNavigate();

    const redirectToProfile = (userId) => {
        const path = `/user/${userId}`;
        navigate(path);
    }

    return (
        <div className="friend">
            <h2>{friend.username}</h2>
            <img
                className="avatar-thumbnail"
                src={friend.profilePic?.url}
                alt={`${friend.username}'s avatar`}
                onClick={evt => redirectToProfile(friend._id)} />
        </div>
    )
}