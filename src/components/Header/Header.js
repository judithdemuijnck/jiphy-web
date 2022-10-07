import "./Header.css"
import { Link, Outlet } from "react-router-dom"
import Flash from "../Flash/Flash"


export default function Header(props) {
    const logoutUser = () => {
        props.clearToken()
        props.setLoggedInUser({})
        //clear gifs & searchTerm??
    }

    return (
        <div>
            <nav>
                <div className="header--navbar">
                    <h1 className="header--title">Jiphy</h1>
                    <Link to="/search" className="link">Search</Link>
                    {props.token && <Link to={`/user/${props.loggedInUser._id}`} className="link">Dashboard</Link>}
                </div>
                <div className="header--login">
                    {!props.token && <Link to="/login" className="link">Login</Link>}
                    {!props.token && <Link to="/register" className="link">Register</Link>}
                    {props.token && <a className="link" onClick={logoutUser}>Logout</a>}
                </div>
            </nav>
            <Flash />

            {/* Outlet will switch between the different paths/components  */}
            <Outlet />
        </div>
    )
}