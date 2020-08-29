const puppeteer = require("puppeteer");
const axios = require("axios");

let totalPlayersUpdated = 0;

const scrapePlayerPoints = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  const data = await page.evaluate(() => {
    let table = document
      .getElementsByTagName("tbody")[0]
      .innerText.replace(/(\r\n|\n|\r)/gm, "\t")
      .split("\t");
    let a = [];
    for (var i = 23; i < table.length; i += 11) {
      const rank = parseInt(table[i]);
      const name = table[i + 1];
      const points = parseInt(table[i + 2]);
      let playerId = document
        .getElementsByClassName("top-players__player-link")
        [rank - 1].href.match(/\d+/g)[1];
      a.push({
        rank,
        name,
        points,
        playerId,
      });
    }
    return a;
  });
  data.forEach(async (item) => await updateData(item));
  await browser.close();
  return data;
};

const updateData = async (data) => {
  try {
    //localhost to be changed
    const update = await axios.put(
      `http://localhost:4000/api/players/update/${data.playerId}`,
      { rank: data.rank, points: data.points }
    );
    totalPlayersUpdated++;
  } catch (err) {
    //All players are not present in DB which usually causes 404 error
  }
};

scrapePlayerPoints("https://www.iplt20.com/stats/2019/player-points");
