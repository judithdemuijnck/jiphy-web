import './App.css';
import Header from '../Header/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SearchEngine from '../routes/SearchEngine/SearchEngine';
import User from '../routes/User/User';
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [favoriteGifs, setFavoriteGifs] = useState([]);
  const [gifs, setGifs] = useState([])
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {

    const handleScroll = () => {
      if (window.pageYOffset >= document.body.clientHeight - window.innerHeight) {
        console.log("end of page")
      }
    }
    // HOW THE FUCK TO YOU DEBOUNCE (IN REACT)
    window.addEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const getGifs = async () => {
      const response = await axios.get("http://localhost:8080/gifs")
      setGifs(response.data)
    }
    getGifs()
  }, [favoriteGifs])

  const getSearchTerm = (event) => {
    setSearchTerm(event.target.value)
  }

  const searchGifs = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`http://localhost:8080/gifs/search?searchTerm=${searchTerm}`);
      setGifs(response.data)
    }
    catch (e) {
      console.log("Something went wrong");
      console.log(e)
    }
  }

  const toggleFavorite = async gif => {
    try {
      const response = await axios.post("http://localhost:8080/gifs/favorites", { favoriteGif: gif })
      setFavoriteGifs(response.data)
    }
    catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header />}>
            <Route path="/search" element={<SearchEngine
              toggleFavorite={toggleFavorite}
              gifs={gifs}
              searchTerm={searchTerm}
              getSearchTerm={getSearchTerm}
              searchGifs={searchGifs} />} />
            <Route path="/user" element={<User
              favoriteGifs={favoriteGifs}
              toggleFavorite={toggleFavorite} />} />

          </Route>
        </Routes></BrowserRouter>
    </div >
  );
}



export default App;

//header with login function
// ROUTER
// 1
// /search/:serch-term engine
// display Gif components w heart btn to favorite & click to copy link
// 2 /user/:user
// displays username & favorites for now
// 3 login

