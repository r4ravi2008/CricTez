const {
  LOGIN,
  LOGOUT,
  SET_CONTRACT,
  SET_WALLET_ADDRESS,
  SET_WALLET_BALANCE,
  SET_NAVBAR_HEADING,
} = require("../types");

export const initialState = {
  heading: "Buy Cards",
  isAuthenticated: false,
  user: localStorage.getItem("user"),
  token: localStorage.getItem("token"),
  contract: null,
  userAddress: null,
  balance: 0.0,
};

const reducer = (state, action) => {
  switch (action.type) {
    case LOGIN:
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token,
      };

    case LOGOUT:
      localStorage.clear();
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };

    case SET_CONTRACT:
      return {
        ...state,
        contract: action.payload.contract,
      };

    case SET_WALLET_ADDRESS:
      return {
        ...state,
        userAddress: action.payload.userAddress,
      };
    case SET_WALLET_BALANCE:
      return {
        ...state,
        balance: action.payload.balance,
      };
    case SET_NAVBAR_HEADING:
      return {
        ...state,
        heading: action.payload.heading,
      };

    default:
      return state;
  }
};

export default reducer;
