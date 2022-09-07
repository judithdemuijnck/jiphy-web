import './App.css';
import Header from '../Header/Header';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SearchEngine from '../routes/SearchEngine/SearchEngine';
import User from '../routes/User/User';
import { useState } from "react"

function App() {
  const [favoriteGifs, setFavoriteGifs] = useState([]);

  const addToFavorites = (gifUrl, searchTerm, actionFunc) => {
    setFavoriteGifs(prevFavoriteGifs => {
      return [...prevFavoriteGifs, { url: gifUrl, searchTerm: searchTerm, handleClick: actionFunc }]
    })
  }

  console.log(favoriteGifs)
  // SHIT it doesn't know which button got pressed, add ids to button, looks at tenzies game how to fix this
  // just a massive list of all of the gifs

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Header />}>
            <Route path="/search" element={<SearchEngine addToFavorites={addToFavorites} />} />
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

