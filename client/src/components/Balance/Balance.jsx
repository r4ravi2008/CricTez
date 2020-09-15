import React from "react";
import { Button, Col, Row } from "react-bootstrap";
import { useAuthContext } from "../../context/auth/authContext";
import PageHeading from "../PageHeading/PageHeading";
import "./Balance.css";
import { ThanosWallet } from "@thanos-wallet/dapp";
import { contractAddress } from "../../constants/contract";
import {
  SET_CONTRACT,
  SET_WALLET_ADDRESS,
  SET_WALLET_BALANCE,
} from "../../context/types";

function Balance(props) {
  const [state, dispatch] = useAuthContext();

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

  if (!state.userAddress) {
    return (
      <Row>
        <Col md={9}>
          <PageHeading text={props.text} />
        </Col>
        {props.balance ? (
          <Col md={3}>
            <div className="balance-container">
              <br />
              <h4>No Wallet Connected</h4>
              <div style={{ display: "flex" }}>
                <Button
                  className="connect-wallet-button"
                  onClick={checkWalletConfigurable}
                >
                  Connect Wallet
                </Button>
              </div>
            </div>
          </Col>
        ) : null}
      </Row>
    );
  }

  return (
    <Row>
      <Col md={9}>
        <PageHeading text={props.text} />
      </Col>
      {props.balance ? (
        <Col md={3}>
          <div className="balance-container">
            <br />
            <h4>Balance</h4>
            <div style={{ display: "flex" }}>
              <h1 className="balance-heading">{state?.balance}</h1>
              <img
                className="tez-logo"
                src={require("../../assests/tez-logo.png")}
              />
            </div>
          </div>
        </Col>
      ) : null}
    </Row>
  );
}

export default Balance;
