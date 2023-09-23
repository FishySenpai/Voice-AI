import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { TextField, Button, CircularProgress } from "@mui/material";
import AudioControl from "./AudioControl";
import { useNavigate } from "react-router-dom";
import test from "./assets/test.mp3";
import storedVoices from "./assets/storedVoices.json"
import AudioPlayer from "./AudioPlayer";
const Home = () => {
  const [description, setDescription] = useState();
  const [loginStatus, setLoginStatus] = useState("");
  const [voices, setVoices] = useState(storedVoices);
  const [selectedVoice, setSelectedVoice] = useState(storedVoices[0]);
  const [selectVoice, setSelectVoice] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [epublic, setpublic] = useState("public");
  const [eprivate, setPrivate] = useState("private");
  const [togglePrivate, setTogglePrivate] = useState(false);
  const [userAudio, setUserAudio] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const dropDown = () => {
    setSelectVoice(!selectVoice);
  };
  const Fetch = async () => {
    setLoading(true);
    console.log(description);
    let voiceId = selectedVoice?.voice_id;
    let id = null;
    try {
      const body = { description, id, voiceId };
      const response = await fetch("http://localhost:5000/createAudio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const jsonData = await response.json();
      bufferToDataUrl(jsonData.data, "audio/mpeg");
      console.log(jsonData);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  function bufferToDataUrl(buffer, mimeType) {
    // Convert the Buffer to a Uint8Array
    const uint8Array = new Uint8Array(buffer);

    // Create a Blob from the Uint8Array
    const blob = new Blob([uint8Array], { type: mimeType });

    // Create a data URL from the Blob
    console.log(URL.createObjectURL(blob));
   setUserAudio(URL.createObjectURL(blob))
  }

  const handleClick = () => {
    if (loginStatus) {
      setPrivate(epublic);
      setpublic(eprivate);
      setTogglePrivate(!togglePrivate);
    } else {
      navigate("/login");
    }
  };
  return (
    <div>
      {console.log(voices)}
      <div className="relative">
        <div className="px width">
          {console.log(selectedVoice)}
          {selectedVoice ? (
            <div className="flex flex-row box-shadow">
              <div className="pr">
                <AudioControl audioSrc={selectedVoice.preview_url} />
              </div>
              <div className="pr">{selectedVoice.name}</div>

              <div className="pr mr border btn-h">
                {selectedVoice.labels.accent}
              </div>
              <div className="pr mr border btn-h">
                {selectedVoice.labels.age}
              </div>
              <div className="pr mr border btn-h">
                {selectedVoice.labels.gender}
              </div>
              <div className="pr mr border btn-h">
                {selectedVoice.labels.description}
              </div>

              <button className="reset-btn" onClick={dropDown}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="25px"
                  viewBox="0 0 512 512"
                >
                  <path d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z" />
                </svg>
              </button>
            </div>
          ) : null}

          {selectVoice ? (
            <ul className="position-dropdown height ulist">
              {voices?.slice(0, 30).map((voice) => (
                <li className="list " key={voice.voice_id}>
                  <div className="flex flex-row">
                    <div className="">
                      <AudioControl audioSrc={voice.preview_url} />
                    </div>
                    <button
                      onClick={() => {
                        setSelectedVoice(voice);
                        dropDown();
                      }}
                      className="btn-clr align-left"
                    >
                      <div className="flex flex-row ">
                        <div className="pr clr">{voice.name}</div>
                        <div className="flex flex-row">
                          <div className="pr mr border">
                            {voice.labels.accent}
                          </div>
                          <div className="pr mr border">{voice.labels.age}</div>
                          <div className="pr mr border">
                            {voice.labels.gender}
                          </div>
                          <div className="pr mr border">
                            {voice.labels.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
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
              <button onClick={handleClick}>{eprivate}</button>
            ) : null}
          </div>
        </div>
      </div>
      <div>{loginStatus}</div>
      <div className="">
        <div>
          <textarea
            className="text-large"
            style={{ width: "600px", height: "500px" }} // Set the desired width and height
            placeholder="Enter text"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>
        <Button variant="contained" color="secondary" onClick={Fetch}>
          Enter
        </Button>
      </div>
      <div>
        {loading && !userAudio ? <CircularProgress /> : null}
        {userAudio && !loading ? (
          <div className="audio-width">
            <AudioPlayer audioSrc={userAudio} />
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Home;
