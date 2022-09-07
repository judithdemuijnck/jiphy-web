import "./Header.css"

export default function Header() {
    return (
        <nav>
            <div className="header--navbar">
                <h1 className="header--title">Jiphy</h1>
                <a href="#">Search</a>
                <a href="#">User</a>
            </div>
            <div className="header--login">
                <a href="#">Login</a>
                <a href="#">Register</a>
            </div>
        </nav>
    )
}