import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { TextField, Button, CircularProgress } from "@mui/material";
import AudioControl from "./AudioControl";
import { useNavigate } from "react-router-dom";
import test from "./assets/test.mp3";
import storedVoices from "./assets/storedVoices.json";
import AudioPlayer from "./AudioPlayer";
import WaveSurfer from "wavesurfer.js";
import Waveform from "./WaveForm";
const Home = () => {
  const [description, setDescription] = useState();
  const [loginStatus, setLoginStatus] = useState("");
  const [voices, setVoices] = useState(storedVoices);
  const [selectedVoice, setSelectedVoice] = useState(storedVoices[0]);
  const [selectVoice, setSelectVoice] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [epublic, setPublic] = useState("public");
  const [eprivate, setPrivate] = useState("private");
  const [togglePrivate, setTogglePrivate] = useState(false);
  const [userAudio, setUserAudio] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  const dropDown = () => {
    setSelectVoice(!selectVoice);
  };
    const checkLogin = async () => {
      try {
        const response = await fetch(
          "https://raspberry-goldfish-tam.cyclic.app/login",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        if (response) {
          console.log(response);
          const responseData = await response.json();
          console.log(responseData);
          if (responseData.loggedIn == true) {
            console.log(responseData);
            setLoginStatus(responseData);
          } else {
            console.log("no user");
          }
        }
      } catch (err) {
        console.error(err);
      }
    };
    useEffect(() => {
      checkLogin();
    }, []);
  
  const Fetch = async () => {
    setLoading(true);
    console.log(description);
    let voiceId = selectedVoice?.voice_id;
    let id = loginStatus.id;
    try {
      const body = { description, id, voiceId };
      const response = await fetch(
        "https://raspberry-goldfish-tam.cyclic.app/createAudio",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
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
    setUserAudio(URL.createObjectURL(blob));
  }

  const handleClick = () => {
    if (loginStatus) {
      setPrivate(epublic);
      setPublic(eprivate);
      setTogglePrivate(!togglePrivate);
    } else {
      navigate("/login");
    }
  };
 const handleVoiceSelection = (voice) => {
   setSelectedVoice(voice);
   dropDown();
 };
  return (
    <div>
      {console.log(voices)}
      <div className="relative">
        <div className="px width relative">
          {console.log(selectedVoice)}
          {selectedVoice ? (
            <div className="flex flex-row box-shadow">
              <div className="pr">
                <AudioControl audioSrc={selectedVoice.preview_url} />
              </div>
              <div className="pr">{selectedVoice.name}</div>

              <div className=" mr border btn-h">
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
                <div className=" dropdown-svg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="25px"
                    viewBox="0 0 512 512"
                  >
                    <path
                      d="M233.4 406.6c12.5 12.5 32.8 12.5 45.3 0l192-192c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L256 338.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l192 192z"
                      fill="gray"
                    />
                  </svg>
                </div>
              </button>
            </div>
          ) : null}

          {selectVoice ? (
            <ul className="position-dropdown height ulist ">
              {voices?.slice(0, 30).map((voice) => (
                <li className="list " key={voice.voice_id}>
                  <div className="flex flex-row">
                    <div className="pl">
                      <AudioControl audioSrc={voice.preview_url} />
                    </div>
                    <button
                      onClick={() => {
                        handleVoiceSelection(voice);
                      }}
                      className="btn-clr align-left"
                    >
                      <div className="flex flex-row ">
                        <div className="pr ">{voice.name}</div>
                        <div className="flex flex-row">
                          {voice.labels.accent ? (
                            <div className="pr mr border">
                              {voice.labels.accent}
                            </div>
                          ) : null}

                          {voice.labels.age ? (
                            <div className="pr mr border">
                              {voice.labels.age}
                            </div>
                          ) : null}

                          {voice.labels.gender ? (
                            <div className="pr mr border">
                              {voice.labels.gender}
                            </div>
                          ) : null}

                          {voice.labels.description ? (
                            <div className="pr mr border">
                              {voice.labels.description}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>
      <div>{loginStatus.name}</div>
      <div className="">
        <div className="text-area">
          <textarea
            className="text-large"
            style={{ width: "600px", height: "500px" }} // Set the desired width and height
            placeholder={`Enter the text you want ${selectedVoice?.name} to say`}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>
        <Button variant="contained" color="secondary" onClick={Fetch}>
          Delete
        </Button>
      </div>
      <div>
        {loading && !userAudio ? <CircularProgress /> : null}
        {userAudio && !loading ? (
          <Waveform
            height={100}
            waveColor="rgb(200, 0, 200)"
            progressColor="rgb(100, 0, 100)"
            url={userAudio}
          />
        ) : null}
      </div>
      {/* <Waveform
        height={40}
        waveColor="rgb(200, 0, 200)"
        progressColor="rgb(100, 0, 100)"
        url={test}
      /> */}
    </div>
  );
};

export default Home;
