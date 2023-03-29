const csv = require('csvtojson');
const transaction_type = require('../config/constant.config');
const { getTokenPriceByTS, getTimeRange } = require('../utils/ultil');
const Transfer = {};

//We need to sync all data transaction into Database
exports.init = async () => {
  try {
    Transfer.data = await csv().fromFile(process.env.DATA_CSV);
    for(let i =0;i<Transfer.data.length;i++){
      const element = Transfer.data[i];
      const data = (await getTokenPriceByTS(element.token,parseInt(element.timestamp)));
      element.price = data[element.token].USD;
    }
  } catch (error) {
    Transfer.data = [];
  }
}

exports.getAll = () => {
  return Transfer.data;
}

exports.getAllTransfers = () => {
  const result = {};
  Transfer.data.forEach(ele => {
    if(!result[ele.token]){
      result[ele.token] = {depositAmount:0,withdrawAmount:0,totalDepositUSD:0,totalWithdrawUSD:0}
    }
    if(ele.transaction_type == transaction_type.DEPOSIT){
      result[ele.token].depositAmount += parseFloat(ele.amount);
      result[ele.token].totalDepositUSD += (parseFloat(ele.amount) * ele.price);
    }else if(ele.transaction_type == transaction_type.WITHDRAWAL){
      result[ele.token].withdrawAmount += parseFloat(ele.amount);
      result[ele.token].totalWithdrawUSD += (parseFloat(ele.amount) * ele.price);
    }
  });
  return result;
}

exports.getAllTransfersByDate = (date) => {
  const timeRange = getTimeRange(date);
  const result = {};
  Transfer.data.forEach(ele => {
    if(!result[ele.token]){
      result[ele.token] = {depositAmount:0,withdrawAmount:0,totalDepositUSD:0,totalWithdrawUSD:0}
    }
    if(parseInt(ele.timestamp) >= timeRange.start && parseInt(ele.timestamp) <= timeRange.end){
      if(ele.transaction_type == transaction_type.DEPOSIT){
        result[ele.token].depositAmount += parseFloat(ele.amount);
        result[ele.token].totalDepositUSD += (parseFloat(ele.amount) * ele.price);
      }else if(ele.transaction_type == transaction_type.WITHDRAWAL){
        result[ele.token].withdrawAmount += parseFloat(ele.amount);
        result[ele.token].totalWithdrawUSD += (parseFloat(ele.amount) * ele.price);
      }
    }
  });
  return result;
}

exports.getTotalByTransactionTypeInUSD = (token,type) => {
  return Transfer.data.filter(e => e.transaction_type == type && e.token == token).reduce((a,b)=> a + (parseInt(b.amount) * b.price),0);
}

exports.getAmountByTransactionType = (token,type) => {
  return Transfer.data.filter(e => e.transaction_type == type && e.token == token).reduce((a,b)=> a + parseInt(b.amount),0);
}

exports.getTotalByAmountInUSD = async (token,amount) => {
  if(!amount) return 0;
  const currentPrice = (await getTokenPriceByTS(token))?.USD;
  return currentPrice * amount;
}

// exports.getTransferByType 



