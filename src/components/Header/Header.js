import "./Header.css"
import { Link, Outlet } from "react-router-dom"


export default function Header(props) {
    const logoutUser = () => {
        props.clearToken()
        props.setLoggedInUser({})
        //some action in api
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
            {/* Outlet will switch between the different paths/components  */}
            <Outlet />
        </div>
    )
}