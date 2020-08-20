import React from "react";
import "./App.css";
import { useAuthContext } from "./context/auth/authContext";
import Navbar from "../src/components/Navbar/Navbar";
import Login from "./components/Login/Login";

function App() {
  const [state] = useAuthContext();

  if (!state.isAuthenticated) {
    return <Login />;
  }
  

  return (
    <div className="App">
      <Navbar />
    </div>
  );
}

export default App;
