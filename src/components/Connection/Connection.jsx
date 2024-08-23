import { useState } from "react";

import { v4 as uuidv4 } from "uuid";
const Connection = () => {
  const [lobbyCon, setLobbyCon] = useState("");
  const [lobby, setLobby] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [currentUsers, setCurrentUsers] = useState([]);
  const [conStatus, setConStatus] = useState("Not Connected");
  const [socket, setSocket] = useState(undefined);
  const [msg, setMsg] = useState("");

  const startSocket = () => {
    let ws = new WebSocket(
      `http://127.0.0.1:8080/game/join?session_id=${lobby}&user_id=${userId}&username=${username}`
    );

    ws.addEventListener("open", (event) => {
      console.log("Connected to WebSocket");
      setConStatus("Connected");
    });

    ws.addEventListener("message", (event) => {
      console.log("Message from server:", event.data);
    });

    ws.addEventListener("close", (event) => {
      console.log("Disconnected from WebSocket");
      setConStatus("Not Connected");
      setSocket(undefined);
    });

    ws.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });

    setSocket(ws);
  };

  const sendMessage = (msg) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(msg);
    } else {
      console.error("no connection");
      return;
    }
  };

  const createSession = () => {
    fetch("http://127.0.0.1:8080/game/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        host_id: userId,
        username: username,
      }),
    }).then((resp) => {
      resp.json().then((text) => {
        setLobby(text);
        console.log(text);
      });
    });
  };

  return (
    <div className="Connection">
      <p>current lobby connection: {lobbyCon} </p>

      <p>userId: {userId} </p>
      <button
        onClick={() => {
          setUserId(uuidv4());
        }}
      >
        Generate UserID
      </button>
      <p>Username</p>
      <input
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
      <p>LobbyCode</p>
      <input
        type="text"
        value={lobby}
        onChange={(e) => {
          setLobby(e.target.value);
        }}
      />
      <button onClick={createSession}>Create Session</button>
      <button
        onClick={() => {
          startSocket();
          setConStatus("Attempting Connection");
        }}
      >
        Connect to session
      </button>
      <p>con status: {conStatus}</p>

      <input
        type="text"
        value={msg}
        onChange={(e) => {
          setMsg(e.target.value);
        }}
      />
      <button
        onClick={() => {
          sendMessage(msg);
        }}
      >
        Send Msg
      </button>
      <p>Session Members:</p>

      <ul></ul>
    </div>
  );
};

export default Connection;
