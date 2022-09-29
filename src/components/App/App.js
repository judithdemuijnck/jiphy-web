import './App.css';
import Header from '../Header/Header';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import SearchEngine from '../routes/SearchEngine/SearchEngine';
import User from '../routes/User/User';
import Login from '../Login/Login';
import Register from '../Register/Register';
import { useState, useEffect } from "react";
import axios from "axios";
import useToken from './useToken';

function App() {
  const [gifs, setGifs] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState({})
  const { token, setToken, clearToken } = useToken();

  const verifyToken = async () => {
    //verifies Token and sets currentUser if valid token exists
    axios.get("http://localhost:8080/user", { headers: { token: token } })
      .then(res => {
        setCurrentUser(res.data.user)
      })
      .catch(err => {
        clearToken()
        setCurrentUser({})
      })
  }

  useEffect(() => {
    verifyToken()
  }, [])

  useEffect(() => {
    // is this throttling?
    const intervalId = setInterval(async () => {
      verifyToken()
    }, 300000)

    return () => clearInterval(intervalId)
  })

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
    // refreshes gifs if changes are made to currentUser
    axios.get("http://localhost:8080/gifs")
      .then(res => setGifs(res.data))
      .catch(e => console.log(e))
  }, [currentUser])


  const getSearchTerm = (event) => {
    setSearchTerm(event.target.value)
  }

  const searchGifs = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get(`http://localhost:8080/gifs/search?searchTerm=${searchTerm}`, { headers: { token: token } });
      setGifs(response.data)
    }
    catch (e) {
      console.log("Something went wrong");
      console.log(e)
    }
  }

  const toggleFavorite = async gif => {
    try {
      const response = await axios.post("http://localhost:8080/gifs/favorites", { favoriteGif: gif }, { headers: { token: token } })
      setCurrentUser(response.data.user)
    }
    catch (err) {
      console.log(err)
    }
  }

  console.log("currentUser", currentUser)

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header
            token={token}
            clearToken={clearToken} />}>
            <Route path="/search" element={<SearchEngine
              token={token}
              toggleFavorite={toggleFavorite}
              gifs={gifs}
              searchTerm={searchTerm}
              getSearchTerm={getSearchTerm}
              searchGifs={searchGifs} />} />
            <Route path="/user" element={<User
              toggleFavorite={toggleFavorite}
              token={token}
              setToken={setToken}
              currentUser={currentUser}
              setCurrentUser={setCurrentUser} />} />
            <Route path="/login"
              element={token ? <Navigate to="/user" /> : <Login
                token={token}
                setToken={setToken}
                setCurrentUser={setCurrentUser} />} />
            <Route path="/register"
              element={token ? <Navigate to="/user" /> : <Register
                setToken={setToken}
                setCurrentUser={setCurrentUser} />} />
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

