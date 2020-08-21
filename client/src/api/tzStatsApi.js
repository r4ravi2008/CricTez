import axios from "axios";
export const tzStats = "https://api.carthagenet.tzstats.com";

export const getContractStorage = async (contractAddress) => {
  try {
    const storage = await axios.get(
      `${tzStats}/explorer/contract/${contractAddress}/storage`
    );
    return storage.data;
  } catch (err) {
    alert("Error Fetching Data", err);
  }
};

export const getBigMap = async (bigMapId) => {
  try {
    const bigMap = await axios.get(
      `${tzStats}/explorer/bigmap/${bigMapId}/values`
    );
    return bigMap.data;
  } catch (err) {
    alert("Error Fetching Data", err);
  }
};
