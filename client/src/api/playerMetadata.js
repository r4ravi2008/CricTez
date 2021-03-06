import axios from "axios";
import { server } from "../constants/server";

axios.interceptors.request.use((req) => {
  const token = JSON.parse(localStorage.getItem("token"));
  req.headers.common["authorization"] = "Bearer " + token;
  return req;
});

export const fetchTokenDetails = async (id) => {
  console.log("Fetch Token Details");
  try {
    const res = await axios.get(`${server}/storage/tokens/tokendetails/${id}`);
    if (res.status === 200) return res.data;
  } catch (error) {
    console.log({ error });
  }
};

export const fetchPlayerDetails = async (id) => {
  console.log("Fetch Player Details");
  try {
    const res = await axios.get(`${server}/storage/playerdetails/${id}`);
    if (res.status === 200) return res.data;
  } catch (error) {
    console.log({ error });
  }
};

export const fetchTokensOnSale = async () => {
  console.log("Fetch Tokens On Sale");
  try {
    const res = await axios.get(`${server}/storage/tokensforsale`);
    if (res.status === 200) return res.data;
  } catch (error) {
    return { error };
  }
};

export const fetchOwnedTokens = async (address) => {
  console.log("Fetch Owned Tokens");
  try {
    const res = await axios.get(`${server}/storage/owned/${address}`);
    if (res.status === 200) return res.data;
  } catch (error) {
    return { error };
  }
};

export const fetchPlayerbyName = async (name) => {
  console.log("Fetch Player By Name");
  try {
    const res = await axios.post(`${server}/players/name`, { name: name });
    if (res.status === 200) return res.data;
  } catch (error) {
    return { error };
  }
};

export const getPlayersBigmapLength = async () => {
  console.log("Get Players BigMap Length");
  try {
    const res = await axios.get(`${server}/storage/players/`);
    if (res.status === 200) return res.data.length;
  } catch (error) {
    return { error };
  }
};

export const getTokensBigmapLength = async () => {
  console.log("Get Tokens BigMap Length");
  try {
    const res = await axios.get(`${server}/storage/tokens/`);
    if (res.status === 200) return res.data.length;
  } catch (error) {
    return { error };
  }
};

export const getMatches = async () => {
  console.log("Get Matches");
  try {
    const res = await axios.get(`${server}/matches/`);
    if (res.status === 200) return res.data;
  } catch (error) {
    return { error: true, msg: error };
  }
};
