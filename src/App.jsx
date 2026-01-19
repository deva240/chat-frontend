import { useEffect, useState } from "react";
import Chat from "./Chat";
import "./styles.css";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Replace with real auth later
    setCurrentUser({
      id: 1,
      name: "Deva",
    });
  }, []);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <div className="app-header">Realtime Chat</div>
      <Chat currentUser={currentUser} />
    </div>
  );
}

export default App;
