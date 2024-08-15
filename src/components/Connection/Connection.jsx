import { useState } from "react";

import { v4 as uuidv4 } from "uuid";
const Connection = () => {
  const [lobbyCon, setLobbyCon] = useState("");
  const [lobby, setLobby] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [currentUsers, setCurrentUsers] = useState([]);
  const [conStatus, setConStatus] = useState("Not Connected");

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

      <button>Connect to session</button>
      <p>con status: {conStatus}</p>

      <p>Session Members:</p>
      <ul></ul>
    </div>
  );
};

export default Connection;
