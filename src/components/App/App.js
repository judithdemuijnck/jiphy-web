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
import Bus from "../../utils/Bus"



function App() {
  const [gifs, setGifs] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [loggedInUser, setLoggedInUser] = useState({})
  const [gifSearchConfig, setGifSearchConfig] = useState({})
  const { token, setToken, clearToken } = useToken();

  window.flash = (message, type = "success") => {
    Bus.emit("flash", ({ message, type }))
  }

  const verifyToken = async () => {
    //verifies Token and sets loggedInUser if valid token exists
    axios.get("http://localhost:8080/user", { headers: { token: token } })
      .then(res => {
        setLoggedInUser(res.data.user)
      })
      .catch(err => {
        clearToken()
        setLoggedInUser({})
        window.flash(err.response.data.flash, "danger")
      })
  }

  useEffect(() => {
    verifyToken()
  }, [])

  useEffect(() => {
    // is this throttling?
    const intervalId = setInterval(async () => {
      if (Object.keys(loggedInUser).length === 0) {
        verifyToken()
      }
    }, 300000)

    return () => clearInterval(intervalId)
  })

  useEffect(() => {
    // it seems hacky to make this call in useEffect ... is this the best solution?
    const searchForGifs = async () => {
      try {
        const response = await axios.get("http://localhost:8080/gifs",
          { params: gifSearchConfig },
          { headers: { token: token } });
        if (gifSearchConfig.offset) {
          setGifs(prevGifs => [...prevGifs, ...response.data])
        } else {
          setGifs(response.data)
        }
      }
      catch (err) {
        window.flash(err.response.data.flash, "danger")
      }
    }

    if (searchTerm) {
      searchForGifs()
    }

  }, [gifSearchConfig])


  const getSearchTerm = (event) => {
    setSearchTerm(event.target.value)
  }

  const configureGifSearch = async (event, offset) => {
    event.preventDefault();
    if (offset) {
      setGifSearchConfig(prevConfig => {
        return { searchTerm: searchTerm, offset: prevConfig.offset += offset }
      })
    } else {
      setGifSearchConfig({ searchTerm: searchTerm, offset: offset })
    }
  }

  const toggleFavorite = async gif => {
    try {
      const response = await axios.post("http://localhost:8080/gifs/favorites", { favoriteGif: gif }, { headers: { token: token } })
      setLoggedInUser(response.data.user)
    }
    catch (err) {
      window.flash(err.response.data.flash, "danger")
    }
  }


  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header
            token={token}
            clearToken={clearToken}
            loggedInUser={loggedInUser}
            setLoggedInUser={setLoggedInUser} />}>
            <Route path="/search" element={<SearchEngine
              token={token}
              toggleFavorite={toggleFavorite}
              gifs={gifs}
              searchTerm={searchTerm}
              getSearchTerm={getSearchTerm}
              configureGifSearch={configureGifSearch}
              loggedInUser={loggedInUser} />} />
            <Route path="/user/undefined" element={<Navigate to="/user" />} />
            <Route path="/user/:userId" element={<User
              toggleFavorite={toggleFavorite}
              token={token}
              setToken={setToken}
              loggedInUser={loggedInUser}
              setLoggedInUser={setLoggedInUser} />} />
            <Route path="/login"
              element={token ? <Navigate to={`/user/${loggedInUser._id}`} /> : <Login
                token={token}
                setToken={setToken}
                loggedInUser={loggedInUser}
                setLoggedInUser={setLoggedInUser} />} />
            <Route path="/register"
              element={token ? <Navigate to={`/user/${loggedInUser._id}`} /> : <Register
                setToken={setToken}
                setLoggedInUser={setLoggedInUser} />} />
            <Route
              path="*"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
          </Route>
        </Routes></BrowserRouter>
    </div >
  );
}



export default App;




