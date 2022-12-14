import "./SearchBar.css";

export default function SearchBar(props) {

    return (
        <form className="search-engine">
            <input className="search-input" onChange={e => props.handleChange(e)} value={props.value} type="text" placeholder="Search for gifs"></input>
            <button className="submit-search-btn" onClick={e => props.handleClick(e, 0)}><span className="material-symbols-outlined">
                search
            </span></button>
        </form>
    )
}