import React from "react";
import GoogleLogin from "react-google-login";
import { useAuthContext } from "../../context/auth/authContext";
import { LOGIN } from "../../context/types";
import { oauthClientid } from "../../constants/google-oauth-clientid";
import "./Login.css";
import { login } from "../../api/auth";

function Login() {
  const responseGoogle = async (res) => {
    console.log(res);
    const data = await login(res);
    dispatch({
      type: LOGIN,
      payload: {
        token: data.token,
        user: data.user,
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
