const redis = require('redis')
const { promisify } = require('util')
const Exchange = require('./exchange')

class TradingBot {
    constructor(exchange, config) {
        if (!(exchange instanceof Exchange)) throw new Error('Invalid exchange instance')
        this.exchange = exchange
        this.config = config
        this.redisClient = redis.createClient(config.redis)
        this.getAsync = promisify(this.redisClient.get).bind(this.redisClient)
        this.setAsync = promisify(this.redisClient.set).bind(this.redisClient)
    }

    async isTradeOpen() {
        const tradeState = await this.getAsync(this.config.tradeStateKey)
        return tradeState === 'open'
    }

    async setTradeState(state) {
        await this.setAsync(this.config.tradeStateKey, state)
    }

    async runSwingTradingStrategy() {
        // Fetch OHLCV data
        const ohlcv = await this.exchange.fetchOHLCV(this.config.symbol, this.config.timeframe)
        if (!ohlcv || ohlcv.length === 0) {
            console.log('No OHLCV data available.')
            return
        }

        // Calculate Fibonacci levels
        const high = Math.max(...ohlcv.map(candle => candle[2]))
        const low = Math.min(...ohlcv.map(candle => candle[3]))
        const closingPrices = ohlcv.map(candle => candle[4])
        const currentPrice = closingPrices[closingPrices.length - 1]
        const fibonacciLevels = this.calculateFibonacciLevels(high, low)

        // Check for buy or sell signals
        if (currentPrice > fibonacciLevels[fibonacciLevels.length - 1]) {
            console.log('Buy signal triggered at Fibonacci level')
            // Execute buy order logic here
        } else if (currentPrice < fibonacciLevels[0]) {
            console.log('Sell signal triggered at Fibonacci level')
            // Execute sell order logic here
        }
    }

    async runScalpingStrategy() {
        // Fetch OHLCV data
        const ohlcv = await this.exchange.fetchOHLCV(this.config.symbol, this.config.timeframe)
        if (!ohlcv || ohlcv.length === 0) {
            console.log('No OHLCV data available.')
            return
        }

        // Calculate scalping thresholds
        const closingPrices = ohlcv.map(candle => candle[4])
        const currentPrice = closingPrices[closingPrices.length - 1]
        const buyDrop = currentPrice * (1 - this.config.scalping.buyDropPercent)
        const sellRise = currentPrice * (1 + this.config.scalping.sellRisePercent)

        // Check for buy or sell signals
        if (currentPrice < buyDrop) {
            console.log('Buy signal triggered at scalping strategy')
            // Execute buy order logic here
        } else if (currentPrice > sellRise) {
            console.log('Sell signal triggered at scalping strategy')
            // Execute sell order logic here
        }
    }

    async run() {
        if (await this.isTradeOpen()) {
            console.log('A trade is currently open, waiting for it to close before starting a new one.')
            return
        }

        try {
            await this.runSwingTradingStrategy()
            await this.runScalpingStrategy()
        } finally {
            await this.setTradeState('closed')
        }
    }

    calculateFibonacciLevels(high, low) {
        const levels = this.config.swingTrading.fibonacciLevels
        return levels.map(level => {
            const diff = high - low
            const levelPrice = high - diff * level
            return levelPrice
        })
    }
}

module.exports = TradingBot