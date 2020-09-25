import { ThanosWallet } from "@thanos-wallet/dapp";
import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import GoogleLogin from "react-google-login";
import { login } from "../../api/auth";
import { contractAddress } from "../../constants/contract";
import { oauthClientid } from "../../constants/google-oauth-clientid";
import { useAuthContext } from "../../context/auth/authContext";
import {
  LOGIN,
  LOGOUT,
  SET_CONTRACT,
  SET_WALLET_ADDRESS,
  SET_WALLET_BALANCE,
  WALLET_CONNECTED
} from "../../context/types";
import "../../pages/styles.css";
import "./Login.css";

function Login() {
  const [state, dispatch] = useAuthContext();
  const [user, setUser] = useState({ name: "", imageUrl: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  const responseGoogle = async (res) => {
    setLoading(true);
    login(res)
      .then((data) => {
        setUser(data.user);
        localStorage.setItem("token", JSON.stringify(data.token));
        localStorage.setItem("user", JSON.stringify(data.user));
        setLoading(false);
        dispatch({
          type: LOGIN,
          payload: {
            token: data.token,
            user: data.user,
          },
        });
      })
      .catch((err) => {
        alert(err);
      });
  };

  const checkWalletConfigurable = async () => {
    setLoading(true);
    let wallet, tezos, dapp, accountBalance;
    try {
      const available = await ThanosWallet.isAvailable();
      if (!available) {
        window.confirm("Thanos Wallet not installed. Install Thanos Wallet");
        window.open(
          "https://chrome.google.com/webstore/detail/thanos-wallet/ookjlbkiijinhpmnjffcofjonbfbgaoc",
          "_blank"
        );
        return;
      }
      wallet = new ThanosWallet("Crypto Cricket League");
      await wallet.connect("carthagenet");
      tezos = wallet.toTezos();
      accountBalance = parseFloat(
        (await tezos.tz.getBalance(wallet.pkh)) / 1000000
      ).toFixed(2);
      dapp = await tezos.wallet.at(contractAddress);
      localStorage.setItem("userAddress", wallet.pkh);
      setLoading(false);
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
    <div className="login__main">
      {!state.isAuthenticated ? (
        !loading ? (
          <GoogleLogin
            theme="dark"
            clientId={oauthClientid}
            onSuccess={responseGoogle}
            cookiePolicy={"single_host_origin"}
            className="login__google"
            disabled={loading}
          />
        ) : (
          <Spinner animation="border" />
        )
      ) : (
        <div className="connect-wallet-container">
          <img src={user.imageUrl} className="avatar" alt="avatar" />
          <h1 className="subheading">{user.name}</h1>
          {loading ? <Spinner animation="border" /> : null}
          <br />
          <br />
          <Button
            style={{ marginRight: 10 }}
            disabled={loading}
            onClick={logout}
          >
            Logout
          </Button>
          <Button disabled={loading} onClick={checkWalletConfigurable}>
            Connect Wallet
          </Button>
        </div>
      )}
    </div>
  );
}

export default Login;
