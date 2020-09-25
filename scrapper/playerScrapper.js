const puppeteer = require("puppeteer");
const axios = require("axios");

const scrapeData = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(url);
  await page.waitFor(5000);
  const data = await page.evaluate(() => {
    let tableStringSplit = (s, type) => {
      s = s.replace(/ /g, "");
      var L = s.split("<tr>");
      var rtn = [];
      let a = [
        "",
        "Batting&Fielding",
        "Mat",
        "No",
        "Runs",
        "HS",
        "Ave",
        "BF",
        "SR",
        "100",
        "50",
        "4s",
        "6s",
        "CT",
        "ST",
      ];
      if (type) {
        a = [
          "",
          "Bowling",
          "Mat",
          "Balls",
          "Runs",
          "WKTS",
          "BBM",
          "Ave",
          "Econ",
          "SR",
          "4W",
          "5W",
        ];
      }
      for (var x = 0; x < L.length; x++) {
        var iL = L[x].split("<td>");
        var obj = {};
        for (var n = 0; n < iL.length; n++) {
          if (!type) {
            if (n % 14 === 0) {
              if (Object.keys(obj).length !== 0) rtn.push(obj);
              obj = {};
            } else {
              obj[a[n % 14]] = iL[n].split("</td>")[0];
            }
          } else {
            if (n % 11 === 0) {
              if (Object.keys(obj).length !== 0) rtn.push(obj);
              obj = {};
            } else {
              obj[a[n % 11]] = iL[n].split("</td>")[0];
            }
          }
        }
      }
      return rtn;
    };

    const name = document
      .getElementsByClassName("player-hero__name")[0]
      .innerText.replace(/(\r\n|\n|\r)/gm, " ");
    const image_url = document.querySelector(".player-hero__photo").children[0]
      .src;
    const player_id = document.querySelector(".player-hero__photo").children[0]
      .attributes["data-player-id"].value;
    const role = $(".player-details__value")[0].innerText;
    const batting_style = document.querySelectorAll(".player-details__value")[1]
      .innerText;
    if (batting_style == "") batting_style = "-";
    let bowling_style;
    if (document.querySelectorAll(".player-details__value")[2] != null) {
      bowling_style = document.querySelectorAll(".player-details__value")[2]
        .innerText;
    } else {
      bowling_style = "-";
    }
    const nationality = document.querySelectorAll(".player-details__value")[3]
      .innerText;
    const dob = document.querySelectorAll(".player-details__value")[5]
      .innerText;
    const matches = document.querySelectorAll(".player-stats__value")[0]
      .innerText;
    const runs = document.querySelectorAll(".player-stats__value")[1].innerText;
    const wickets = document.querySelectorAll(".player-stats__value")[2]
      .innerText;
    const bio = document
      .querySelector(".player-bio")
      .innerText.replace(/(\r\n|\n|\r)/gm, " ");
    const playerstatsTextBatting = document
      .getElementsByTagName("tbody")[2]
      .innerHTML.replace(/(\r\n|\n|\r)/gm, " ");
    const batting_stats = tableStringSplit(playerstatsTextBatting, false);
    const playerstatsTextBowl = document
      .getElementsByTagName("tbody")[3]
      .innerHTML.replace(/(\r\n|\n|\r)/gm, " ");
    const bowling_stats = tableStringSplit(playerstatsTextBowl, true);
    const team = document.querySelector(".team-info").firstElementChild
      .innerText;
    return {
      name,
      image_url,
      player_id,
      role,
      matches,
      runs,
      wickets,
      batting_style,
      bowling_style,
      nationality,
      dob,
      bio,
      batting_stats,
      bowling_stats,
      team,
    };
  });
  await browser.close();
  return data;
};
let count = 0;
const storeData = async (url) => {
  const storageData = await scrapeData(url);
  count++;
  console.log(storageData.player_id);
  console.log(count);
  const data = await axios
    .post("http://localhost:4000/api/players/newplayer", { ...storageData })
    .then(function (response) {
      console.log(response.status);
    })
    .catch(function (error) {
      console.log("Useless Player", error.config.data.name);
    });
  console.log(data.name);
};

module.exports = { scrapeData: scrapeData, storeData: storeData };
