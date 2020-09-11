import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useAuthContext } from "./context/auth/authContext";
import Navbar from "../src/components/Navbar/Navbar";
import Routes from "./Routes";
import { BrowserRouter as Router } from "react-router-dom";
import { ThanosWallet } from "@thanos-wallet/dapp";
import { contractAddress } from "./constants/contract";
import { SET_CONTRACT, SET_WALLET_ADDRESS } from "./context/types";
import Sidebar from "./components/Sidebar/Sidebar";
import { Row, Col } from "react-bootstrap";

function App() {
  const [state, dispatch] = useAuthContext();

  // if (!state.isAuthenticated) {
  //   return <Login />;
  // }

  const checkWalletConfigurable = async () => {
    let wallet, tezos, dapp;
    try {
      await ThanosWallet.isAvailable();
      // return alert("Please Install Thanos Extension");
      wallet = new ThanosWallet("Crypto Cricket League");
      await wallet.connect("carthagenet");
      tezos = wallet.toTezos();
      dapp = await tezos.wallet.at(contractAddress);
      dispatch({
        type: SET_CONTRACT,
        payload: {
          contract: dapp,
        },
      });
      dispatch({
        type: SET_WALLET_ADDRESS,
        payload: {
          userAddress: wallet.pkh,
        },
      });
    } catch (e) {
      alert(e, "Error");
    }
  };

  useEffect(() => {
    checkWalletConfigurable();
  }, []);

  return (
    <div className="App">
      <Router>
        <Navbar />
        <Row className="fluid">
          <Sidebar />
          <div className="wrapper-light">
            <Routes />
          </div>
        </Row>
      </Router>
    </div>
  );
}

export default App;
