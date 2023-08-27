import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
const Home = () => {
  const [description, setDescription] = useState();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const all = async () => {
    try {
      const res = await fetch("http://localhost:5000/all");
      const jsonData = await res.json();
      console.log(jsonData)
      setData(jsonData);
      setLoading(false);
      console.log(data);
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
    console.log(URL.createObjectURL(blob))
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
    try {
      const body = { description };
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
  return (
    <div>
      <input
        type="text"
        onChange={(e) => {
          setDescription(e.target.value);
        }}
      />
      <button onClick={Fetch}>Enter</button>
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
                        <source
                          src={bufferToDataUrl(item.audio.data, "audio/mpeg")}
                          type="audio/mpeg"
                        />
                        Your browser does not support the audio element.
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
