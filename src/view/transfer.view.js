const { getAllPorfolio, getPorfolioByToken,getAllPorfolioByDate, getTokenPorfolioByDate } = require("../controllers/transfer.controller");
const moment = require('moment');

exports.getAllPorfolio = async () => {
  console.log("Your Assets");
  const allData = await getAllPorfolio();
  console.table(allData);
}

exports.getPorfolioByToken = async (token) => {
  console.log("Your Assets");
  const allData = await getPorfolioByToken(token);
  console.table(allData);
}

exports.getPorfolioByDate = async (date) => {
  const validDate = moment(date);
  if(validDate.isValid()){
    console.log("Your Assets");
    const allData = await getAllPorfolioByDate(validDate);
    console.table(allData);
  }else{
    console.log("Date is not valid. Please try another one.".bgRed);
  }
}

exports.getPorfolioTokenByDate = async (token,date) => {
  const validDate = moment(date);
  if(validDate.isValid()){
    console.log("Your Assets");
    const allData = await getTokenPorfolioByDate(token,validDate);
    console.table(allData);
  }else{
    console.log("Date is not valid. Please try another one.".bgRed);
  }
}