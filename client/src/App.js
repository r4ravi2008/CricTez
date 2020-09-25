import "bootstrap/dist/css/bootstrap.min.css";
import { motion } from "framer-motion";
import React, { Suspense } from "react";
import Row from "react-bootstrap/Row";
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

  const variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  };

  return (
    <div className="App">
      <Suspense
        fallback={
          <motion.div
            className="suspense-loading"
            variants={variants}
            initial="initail"
            animate="animate"
          >
            Loading...
          </motion.div>
        }
      >
        <Navbar />
        <Row className="fluid">
          <Sidebar />
          <div className="wrapper-light">
            <Routes />
          </div>
        </Row>
      </Suspense>
    </div>
  );
}

export default App;
