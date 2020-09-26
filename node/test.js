const axios = require("axios");
let execute = (a) => {
  a.forEach((url) => {
    axios.get(url).then((res) => {
      console.log(res);
    }).then();
  });
};

let a = [
  "http://localhost:4000/api/players/playerdetails/1",
  "http://localhost:4000/api/players/playerdetails/100",
  "http://localhost:4000/api/players/playerdetails/103",
  "http://localhost:4000/api/players/playerdetails/107",
  "http://localhost:4000/api/players/playerdetails/108",
  "http://localhost:4000/api/players/playerdetails/1083",
  "http://localhost:4000/api/players/playerdetails/1085",
  "http://localhost:4000/api/players/playerdetails/1086",
];
