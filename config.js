module.exports = {
    apiKey: 'your_api_key',
    apiSecret: 'your_api_secret',
    symbol: 'BTC/USDT',
    timeframe: '1h',
    scalping: {
        buyDropPercent: 0.01, // 1% drop for buy signal
        sellRisePercent: 0.01 // 1% rise for sell signal
    },
    swingTrading: {
        fibonacciLevels: [0.236, 0.382, 0.5, 0.618, 0.786] // Fibonacci retracement levels
    },
    redis: {
        host: 'localhost',
        port: 6379
    },
    exchange: 'binance'
}