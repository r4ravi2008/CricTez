const puppeteer = require("puppeteer");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(
    "https://www.iplt20.com/teams/chennai-super-kings/squad/9/ravindra-jadeja"
  );
  page.waitFor(5000);
  await page.screenshot({ path: "1.png", fullPage: true });
  await page.addScriptTag({
    url: "https://code.jquery.com/jquery-3.2.1.min.js",
  });
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
              rtn.push(obj);
              obj = {};
            } else {
              obj[a[n % 14]] = iL[n].split("</td>")[0];
            }
          } else {
            if (n % 11 === 0) {
              rtn.push(obj);
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
    const image = document.querySelector(".player-hero__photo").children[0].src;
    const player_id = document.querySelector(".player-hero__photo").children[0]
      .attributes["data-player-id"].value;
    const role = $(".player-details__value")[0].innerText;
    const batStyle = document.querySelectorAll(".player-details__value")[1]
      .innerText;
    let bowlStyle = document.querySelectorAll(".player-details__value")[2]
      .innerText;
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
    const playerBattingStats = tableStringSplit(playerstatsTextBatting, false);
    const playerstatsTextBowl = document
      .getElementsByTagName("tbody")[3]
      .innerHTML.replace(/(\r\n|\n|\r)/gm, " ");
    const playerBowlingStats = tableStringSplit(playerstatsTextBowl, true);
    const team = document.querySelector(".team-info").firstElementChild
      .innerText;
    return {
      name,
      image,
      player_id,
      role,
      matches,
      runs,
      wickets,
      batStyle,
      bowlStyle,
      nationality,
      dob,
      bio,
      playerBattingStats,
      playerBowlingStats,
      team,
    };
  });
  console.log(data);
  await browser.close();
})();
