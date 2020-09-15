import React from "react";
import GoogleLogin from "react-google-login";
import { useAuthContext } from "../../context/auth/authContext";
import { LOGIN, LOGOUT, WALLET_CONNECTED } from "../../context/types";
import { oauthClientid } from "../../constants/google-oauth-clientid";
import "./Login.css";
import { login } from "../../api/auth";
import { Button, Spinner } from "react-bootstrap";
import { useState } from "react";
import { ThanosWallet } from "@thanos-wallet/dapp";
import { contractAddress } from "../../constants/contract";
import {
  SET_CONTRACT,
  SET_WALLET_ADDRESS,
  SET_WALLET_BALANCE,
} from "../../context/types";
import { useEffect } from "react";

function Login() {
  const [state, dispatch] = useAuthContext();
  const [user, setUser] = useState({ name: "", imageUrl: "" });
  const [loading, setLoading] = useState(false);

  const responseGoogle = async (res) => {
    setLoading(true);
    login(res).then((data) => {
      setUser(data.user);
      localStorage.setItem("token", JSON.stringify(data.token));
      localStorage.setItem("user", JSON.stringify(data.user));
      dispatch({
        type: LOGIN,
        payload: {
          token: data.token,
          user: data.user,
        },
      });
    });
    setLoading(false);
  };

  const logout = () => {
    dispatch({
      type: LOGOUT,
    });
  };

  const checkWalletConfigurable = async () => {
    setLoading(true);
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
      dispatch({
        type: WALLET_CONNECTED,
      });
    } catch (e) {
      alert(e, "Error");
    }
    setLoading(false);
  };

  return (
    <div className="login__main">
      {!state.isAuthenticated ? (
        <GoogleLogin
          theme="dark"
          className="google-oauth-button"
          clientId={oauthClientid}
          onSuccess={responseGoogle}
          cookiePolicy={"single_host_origin"}
          className="login__google"
          disabled={loading}
        />
      ) : (
        <div className="connect-wallet-container">
          <img src={user.imageUrl} className="avatar" />
          <h1 className="subheading">{user.name}</h1>
          {loading ? <Spinner animation="border" /> : null}
          <br />
          <br />
          <Button disabled={loading} onClick={checkWalletConfigurable}>
            Connect Wallet
          </Button>
        </div>
      )}
    </div>
  );
}

export default Login;
