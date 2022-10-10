import "./Friend.css"
import Spinner from "../Spinner/Spinner";
import Placeholder from 'react-bootstrap/Placeholder';
import { useNavigate } from "react-router-dom";

export default function Friend(props) {
    const navigate = useNavigate();

    const redirectToProfile = (userId) => {
        const path = `/user/${userId}`;
        navigate(path);
    }

    return (
        <div className="friend">
            {props.friendIsLoading[props.friend._id] && <Placeholder as="h2" animation="glow">
                <Placeholder xs={8} />
            </Placeholder>}
            <h2 style={{ display: !props.friendIsLoading[props.friend._id] ? "block" : "none" }}>{props.friend.username}</h2>
            {props.friendIsLoading[props.friend._id] && <Spinner />}
            <img
                className="avatar-thumbnail"
                src={props.friend.profilePic?.url}
                alt={`${props.friend.username}'s avatar`}
                style={{ display: !props.friendIsLoading[props.friend._id] ? "block" : "none" }}
                onLoad={() => props.handleLoad(props.friend._id)}
                onClick={() => redirectToProfile(props.friend._id)} />
        </div>
    )
}