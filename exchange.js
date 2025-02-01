class Exchange {
    constructor(apiKey, apiSecret, config) {
        this.apiKey = apiKey
        this.apiSecret = apiSecret
        this.config = config
    }

    async fetchOHLCV(symbol, timeframe) {
        throw new Error('Not implemented')
    }

    async executeOrder(symbol, side, quantity) {
        throw new Error('Not implemented')
    }
}

module.exports = Exchange