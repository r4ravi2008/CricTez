let puppeteer = require("puppeteer");
const { storeData } = require("./playerScrapper");

let scrapeSquad = async (url) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitFor(5000);
  const playerUrls = await page.evaluate(() => {
    let all_players = [];
    const squad = document.getElementsByClassName("squadPlayerCard");
    for (var prop in squad) {
      if (squad[prop].href) {
        all_players.push(squad[prop].href);
      }
    }
    return all_players;
  });
  playerUrls.forEach(async (url) => await storeData(url));
  await browser.close();
};

module.exports = scrapeSquad;
