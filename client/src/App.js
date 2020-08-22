import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import { useAuthContext } from "./context/auth/authContext";
import Navbar from "../src/components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Routes from "./components/Routes";
import {BrowserRouter as Router} from "react-router-dom";

function App() {
  const [state] = useAuthContext();

  // if (!state.isAuthenticated) {
  //   return <Login />;
  // }

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes />
      </Router>
    </div>
  );
}

export default App;
