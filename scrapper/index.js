const scrapeSquad = require("./squadScrapper");

let urls = ["https://www.iplt20.com/teams/chennai-super-kings"];

urls.forEach(async (url) => {
  scrapeSquad(url);
});
