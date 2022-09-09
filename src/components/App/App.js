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
  const [searchTerm, setSearchTerm] = useState("")
  const [config, setConfig] = useState({
    params: {
      q: searchTerm,
      api_key: process.env.REACT_APP_GIPHY_API_KEY,
      limit: 24,
      offset: 0
    }
  })

  useEffect(() => {
    setConfig(prevConfig => ({ params: { ...prevConfig.params, q: searchTerm, offset: 0 } }))
    setGifs([])
  }, [searchTerm])

  useEffect(() => {

    const handleScroll = () => {
      if (window.pageYOffset >= document.body.clientHeight - window.innerHeight) {
        console.log("end of page")
      }
    }
    // HOW THE FUCK TO YOU DEBOUNCE (IN REACT)
    window.addEventListener("scroll", handleScroll)
  }, [])

  const getSearchTerm = (event) => {
    setSearchTerm(event.target.value)
  }

  const getGifs = async (event) => {
    event.preventDefault()
    const res = await axios.get("https://api.giphy.com/v1/gifs/search", config)
    if (config.params.offset === 0) {
      setGifs(res.data.data)
    } else {
      setGifs(prevGifs => [...prevGifs, ...res.data.data])
    }
    setConfig(prevConfig => ({ params: { ...prevConfig.params, offset: config.params.offset += 24 } }))
  }

  const addToFavorites = (gifUrl, searchTerm, actionFunc) => {
    setFavoriteGifs(prevFavoriteGifs => {
      return [...prevFavoriteGifs, { url: gifUrl, searchTerm: searchTerm, handleClick: actionFunc }]
    })
  }
  //turn this into toggle favorites eventually

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header />}>
            <Route path="/search" element={<SearchEngine
              addToFavorites={addToFavorites}
              gifs={gifs}
              searchTerm={searchTerm}
              getSearchTerm={getSearchTerm}
              getGifs={getGifs} />} />
            <Route path="/user" element={<User favoriteGifs={favoriteGifs} />} />

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

