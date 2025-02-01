const nock = require('nock')
const BinanceExchange = require('../binanceExchange')
const { apiKey, apiSecret, config } = require('../config')

describe('BinanceExchange', () => {
    let binanceExchange

    beforeEach(() => {
        binanceExchange = new BinanceExchange(apiKey, apiSecret, config)
    });

    afterEach(() => {
        nock.cleanAll()
    })

    // ... other tests ...

    test('should get balance', async () => {
        const balanceResponse = {
            BTC: {
                free: '0.1',
                used: '0.0',
                total: '0.1'
            }
        }

        nock('https://api.binance.com')
            .get('/api/v3/account')
            .query({ timestamp: /\d+/ }) // Match any timestamp
            .reply(200, balanceResponse)

        const balance = await binanceExchange.getBalance('BTC')
        expect(balance).toEqual(balanceResponse.BTC)
    })

    test('should get open orders', async () => {
        const openOrdersResponse = [
            {
                symbol: 'BTCUSDT',
                orderId: 123456789,
                // ... other order details
            }
        ]

        nock('https://api.binance.com')
            .get('/api/v3/openOrders')
            .query({ symbol: 'BTCUSDT', timestamp: /\d+/ }) // Match any timestamp
            .reply(200, openOrdersResponse)

        const openOrders = await binanceExchange.getOpenOrders('BTC/USDT')
        expect(openOrders).toEqual(openOrdersResponse)
    })

    test('should execute a market order', async () => {
        const orderResponse = {
            symbol: 'BTCUSDT',
            orderId: 987654321,
            // ... other order details
        }

        nock('https://api.binance.com')
            .post('/api/v3/order', {
                symbol: 'BTCUSDT',
                side: 'BUY',
                type: 'MARKET',
                quantity: '0.1',
                timestamp: /\d+/, // Match any timestamp
                signature: /.+/ // Match any signature
            })
            .reply(200, orderResponse)

        const order = await binanceExchange.executeOrder('BTC/USDT', 'buy', 0.1)
        expect(order).toEqual(orderResponse)
    });

    test('should cancel an order', async () => {
        const cancelResponse = {
            symbol: 'BTCUSDT',
            orderId: 987654321,
            // ... other cancellation details
        }

        nock('https://api.binance.com')
            .delete('/api/v3/order', {
                symbol: 'BTCUSDT',
                orderId: '987654321',
                timestamp: /\d+/, // Match any timestamp
                signature: /.+/ // Match any signature
            })
            .reply(200, cancelResponse)

        const cancel = await binanceExchange.cancelOrder(987654321, 'BTC/USDT')
        expect(cancel).toEqual(cancelResponse)
    })
})