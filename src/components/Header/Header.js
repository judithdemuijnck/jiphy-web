import "./Header.css"
import { Link, Outlet, useNavigate } from "react-router-dom"
import Flash from "../Flash/Flash"


export default function Header(props) {
    const navigate = useNavigate()

    const handleClick = () => {
        props.logoutUser()
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
                    {props.token && <button className="link" onClick={handleClick}>Logout</button>}
                </div>
            </nav>
            <Flash flash={props.flash} />

            {/* Outlet will switch between the different paths/components  */}
            <Outlet />
        </div>
    )
}