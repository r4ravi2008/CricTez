import axios from "axios";
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
