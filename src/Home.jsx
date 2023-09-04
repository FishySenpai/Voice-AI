import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { TextField,  } from "@mui/material";
import AudioControl from "./AudioControl";
import { useNavigate } from "react-router-dom";
const Home = () => {
  const [description, setDescription] = useState();
  const [loginStatus, setLoginStatus] = useState("");
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState();
  const [selectVoice, setSelectVoice] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [epublic, setpublic] = useState("public");
  const [eprivate, setPrivate] = useState("private");
  const [togglePrivate, setTogglePrivate] = useState(false);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const dropDown = () => {
    setSelectVoice(!selectVoice);
  };
  const Fetch = async () => {
    console.log(description);
    let voiceId = selectedVoice?.voice_id;
    let id = null;
    try {
      const body = { description, id, voiceId };
      const response = await fetch("http://localhost:5000/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };
  const Voices = async () => {
    try {
      const response = await fetch("https://api.elevenlabs.io/v1/voices", {
        method: "GET",
        headers: {
          accept: "application/json",
          "xi-api-key": "2a0e3af64ea95b70b4c92f05411c03c5",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setVoices(data.voices); // Assuming the response is JSON data
      setSelectedVoice(data.voices[0]);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleClick =()=>{
    if(loginStatus){
setPrivate(epublic);
setpublic(eprivate);
setTogglePrivate(!togglePrivate);
    } else {
      navigate("/login")
    }
  }
  return (
    <div>
      <div>
        <button onClick={Voices}>Get voices</button>
      </div>
      {console.log(voices)}
      <div className="relative">
        <div className="px width">
          {console.log(selectedVoice)}
          {selectedVoice ? (
            <div className="flex flex-row">
              <div className="pr">
                <AudioControl audioSrc={selectedVoice.preview_url} />
              </div>
              <div className="pr">{selectedVoice.name}</div>
              <div className="flex flex-row">
                <div className="pr mr border">
                  {selectedVoice.labels.accent}
                </div>
                <div className="pr mr border">{selectedVoice.labels.age}</div>
                <div className="pr mr border">
                  {selectedVoice.labels.gender}
                </div>
                <div className="pr mr border">
                  {selectedVoice.labels.description}
                </div>
              </div>
              <button className="btn-clr" onClick={dropDown}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="30px"
                  viewBox="0 0 320 512"
                >
                  <path d="M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z" />
                </svg>
              </button>
            </div>
          ) : null}

          {selectVoice ? (
            <div className="position-dropdown height">
              {voices?.slice(0, 30).map((voice) => (
                <button
                  onClick={() => {
                    setSelectedVoice(voice);
                  }}
                  className="btn-clr align-left"
                >
                  <div className="flex flex-row ">
                    <div className="pr">
                      <AudioControl audioSrc={voice.preview_url} />
                    </div>
                    <div className="pr clr">{voice.name}</div>
                    <div className="flex flex-row">
                      <div className="pr mr border">{voice.labels.accent}</div>
                      <div className="pr mr border">{voice.labels.age}</div>
                      <div className="pr mr border">{voice.labels.gender}</div>
                      <div className="pr mr border">
                        {voice.labels.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : null}
          <div className="flex flex-col">
            <button
              onClick={() => {
                setTogglePrivate(!togglePrivate);
              }}
            >
              {epublic}
            </button>
            {togglePrivate ? (
              <button
                onClick={handleClick}
              >
                {eprivate}
              </button>
            ) : null}
          </div>
        </div>
      </div>
      <div>{loginStatus}</div>
      <div className="">
        <textarea
        className="text-large"
          style={{ width: "600px", height: "500px" }} // Set the desired width and height
          placeholder="Enter text"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <button onClick={Fetch}>Enter</button>
      </div>
      <div></div>
    </div>
  );
};

export default Home;
