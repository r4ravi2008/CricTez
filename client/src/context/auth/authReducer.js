const {
  LOGIN,
  LOGOUT,
  SET_CONTRACT,
  SET_WALLET_ADDRESS,
  SET_WALLET_BALANCE,
  SET_NAVBAR_HEADING,
  SET_CARDS_FOR_SALE,
  SET_OWNED_CARDS,
  WALLET_CONNECTED,
} = require("../types");

export const initialState = {
  isAuthenticated: localStorage.getItem("user") ? true : false,
  walletConnected: localStorage.getItem("userAddress") ? true : false,
  user: localStorage.getItem("user") || "",
  token: localStorage.getItem("token") || "",
  contract: null,
  userAddress: localStorage.getItem("userAddress") || "",
  balance: 0.0,
  saleCards: [],
  ownedCards: [],
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

    case SET_CARDS_FOR_SALE:
      return {
        ...state,
        saleCards: action.payload.cards,
      };

    case SET_OWNED_CARDS:
      return {
        ...state,
        ownedCards: action.payload.cards,
      };

    case WALLET_CONNECTED:
      return {
        ...state,
        walletConnected: true,
      };

    default:
      return state;
  }
};

export default reducer;
