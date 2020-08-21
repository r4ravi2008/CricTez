export const getPlayerType = (arr) => {
  let type = "";
  if (arr.batsman && arr.bowler) return "All Rounder";
  if (arr.keeper) type += "Wicket Keeper ";
  if (arr.batsman) type += "Batsman ";
  if (arr.bowler) type += "Bowler ";
  return type;
};
