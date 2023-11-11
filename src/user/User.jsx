import React, { useEffect, useState } from "react";
import axios from "axios";
import Waveform from "../WaveForm";
const User = () => {
  const [description, setDescription] = useState();
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
          setLoginStatus(responseData);
        } else {
          console.log("no user");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };
  const all = async (id) => {
    try {
      const res = await fetch(
        `https://raspberry-goldfish-tam.cyclic.app/user/${id}`
      );
      const jsonData = await res.json();
      console.log(jsonData);
      setData(jsonData);
      setLoading(false);

      // Calculate audio sources and store them
      const sources = {};
      jsonData.forEach((item) => {
        if (item.audioData && item.audioData.data) {
          sources[item.id] = bufferToDataUrl(item.audioData.data, "audio/mpeg");
        }
      });
      setAudioSources(sources);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    checkLogin();
    if (loginStatus) {
      all(loginStatus.id);
    }
  }, []);

  useEffect(() => {
    if (loginStatus.id) {
      all(loginStatus.id);
    }
  }, [loginStatus]);
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
        `https://raspberry-goldfish-tam.cyclic.app/user/delete/${id}`,
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
      <div className="examples">
        <div className="">
          {data?.map((item, index) => (
            <div className="">
              <div className="example-border">
                <div className="example-description">{item.description}</div>
              </div>
              <div className="flex">
                <div>
                  <Waveform
                    height={80}
                    waveColor="rgb(200, 0, 200)"
                    progressColor="rgb(100, 0, 100)"
                    url={audioSources[item.id]}
                  />
                </div>
                <div className="delete-svg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20px"
                    viewBox="0 0 448 512"
                  >
                    <path
                      d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
                      fill="gray"
                    />
                  </svg>
                  <span className="tooltip">Delete</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default User;
