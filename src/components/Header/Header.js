import "./Header.css"
import { Link, Outlet } from "react-router-dom"


export default function Header() {
    return (
        <div>
            <nav>
                <div className="header--navbar">
                    <h1 className="header--title">Jiphy</h1>
                    <Link to="/search" className="link">Search</Link>
                    <Link to="/user" className="link">User</Link>
                </div>
                <div className="header--login">
                    <a href="#">Login</a>
                    <a href="#">Register</a>
                </div>
            </nav>
            {/* Outlet will switch between the different paths/components  */}
            <Outlet />
        </div>
    )
}