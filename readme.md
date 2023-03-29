## Introduction

This application was written on MVC Model. The Model-View-Controller (MVC) is an architectural pattern that separates an application into three main logical components: the model, the view, and the controller. Each of these components are built to handle specific development aspects of an application.

## How to use

#### Get latest portfolio value

```http
  node app.js token=<token> date=<date>
```
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `token` | `string` | **optional**. Your specific token |
| `date` | `string` | **optional**. The day that you want to filter year/month/day |

Result:
| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `depositAmount` | `number` | total Deposit amount in that token |
| `withdrawAmount` | `number` | total Withdawal amount in that token |
| `totalDepositUSD` | `number` | total Deposit amount in USD |
| `totalWithdrawUSD` | `number` | total Withdrawal amount in USD |
| `holdings` | `number` | Remaining token amount that you still holding|
| `portfolio` | `number` | Profit/loss that you made. |
| `percent` | `number` | profit/loss percentage |

Example:
- Update  `tableConvert.com.csv` file with your buy and sell transaction
- `node app.js` : return the latest portfolio value per token in USD
- `node app.js token=MATIC` : return the latest portfolio value for MATIC in USD
- `node app.js date=2023/3/27` : return the portfolio value per token in USD on March 27th 2023
- `node app.js date=2023/3/27 token=MATIC` : return the portfolio value of that token in USD on March 27th 2023

<p align="center"><img src="https://fudo.academy/propine.png"></p>

## Implementation

`transfer.model`: The File has a function `init()`, which can be used to read data from csv and import file to Transfer Model.

We can use Cron Job to get Price at specific timestamp after new transaction were added with HISTORY_PRICE_API and insert to Database and cache with Redis for future enhancements

`transfer.controller`: The File has a function `calculateProfitLoss(data,token)`, which can be used to Canculate Profit and Loss for specific token wih formula.
`Porfolio = Remaining Token in USD + total Withdrawal Token in USD - total Deposit token in USD`

`transfer.view`: The File can be used to Validate input and format the display UI with data return from controller

`.env`:  environment config.