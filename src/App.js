import './App.css';
import {useEffect, useState} from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const CLIENT_ID=process.env.REACT_APP_CLIENT_ID
  const REDIRECT_URI=process.env.REACT_APP_REDIRECT_URI
  const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize"
  const RESPONSE_TYPE = "token"

  const [token, setToken]=useState("")

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

return (
  <>
  <h1>hello</h1>
  </>
)}

export default App;