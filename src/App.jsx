import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState("");

  async function sayHello() {
    const msg = await invoke("greet", { name });
    setGreeting(msg);
  }

  return (
    <div>
      <h1>Tauri + React</h1>
      <input onChange={(e) => setName(e.target.value)} />
      <button onClick={sayHello}>Greet</button>
      <p>{greeting}</p>
    </div>
  );
}

export default App;
