import React,{useEffect} from "react"
import ReactAudioPlayer from "react-audio-player"
import axios from "axios"

export const RecommendSongs=(props)=>{
  const {token, artists, setRecommendTrack, recommendTrack, params, type}=props
  console.log(params)
  useEffect(() => {
    /* 似ている曲を取得 START */
    axios(`https://api.spotify.com/v1/recommendations?limit=10&market=US`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
      params: {
        seed_artists : artists,
        limit: 5,
        max_valence: params.max_valence,
        min_valence: params.min_valence,
        min_danceability: params.min_danceability,
        min_energy:params.min_energy,
        max_energy: params.max_energy,
        target_mode: params.target_mode,
      },
    })
      .then((reaponse) => {
        console.log(reaponse)
        setRecommendTrack(reaponse.data.tracks);
      })
      .catch((err) => {
        console.log("err:", err);
      });

  }, [artists, token]);
  console.log(params)
  return (
    <div className="text-secondary col" style={{ width:"100vw",height: "100vh" }}>
          <h2 className="text-success">{type} Songs</h2>
          {recommendTrack.map(({ id, artists, name, preview_url, album }) => (

          <div
            className="mt-10"
            key={id}
          >
            <div className="d-flex flex-row bd-highlight mt-5 mb-3 text-muted">
            
            <img src={album.images[1].url} style={{ height: "64px", width: "64px" }} alt="アルバム画像" />
            <div className="mx-4">
              <div className="text-secondary ">{artists[0].name}</div>
              <div className="text-muted">{name}</div>
            </div>
          </div>

            {preview_url
            ?<ReactAudioPlayer
              src={preview_url}
              controls
            />
            :<p>No preview music</p>}
          </div>
        ))}
          </div>
  )
}