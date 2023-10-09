import React, { useState, useEffect } from "react";
import Waveform from "./WaveForm";
import axios from "axios";
const PublicAudio = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [audioSources, setAudioSources] = useState({});
  const [loginStatus, setLoginStatus] = useState("");
 axios.defaults.withCredentials = true;
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
      const res = await fetch("https://raspberry-goldfish-tam.cyclic.app/all");
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

  //audio data needs to be array buffer for function to work
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
      const response = await fetch(
        `https://raspberry-goldfish-tam.cyclic.app/delete/${id}`,
        {
          method: "DELETE",
        }
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };
return (
  <div>
    {loading ? (
      <p>Loading...</p>
    ) : (
      <ul>
        {data.map((item, index) => (
          <li key={item.text_id}>
            <div>{item.description}</div>
            {audioSources[item.text_id] ? (
              <Waveform
                height={100}
                waveColor="rgb(200, 0, 200)"
                progressColor="rgb(100, 0, 100)"
                url={audioSources[item.text_id]}
              />
            ) : (
              <p>Your browser does not support the audio element.</p>
            )}
            <button onClick={() => Delete(item.text_id)}>Delete</button>
          </li>
        ))}
      </ul>
    )}
  </div>
);

};

export default PublicAudio;
