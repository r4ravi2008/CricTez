import axios from "axios";
import { server } from "../constants/server";
export const cricApi = "https://rest.cricketapi.com/rest/v2/player";
const proxy = "https://cors-anywhere.herokuapp.com/";
var cricapi = require("cricapi");
cricapi.setAPIKey("WMY3MDAfcTOUoFF8tM560JpHH1N2");

export const getPlayerMetadata = async (metadata) => {
  try {
    const storage = await axios.get(
      `${proxy}${cricApi}/${metadata}league/ipl/stats/?access_token=2s1292831918529843205s1296887367201855739`
    );
    return storage.data;
  } catch (err) {
    alert("Error Fetching Data", err);
  }
};
export const cricApifunction = async () => {
  cricapi.matches(function (databundle) {
    console.log(databundle);
  });
};

export const fetchTokenDetails = async (id) => {
  console.log("Fetch Token Details");
  try {
    const res = await axios.get(`${server}/storage/tokens/tokendetails/${id}`);
    if (res.status == 200) return res.data;
  } catch (error) {
    console.log({ error });
  }
};

export const fetchPlayerDetails = async (id) => {
  console.log("Fetch Player Details");
  try {
    const res = await axios.get(`${server}/storage/playerdetails/${id}`);
    return res.data;
  } catch (error) {
    return { error };
  }
};

export const fetchTokensOnSale = async () => {
  console.log("Fetch Tokens On Sale");
  try {
    const res = await axios.get(`${server}/storage/tokensforsale`);
    return res.data;
  } catch (error) {
    return { error };
  }
};

export const fetchOwnedTokens = async (address) => {
  console.log("Fetch Owned Tokens");
  try {
    const res = await axios.get(`${server}/storage/owned/${address}`);
    return res.data;
  } catch (error) {
    return { error };
  }
};

export const fetchPlayerbyName = async (name) => {
  console.log("Fetch Player By Name");
  try {
    const res = await axios.post(`${server}/players/name`, { name: name });
    return res.data;
  } catch (error) {
    return { error };
  }
};

export const getPlayersBigmapLength = async () => {
  console.log("Get Players BigMap Length");
  try {
    const res = await axios.get(`${server}/storage/players/`);
    return res.data.length;
  } catch (error) {
    return { error };
  }
};

export const getTokensBigmapLength = async () => {
  console.log("Get Tokens BigMap Length");
  try {
    const res = await axios.get(`${server}/storage/tokens/`);
    return res.data.length;
  } catch (error) {
    return { error };
  }
};
