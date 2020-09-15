import React, { createContext, useContext, useReducer } from "react";

export const AuthContext = createContext();
export const AuthContextWrapper = (props) => (
  <AuthContext.Provider value={useReducer(props.reducer, props.initialState)}>
    {props.children}
  </AuthContext.Provider>
);
export const useAuthContext = () => useContext(AuthContext);
