import "./Friends.css"

export default function Friends(props) {
    console.log(props.selectedUser)
    return (
        <div>
            <h1>Friends</h1>
            {props.selectedUser.friends?.map(friend => {
                return (<h2>{friend.username}</h2>)
            })}
        </div>
    )
}