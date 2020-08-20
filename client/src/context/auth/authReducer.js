const { LOGIN, LOGOUT } = require("../types");

export const initialState = {
  isAuthenticated: false,
  user: localStorage.getItem("user"),
  token: localStorage.getItem("token"),
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
    default:
      return state;
  }
};

export default reducer;
