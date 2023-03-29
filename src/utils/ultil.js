const fetch = require('cross-fetch');
const moment = require('moment');

exports.getTokenPriceByTS = async(token,ts) => {
    try {
        const API = ts ? process.env.HISTORY_PRICE_API : process.env.PRICE_API;
        const res = await fetch(`${API}?api_key=${process.env.API_KEY}&fsym=${token}&tsyms=USD&ts=${ts}`, {
            method: 'GET', 
          })
          return res.json();
    } catch (error) {
        console.log(error)
        return {}   
    }
    
    //   https://min-api.cryptocompare.com/data/pricehistorical?fsym=APT&tsyms=USD&ts=1679881088&
    // api_key=bab1e8c5a5620a1e246107030cd8bad9d909c0866c8f33129341199c796f1899
}

exports.getTimeRange = (ts) => {
    const day = moment(ts);
    return {start:day.startOf('date').unix(),end:day.endOf('date').unix()};
}