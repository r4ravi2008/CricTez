import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { useAuthContext } from "./context/auth/authContext";
import Navbar from "../src/components/Navbar/Navbar";
import Routes from "./Routes";
import {
  useLocation,
} from "react-router-dom";
import { ThanosWallet } from "@thanos-wallet/dapp";
import { contractAddress } from "./constants/contract";
import {
  SET_CONTRACT,
  SET_WALLET_ADDRESS,
  SET_WALLET_BALANCE,
} from "./context/types";
import Sidebar from "./components/Sidebar/Sidebar";
import { Row } from "react-bootstrap";

function App() {
  const [, dispatch] = useAuthContext();

  // if (!state.isAuthenticated) {
  //   return <Login />;
  // }

  const checkWalletConfigurable = async () => {
    let wallet, tezos, dapp, accountBalance;
    try {
      await ThanosWallet.isAvailable();
      // return alert("Please Install Thanos Extension");
      wallet = new ThanosWallet("Crypto Cricket League");
      await wallet.connect("carthagenet");
      tezos = wallet.toTezos();
      accountBalance = parseFloat(
        (await tezos.tz.getBalance(wallet.pkh)) / 1000000
      ).toFixed(2);
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
      dispatch({
        type: SET_WALLET_BALANCE,
        payload: {
          balance: accountBalance,
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
