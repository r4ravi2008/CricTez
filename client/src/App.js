import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useAuthContext } from "./context/auth/authContext";
import Navbar from "../src/components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Row } from "react-bootstrap";
import Routes from "./Routes";
import { useLocation } from "react-router-dom";
import LoginPage from "./pages/LoginPage";

function App() {
  const [state, dispatch] = useAuthContext();

  if (!state.isAuthenticated || !state.walletConnected) {
    return <LoginPage />;
  }

  return (
    <div className="App">
      <Navbar />
      <Row className="fluid">
        <Sidebar />
        <div className="wrapper-light">
          <Routes />
        </div>
      </Row>
    </div>
  );
}

export default App;
