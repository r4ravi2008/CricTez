import React from "react";
import GoogleLogin from "react-google-login";
import { useAuthContext } from "../../context/auth/authContext";
import { LOGIN } from "../../context/types";
import { oauthClientid } from "../../constants/google-oauth-clientid";
import "./Login.css";

function Login() {
  const responseGoogle = (res) => {
    dispatch({
      type: LOGIN,
      payload: {
        token: res.accessToken,
        user: res.profileObj.name,
      },
    });
  };

  const [state, dispatch] = useAuthContext();

  return (
    <div className="login__main">
      <GoogleLogin
        theme="dark"
        style={{
          padding: 10,
        }}
        clientId={oauthClientid}
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
        className="login__google"
      />
    </div>
  );
}

export default Login;
