import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { Row } from "react-bootstrap";
import Navbar from "../src/components/Navbar/Navbar";
import "./App.css";
import Sidebar from "./components/Sidebar/Sidebar";
import { useAuthContext } from "./context/auth/authContext";
import LoginPage from "./pages/LoginPage";
import Routes from "./Routes";


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
