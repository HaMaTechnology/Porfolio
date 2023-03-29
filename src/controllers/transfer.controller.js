const {transaction_type,LOG_ERR} = require('../config/constant.config');
const db = require('../config/db.config');
const { getAllTransfers, getAllTransfersByDate } = require('../models/transfer.model');
const Transfer = db.transfers;

//Canculate All porfolio
exports.getAllPorfolio = async () => {
  const allTransfer = getAllTransfers();
  for (const token in allTransfer) {
    await calculateProfitLoss(allTransfer,token);
  }
  return allTransfer;
};
//Canculate All porfolio by Token
exports.getPorfolioByToken = async (token) => {
  const result = {};
  const allTransfer = getAllTransfers();
  if(!allTransfer[token]) return {};

  await calculateProfitLoss(allTransfer,token);
  result[token] = allTransfer[token];
  return result;
};
//Canculate Porfolio By Date
exports.getAllPorfolioByDate = async (date) => {
  const allTransfer = getAllTransfersByDate(date);
  for (const token in allTransfer) {
    await calculateProfitLoss(allTransfer,token);
  }
  return allTransfer;
};
//Canculate Porfolio By TOKEN and Date
exports.getTokenPorfolioByDate = async (token,date) => {
  const result = {};
  const allTransfer = getAllTransfersByDate(date);
  if(!allTransfer[token]) return {};
  
  await calculateProfitLoss(allTransfer,token);
  result[token] = allTransfer[token];
  return result;
};
//Canculate Profit/Loss Portfolio
//Porfolio = Remaining Token in USD + total Withdrawal Token in USD - total Deposit token in USD
const calculateProfitLoss = async(data,token) => {
  const totalDepositUSD = data[token].totalDepositUSD;
  const totalWithdrawUSD = data[token].totalWithdrawUSD;
  const remainingAmount = data[token].depositAmount - data[token].withdrawAmount;
  const totalRemaining = await Transfer.getTotalByAmountInUSD(token,remainingAmount);
  const portfolio = totalRemaining + totalWithdrawUSD - totalDepositUSD;
  data[token]['holdings'] = remainingAmount;
  data[token]['portfolio'] = parseFloat(portfolio.toFixed(2));
  data[token]['percent'] = (portfolio * 100 / totalDepositUSD).toFixed(2) + " %";
}