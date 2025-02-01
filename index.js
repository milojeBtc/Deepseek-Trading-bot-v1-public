const config = require('./config')
const BinanceExchange = require('./binanceExchange')
const TradingBot = require('./bot')

const binance = new BinanceExchange(config.apiKey, config.apiSecret, config)
const bot = new TradingBot(binance, config)

bot.run().catch(console.error)

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason)
    process.exit(1)
})

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception thrown:', err)
    process.exit(1)
})