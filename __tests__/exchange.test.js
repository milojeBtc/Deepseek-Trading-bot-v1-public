const Exchange = require('../exchange')

describe('Exchange', () => {
    let exchange;

    beforeEach(() => {
        exchange = new Exchange('apiKey', 'apiSecret', {});
    });

    test('should throw an error when fetchOHLCV is called', async () => {
        await expect(exchange.fetchOHLCV('BTC/USDT', '1h')).rejects.toThrow('Not implemented');
    });

    test('should throw an error when executeOrder is called', async () => {
        await expect(exchange.executeOrder('BTC/USDT', 'buy', 1)).rejects.toThrow('Not implemented');
    });
})