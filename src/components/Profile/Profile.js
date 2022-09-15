import "./Profile.css";

export default function Profile(props) {
    return (
        <div className="profile-card">
            <h1>{props.user.username}</h1>
            <img className="profile-pic" src="https://images.unsplash.com/photo-1576518985988-ff8f8fc5a623?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80" alt="user" />
            <h2>{props.user.email}</h2>
            <h2>{props.user.location ? props.user.location : "no location"}</h2>
            <p>Bio Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </div>
    )
}