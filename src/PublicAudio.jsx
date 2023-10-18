import React, { useState, useEffect } from "react";
import Waveform from "./WaveForm";
import axios from "axios";
import audio from "./assets/audio.mp3";
import whispering from "./assets/whispering.mp3";
import shouting from "./assets/shouting.mp3";
import irish from "./assets/irish.mp3";
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
      <div className="examples">
        <div className="">
          <div className="example-title">Seductive</div>
          <div className="example-border">
            <div className="example-description">
              "you're such a good boy" she said, seductively
            </div>
          </div>
          <div>
            <Waveform
              height={100}
              waveColor="rgb(200, 0, 200)"
              progressColor="rgb(100, 0, 100)"
              url={audio}
            />
          </div>
        </div>
        <div className="">
          <div className="example-title">Whispering</div>
          <div className="example-border">
          <div className="example-description">
            Whispering to nervousenes to screaming "Late at night, she heard a
            soft whisper coming from the closet, 'Don't open the door... there's
            something lurking inside...'", She slowly approached the closet, her
            heart pounding with nervousness, and hesitated for a moment, As she
            reached for the doorknob, the whisper turned into a blood-curdling
            scream, 'No! Don't do it!'
          </div>
          </div>
          <div>
            <Waveform
              height={100}
              waveColor="rgb(200, 0, 200)"
              progressColor="rgb(100, 0, 100)"
              url={whispering}
            />
          </div>
        </div>
        <div>
          <div className="example-title">Shouting</div>
          <div>
            <div className="example-border">
            <div className="example-description">
              Rising anger, whispering to shouting, “No, you clearly don't know
              who you're talking to, so let me clue you in. I am not in danger,
              Skyler. I AM the danger. A guy opens his door and gets shot and
              you think that of me? No. I am the one who knocks!”
            </div></div>
            <div className="">
              <Waveform
                height={60}
                waveColor="rgb(200, 0, 200)"
                progressColor="rgb(100, 0, 100)"
                url={shouting}
              />
            </div>
          </div>
        </div>
        <div>
          <div className="example-title">Accents</div>
          <div>
            <div className="example-border">
              <div className="example-description">
                sure and didn't I find meself down in Cork last weekend, with
                the sun beaming down, the craic was mighty, and who do you think
                I ran into? Our old pal, Seamus from Galway, himself! 'Twas a
                fair while since we shared a pint and some grand tales!
              </div>
            </div>
            <div className="">
              <Waveform
                height={100}
                waveColor="rgb(200, 0, 200)"
                progressColor="rgb(100, 0, 100)"
                url={irish}
              />
            </div>
          </div>
        </div>
      </div>
      {/* {loading ? (
      <p>Loading...</p>
    ) : (
      <ul className="examples">
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
    )} */}
    </div>
  );
};

export default PublicAudio;
