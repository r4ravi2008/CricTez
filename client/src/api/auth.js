import { server } from "../constants/server";
import axios from "axios";

export const login = async (payload) => {
  try {
    const res = await axios.post(`${server}/auth/login/`, payload);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
