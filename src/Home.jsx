import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import AudioControl from "./AudioControl";
const Home = () => {
  const [description, setDescription] = useState();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [audioSources, setAudioSources] = useState({});
  const [loginStatus, setLoginStatus] = useState("");
  const [voices, setVoices] = useState([]);
  const [pause, setPause] = useState(false);
  const audioRef = useRef(null);

  axios.defaults.withCredentials = true;
  

  const toggleAudio = () => {
    if (pause) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setPause(!pause)
  };
   const handleAudioEnded = () => {
     setPause(false); // Set isPlaying to false when audio ends
   };

  const checkLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      if (response) {
        console.log(response);
        const responseData = await response.json();
        console.log(responseData);
        if (responseData.loggedIn == true) {
          console.log(responseData);
          setLoginStatus(responseData.name);
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
  const all = async () => {
    try {
      const res = await fetch("http://localhost:5000/all");
      const jsonData = await res.json();
      console.log(jsonData);
      setData(jsonData);
      setLoading(false);

      // Calculate audio sources and store them
      const sources = {};
      jsonData.forEach((item) => {
        if (item.audioData && item.audioData.data) {
          sources[item.text_id] = bufferToDataUrl(
            item.audioData.data,
            "audio/mpeg"
          );
        }
      });
      setAudioSources(sources);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    all();
  }, []);

  function bufferToDataUrl(buffer, mimeType) {
    // Convert the Buffer to a Uint8Array
    const uint8Array = new Uint8Array(buffer);

    // Create a Blob from the Uint8Array
    const blob = new Blob([uint8Array], { type: mimeType });

    // Create a data URL from the Blob
    console.log(URL.createObjectURL(blob));
    return URL.createObjectURL(blob);
  }

  const Delete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/delete/${id}`, {
        method: "DELETE",
      });
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const Fetch = async () => {
    console.log(description);
    let id = 2;
    try {
      const body = { description, id };
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
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <div>
      <div>
        <button onClick={Voices}>Get voices</button>
      </div>
      {console.log(voices)}
      <div className="px width">
        {voices?.slice(0, 1).map((voice) => (
          <div className="flex flex-row">
            
            <div className="pr">
              <AudioControl audioSrc={voice.preview_url} />
            </div>
            <div className="pr">{voice.name}</div>
            <div className="flex flex-row">
              <div className="pr mr border">{voice.labels.accent}</div>
              <div className="pr mr border">{voice.labels.age}</div>
              <div className="pr mr border">{voice.labels.gender}</div>
              <div className="pr mr border">{voice.labels.description}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="px width">
        {voices?.slice(0, 10).map((voice) => (
          <div className="flex flex-row">
            
           <div>
              <AudioControl audioSrc={voice.preview_url} />
            </div>
            <div className="pr">{voice.name}</div>
            <div className="flex flex-row">
              <div className="pr mr border">{voice.labels.accent}</div>
              <div className="pr mr border">{voice.labels.age}</div>
              <div className="pr mr border">{voice.labels.gender}</div>
              <div className="pr mr border">{voice.labels.description}</div>
            </div>
          </div>
        ))}
      </div>
      <div>{loginStatus}</div>
      <div>
        <input
          type="text"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <button onClick={Fetch}>Enter</button>
      </div>
      <div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>id</TableCell>
                  <TableCell align="right">Text</TableCell>
                  <TableCell align="right">Audio</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((item, index) => (
                  <TableRow
                    key={index}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {item.text_id}
                    </TableCell>
                    <TableCell align="right">{item.description}</TableCell>
                    <TableCell>
                      <audio controls>
                        {audioSources[item.text_id] ? (
                          <source
                            src={audioSources[item.text_id]}
                            type="audio/mpeg"
                          />
                        ) : (
                          <p>
                            Your browser does not support the audio element.
                          </p>
                        )}
                      </audio>
                    </TableCell>

                    <TableCell align="right">
                      <button onClick={() => Delete(item.text_id)}>
                        Delete
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>
    </div>
  );
};

export default Home;
