import { useState } from "react";
import "./App.css";
import Connection from "./components/Connection/Connection";
import Card from "./components/Card/Card";
import DynamicTable from "./components/DynamicTable/DynamicTable";

function App() {
  const [showConnection, setShowConnection] = useState(false);
  const [cardText, setCardText] = useState("");
  const [renderedCardText, setRenderedCardText] = useState("");
  const [dynTables, setDynTables] = useState([]);
  const [players, setPlayers] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(undefined);
  const [playerInput, setPlayerInput] = useState("");

  const cardLexer = (rawText) => {
    const rawChars = rawText.split("");
    let currToken = null;
    let tokens = [];
    let inBracket = false;

    rawChars.forEach((char) => {
      if (char === "}" && inBracket) {
        inBracket = false;
        tokens.push({ tokenType: "metacode", value: currToken.join("") });
        currToken = null;
      } else if (char === "{" && !inBracket) {
        inBracket = true;
        if (currToken) {
          tokens.push({ tokenType: "text", value: currToken.join("") });
        }
        currToken = [];
      } else if (inBracket || (!inBracket && currToken !== null)) {
        currToken.push(char);
      } else if (!inBracket) {
        currToken = [char];
      }
    });

    if (currToken && currToken.length > 0) {
      tokens.push({
        tokenType: inBracket ? "metacode" : "text",
        value: currToken.join(""),
      });
    }

    return tokens;
  };

  const cardRenderer = (tokens) => {
    return tokens
      .map((token) => {
        if (token.tokenType === "metacode") {
          let metaCodeRoot = null;
          let targetDynTable = null;

          const [root, restTargetOpQuery] = token.value.split(".");
          metaCodeRoot = root;

          const [target, restOpQuery] = restTargetOpQuery.split(":");

          if (metaCodeRoot === "user") {
            targetDynTable = dynTables.find((table) => table.name === target);

            if (!targetDynTable) {
              throw new Error(`Table '${target}' not found.`);
            }

            let targetValues = targetDynTable.values;

            if (restOpQuery) {
              const [operator, query] = restOpQuery.split("#");

              if (query !== undefined) {
                targetValues = targetValues.filter((value) =>
                  value.tags.includes(query)
                );
              }

              if (!targetValues || targetValues.length === 0) {
                throw new Error(
                  `No values found for tag '${query}' in table '${targetDynTable.name}'.`
                );
              }

              switch (operator) {
                case "random":
                  return targetValues[
                    Math.floor(Math.random() * targetValues.length)
                  ].value;
                default:
                  throw new Error(`Unsupported operator '${operator}'.`);
              }
            }
          } else if (metaCodeRoot === "editor") {
            if (target == "players") {
              if (restOpQuery == "random") {
                return players[Math.floor(Math.random() * players.length)];
              } else if (restOpQuery == "previous") {
                return players[currentPlayer - 1];
              } else if (restOpQuery == "current") {
                return players[currentPlayer];
              }
            }
          }
        } else if (token.tokenType === "text") {
          return token.value;
        } else {
          return "";
        }
      })
      .join("");
  };

  const renderCardText = () => {
    const tokens = cardLexer(cardText);
    const renderedText = cardRenderer(tokens);
    setRenderedCardText(renderedText);
  };

  const addPlayer = () => {
    if (playerInput.trim() !== "") {
      setPlayers((prevPlayers) => {
        const newPlayers = [...prevPlayers, playerInput];
        if (newPlayers.length === 1) {
          setCurrentPlayer(0);
        }
        return newPlayers;
      });
      setPlayerInput("");
    }
  };

  const nextPlayer = () => {
    setCurrentPlayer((prevCurrentPlayer) => {
      if (prevCurrentPlayer === undefined) {
        return 0;
      }
      return (prevCurrentPlayer + 1) % players.length;
    });
  };

  return (
    <>
      {showConnection && <Connection />}
      <button
        onClick={() => {
          setShowConnection(!showConnection);
        }}
      >
        toggle connection panel
      </button>
      <ul>
        {players.map((player, index) => (
          <li
            key={index}
            style={{ fontWeight: index === currentPlayer ? "bold" : "normal" }}
          >
            {player}
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={playerInput}
        onChange={(e) => setPlayerInput(e.target.value)}
      />
      <button onClick={addPlayer}>add player</button>
      <button onClick={nextPlayer}>next player</button>
      <DynamicTable
        dynTables={dynTables}
        setDynTables={setDynTables}
      ></DynamicTable>
      <Card setCardText={setCardText} cardText={cardText}></Card>
      <button onClick={renderCardText}>Render Card</button>
      <ul>
        <li>Original Text: {cardText}</li>
        <li>Rendered Text: {renderedCardText}</li>
      </ul>
    </>
  );
}

export default App;
