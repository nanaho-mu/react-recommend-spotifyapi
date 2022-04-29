import {useEffect, useState} from "react";
import axios from "axios";
import SpotifyWebApi from "spotify-web-api-node"
import { RecommendSongs } from './RecommendSongs';
import 'bootstrap/dist/css/bootstrap.min.css';

const spotifyApi = new SpotifyWebApi({
  clientId: "ef95ae2b24034ef6b63c47e5317c0345",
})

function App() {
  const CLIENT_ID=process.env.REACT_APP_CLIENT_ID
  const REDIRECT_URI=process.env.REACT_APP_REDIRECT_URI
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"
  console.log(CLIENT_ID)

  const [token, setToken]=useState("")
  const [search, setSearch]=useState("")
  const [artists, setArtists]=useState("")
  const [recommendHappyTrack, setRecommendHappyTrack]=useState([])
  const [recommendDarkTrack, setRecommendDarkTrack]=useState([])

  const paramsHappy={
    seed_artists : artists,
    limit: 5,
    min_valence: 0.8,
    max_valence: 1.0,
    min_danceability: 0.6,
    min_energy: 0.7,
    max_energy: 1.0,
    target_mode: 1,
  }
  const paramsSad={
    seed_artists : artists,
    max_valence: 0.2,
    min_valence:0.0,
    limit:5,
    min_danceability: 0.0,
    min_energy: 0.0,
    max_energy: 0.5,
    target_mode: 0,
  }


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
    {token?
      <>
      <form className="d-flex flex-row bd-highlight mb-3 mt-5 text-muted" onSubmit={searchArtists}>

        <input  className="form-control mx-10" style={{ width: "300px" }} placeholder="search" value={search} onChange={e=>setSearch(e.target.value)} />
        <button class="btn btn-success" type={"submit"} >Search</button>
      </form>
      <div className="d-flex flex-column bg-black" style={{ width:"100vw",height: "100vh" }}>
        <div className="bg-black">
        <div className="container">
        <div className="row d-flex flex-row bd-black mt-5 text-muted flex-grow-1" style={{ overflowY: "auto", width:"100vw",height: "100vh" }}>
          <RecommendSongs  token={token} artists={artists} setRecommendTrack={setRecommendHappyTrack} recommendTrack={recommendHappyTrack} params={paramsHappy} type={"Happy"}/>
          <RecommendSongs token={token} artists={artists} setRecommendTrack={setRecommendDarkTrack}
          recommendTrack={recommendDarkTrack} params={paramsSad} type={"Sad"}/>
        </div>
        </div>
      </div>
      </div>
      </>
      :<h4 className="p-3 text-white text-center bg-black">Please login!</h4>}
  </div>
)}

export default App;