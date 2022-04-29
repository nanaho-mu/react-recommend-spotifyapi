import './App.css';
import {useEffect, useState} from "react";
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node"
import 'bootstrap/dist/css/bootstrap.min.css';

const spotifyApi = new SpotifyWebApi({
  clientId: "ef95ae2b24034ef6b63c47e5317c0345",
})

function App() {
  const CLIENT_ID=process.env.REACT_APP_CLIENT_ID
  const REDIRECT_URI=process.env.REACT_APP_REDIRECT_URI
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken]=useState("")
  const [search, setSearch]=useState("")
  const [artists, setArtists]=useState("")


  useEffect(()=>{
    const hash=window.location.hash
    // localStorageからデータを取得する,取得したいデータのkeyを指定して取り出せる
    let token=window.localStorage.getItem("token")

    if (!token&&hash){
      token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]
      console.log(token)
      window.location.hash = ""
      window.localStorage.setItem("token", token)
    }
    setToken(token)
  },[])

  useEffect(() => {
    if (!token) return
    spotifyApi.setAccessToken(token)
  }, [token])

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  const searchArtists=async (e)=>{
    e.preventDefault()
    const {data}=await axios.get("https://api.spotify.com/v1/search", {
      headers: {
        Authorization: `Bearer ${token}`
    },
    params: {
        q: search,
        type:"artist"
    }
    })
 
    setArtists(data.artists.items[0].id)

  }
  console.log(artists)

return (
  <div className="App bg-black" style={{ width: "100vw", height:"100vh"  }}>
    <header className="App-header m-10 bg-black">
      <h1 className="pt-3 text-center text-success">Spotify React</h1>
      {!token?
      <div className="text-center m-5"><a className="btn btn-success p-3 text-white" role="button" href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}`}>Login to Spotify</a></div>
      
      :<div className="text-right"><button className="btn btn-success" type="button" onClick={logout}>Logout</button></div>}
    </header>
  </div>
)}

export default App;