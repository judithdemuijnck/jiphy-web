import './App.css';
import Header from '../Header/Header';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import SearchEngine from '../routes/SearchEngine/SearchEngine';
import User from '../routes/User/User';
import Login from '../Login/Login';
import Register from '../Register/Register';
import Index from '../Index/Index';
import { useState, useEffect } from "react";
import axios from "axios";
import useToken from './useToken';
import Bus from "../../utils/Bus"

function App() {
  const [gifs, setGifs] = useState([])
  const [gifIsLoading, setGifIsLoading] = useState({})
  const [searchTerm, setSearchTerm] = useState("");
  const [loggedInUser, setLoggedInUser] = useState({})

  const { token, setToken, clearToken } = useToken();

  const baseUrl = "http://localhost:8080"
  const headerConfig = { headers: { token: token } }

  window.flash = (message, type = "success") => {
    Bus.emit("flash", ({ message, type }))
  }

  const verifyToken = async () => {
    //verifies Token and sets loggedInUser if valid token exists
    axios.get(`${baseUrl}/user`, headerConfig)
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
    setGifIsLoading(prevLoading => {
      gifs.map(gif => prevLoading[gif._id] = true)
      return { ...prevLoading }
    })
  }, [gifs])

  const gifFinishedLoading = (gifId) => {
    console.log("triggered")
    setGifIsLoading(prevLoading => {
      prevLoading[gifId] = false
      return { ...prevLoading }
    })
  }

  const toggleFavorite = async gif => {
    try {
      const response = await axios.post(`${baseUrl}/gifs/favorites`, { favoriteGif: gif }, headerConfig)
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
            setLoggedInUser={setLoggedInUser}
            setSearchTerm={setSearchTerm}
            setGifs={setGifs} />}>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<SearchEngine
              token={token}
              toggleFavorite={toggleFavorite}
              gifs={gifs}
              setGifs={setGifs}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              loggedInUser={loggedInUser}
              gifIsLoading={gifIsLoading}
              setGifIsLoading={setGifIsLoading}
              gifFinishedLoading={gifFinishedLoading}
              baseUrl={baseUrl}
              headerConfig={headerConfig} />} />
            <Route path="/user/undefined" element={<Navigate to="/user" />} />
            <Route path="/user/:userId" element={<User
              toggleFavorite={toggleFavorite}
              token={token}
              setToken={setToken}
              loggedInUser={loggedInUser}
              setLoggedInUser={setLoggedInUser}
              baseUrl={baseUrl}
              headerConfig={headerConfig} />} />
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