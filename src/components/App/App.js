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

function App() {
  const [gifs, setGifs] = useState([])
  const [searchTerm, setSearchTerm] = useState("");
  const [loggedInUser, setLoggedInUser] = useState({})
  const [flash, setFlash] = useState({})

  const { token, setToken, clearToken } = useToken();

  const baseUrl = "http://localhost:8080"
  const headerConfig = { headers: { token: token } }

  const verifyToken = async () => {
    //verifies Token and sets loggedInUser if valid token exists
    axios.get(`${baseUrl}/users`, headerConfig)
      .then(res => {
        setLoggedInUser(res.data.user)
      })
      .catch(err => {
        clearToken()
        setLoggedInUser({})
        setFlash({ type: "danger", message: err.response.data.flash })
      })
  }

  useEffect(() => {
    verifyToken()
  }, [])

  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (Object.keys(loggedInUser).length === 0) {
        verifyToken()
      }
    }, 300000)

    return () => clearInterval(intervalId)
    // SE: Best Practice: You can add [] to the arguments list here, you only need to set this interval up once, at the moment its firing on every render
    // JdM: So I want this to fire more than once in case the token expires while the user is still logged in
    // That's why I'm verifying the token every 5 minutes
    // Technically the server verifies the token as well, but only during a new request, so the user would still be able to see the page they are currently on
    // Is there a better way to do this?
    
    // SE: Its fine to have a timer like this, as opposed to redirecting on a 401/unauthorized. However at the moment, it will be setting up a new set timeout EVERY render (try and console log intervalId!). This is not good for performance, as you only need one listener. So you set up ONE listener that fires EVERY interval (by adding the brackets as the second argument)
  }, [loggedInUser, verifyToken])

  const logoutUser = () => {
    clearToken()
    setLoggedInUser({})
    setSearchTerm("")
    setGifs([])
    setFlash({ type: "success", message: "Successfully logged out" })
  }

  const toggleFavorite = async gif => {
    try {
      const response = await axios.post(`${baseUrl}/gifs/favorites`, { favoriteGif: gif }, headerConfig)
      setLoggedInUser(response.data.user)
    }
    catch (err) {
      setFlash({
        type: "danger", message: err.response.data.flash
      })
    }
  }

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header
            token={token}
            logoutUser={logoutUser}
            loggedInUser={loggedInUser}
            flash={flash} />}>
            <Route path="/" element={<Index />} />
            <Route path="/search" element={<SearchEngine
              token={token}
              toggleFavorite={toggleFavorite}
              gifs={gifs}
              setGifs={setGifs}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              loggedInUser={loggedInUser}
              baseUrl={baseUrl}
              headerConfig={headerConfig}
              setFlash={setFlash} />} />
            <Route path="/user/undefined" element={<Navigate to="/user" />} />
            <Route path="/user/:userId" element={<User
              toggleFavorite={toggleFavorite}
              token={token}
              setToken={setToken}
              loggedInUser={loggedInUser}
              setLoggedInUser={setLoggedInUser}
              baseUrl={baseUrl}
              headerConfig={headerConfig}
              setFlash={setFlash} />} />
            <Route path="/login"
              element={token ? <Navigate to={`/user/${loggedInUser._id}`} /> : <Login
                token={token}
                setToken={setToken}
                loggedInUser={loggedInUser}
                setLoggedInUser={setLoggedInUser}
                setFlash={setFlash} />} />
            <Route path="/register"
              element={token ? <Navigate to={`/user/${loggedInUser._id}`} /> : <Register
                setToken={setToken}
                setLoggedInUser={setLoggedInUser}
                setFlash={setFlash} />} />
            <Route
              path="/user"
              element={
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
                </main>
              }
            />
            <Route path="*" element={<Index />} />
          </Route>
        </Routes></BrowserRouter>
    </div >
  );
}

export default App;