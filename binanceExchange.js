const Exchange = require('./exchange')
const ccxt = require('ccxt')

class BinanceExchange extends Exchange {
    constructor(apiKey, apiSecret, config) {
        super(apiKey, apiSecret, config)
        this.exchange = new ccxt.binance({
            apiKey: apiKey,
            secret: apiSecret
        })
    }

    async fetchOHLCV(symbol, timeframe) {
        try {
            const ohlcv = await this.exchange.fetchOHLCV(symbol, timeframe)
            return ohlcv
        } catch (error) {
            console.error('Error fetching OHLCV data:', error)
            throw error
        }
    }

    async getBalance(symbol) {
        try {
            const balance = await this.exchange.fetchBalance()
            return balance[symbol]
        } catch (error) {
            console.error('Error fetching balance:', error)
            throw error
        }
    }

    async getOpenOrders(symbol) {
        try {
            const openOrders = await this.exchange.fetchOpenOrders(symbol)
            return openOrders
        } catch (error) {
            console.error('Error fetching open orders:', error)
            throw error
        }
    }

    async executeOrder(symbol, side, quantity) {
        try {
            const order = await this.exchange.createMarketOrder(symbol, side, this.exchange.amountToPrecision(symbol, quantity))
            console.log(`Order executed: ${order.id}`)
            return order
        } catch (error) {
            console.error('Error executing order:', error)
            throw error
        }
    }

    async cancelOrder(orderId, symbol) {
        try {
            const response = await this.exchange.cancelOrder(orderId, symbol)
            console.log(`Order canceled: ${orderId}`)
            return response
        } catch (error) {
            console.error('Error canceling order:', error)
            throw error
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

module.exports = BinanceExchange