import "./Header.css"
import { Link, Outlet, useNavigate } from "react-router-dom"
import Flash from "../Flash/Flash"


export default function Header(props) {
    const navigate = useNavigate()

    // SE: Best Practice: The logout function is probably best placed at an app level. Then you can just fire a callback (props.clickLogout) in this component
    const logoutUser = () => {
        props.clearToken()
        props.setLoggedInUser({})
        props.setSearchTerm("")
        props.setGifs([])
        window.flash("Successfully logged out")
        navigate("/")
    }

    return (
        <div>
            <nav>
                <div className="header--navbar">
                    <Link to="/" className="header--title">Jiphy</Link>
                    <Link to="/search" className="link">Search</Link>
                    {props.token && <Link to={`/user/${props.loggedInUser._id}`} className="link">Dashboard</Link>}
                </div>
                <div className="header--login">
                    {!props.token && <Link to="/login" className="link">Login</Link>}
                    {!props.token && <Link to="/register" className="link">Register</Link>}
                    {props.token && <button className="link" onClick={logoutUser}>Logout</button>}
                </div>
            </nav>
            <Flash />

            {/* Outlet will switch between the different paths/components  */}
            <Outlet />
        </div>
    )
}