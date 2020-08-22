const scrapeSquad = require("./squadScrapper");

let urls = [
  "https://www.iplt20.com/teams/chennai-super-kings",
  "https://www.iplt20.com/teams/delhi-capitals",
  "https://www.iplt20.com/teams/kings-xi-punjab",
  "https://www.iplt20.com/teams/kolkata-knight-riders",
  "https://www.iplt20.com/teams/mumbai-indians",
  "https://www.iplt20.com/teams/rajasthan-royals",
  "https://www.iplt20.com/teams/royal-challengers-bangalore",
  "https://www.iplt20.com/teams/sunrisers-hyderabad",
];

urls.forEach(async (url) => {
  await scrapeSquad(url);
});
