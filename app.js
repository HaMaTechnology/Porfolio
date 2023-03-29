require('dotenv').config();
const colors = require('colors');
colors.enable()

const db = require('./src/config/db.config');
const transferView = require('./src/view/transfer.view');

const main = async () => {
    //Load all csv data to Transfer Model. We can use Cron job to get Price at specific timestamp after new transaction were added with HISTORY_PRICE_API and insert to Database and cache with Redis for future enhancements
    await db.transfers.init();
    const args = process.argv.slice(2);
    const result = { token: "", date: "" }
    for (let i = 0; i < args.length; i++) {
        const element = args[i];
        const arr = element.split("=");
        if (arr.length == 2) {
            if (arr[0] == 'token') result.token = arr[1].toUpperCase();
            else if (arr[0] == 'date') result.date = new Date(arr[1]);
        }
    }
    if (result.token && result.date) {
        //Filter by result and date
        console.log("Given a date and a token, return the portfolio value of that token in USD on that date".red);
        transferView.getPorfolioTokenByDate(result.token, result.date);
    } else if (result.token) {
        console.log("Given a token, return the latest portfolio value for that token in USD".red);
        transferView.getPorfolioByToken(result.token);
    } else if (result.date) {
        console.log("Given a date, return the portfolio value per token in USD on that date".red);
        transferView.getPorfolioByDate(result.date);
    } else {
        console.log("Given no parameters, return the latest portfolio value per token in USD".red);
        transferView.getAllPorfolio();
    }
}
main()

