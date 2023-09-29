import React, { useState, useEffect } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
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
                        <p>Your browser does not support the audio element.</p>
                      )}
                    </audio>
                  </TableCell>

                  <TableCell align="right">
                    <button onClick={() => Delete(item.text_id)}>Delete</button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default PublicAudio;
