import { ThanosWallet } from "@thanos-wallet/dapp";
import React from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { FaBell, FaSignOutAlt, FaRedoAlt } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import { contractAddress } from "../../constants/contract";
import { useAuthContext } from "../../context/auth/authContext";
import {
  LOGOUT,
  SET_CONTRACT,
  SET_WALLET_ADDRESS,
  SET_WALLET_BALANCE,
  WALLET_CONNECTED,
} from "../../context/types";
import "./Navbar.css";

export default function MainNavbar() {
  const [, dispatch] = useAuthContext();

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
      localStorage.setItem("userAddress", wallet.pkh);
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
      dispatch({
        type: WALLET_CONNECTED,
      });
    } catch (e) {
      alert(e, "Error");
    }
  };

  const logout = () => {
    dispatch({
      type: LOGOUT,
    });
  };

  return (
    <Navbar variant="dark" expand="lg" className="navbar">
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Navbar.Brand className="navbar__header">
          Cric<span>Tez</span>
        </Navbar.Brand>
        <Nav className="ml-auto">
          <li className="nav-item small-primary">
            <FaRedoAlt className="fa-icons" onClick={checkWalletConfigurable} />
          </li>
          <li className="nav-item small-primary">
            <LinkContainer to="/notifications">
              <FaBell className="fa-icons" />
            </LinkContainer>
          </li>
          <li className="nav-item small-primary" onClick={logout}>
            <LinkContainer to="/">
              <FaSignOutAlt className="fa-icons" />
            </LinkContainer>
          </li>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}
