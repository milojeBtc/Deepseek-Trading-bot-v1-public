const TradingBot = require('../bot');
const BinanceExchange = require('../binanceExchange');
const { apiKey, apiSecret, config } = require('../config');

jest.mock('../binanceExchange');

describe('TradingBot', () => {
    let bot;
    let exchange;

    beforeEach(() => {
        exchange = new BinanceExchange(apiKey, apiSecret, config);
        bot = new TradingBot(exchange, config);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should check if a trade is open', async () => {
        bot.getAsync = jest.fn().mockResolvedValue('open');
        const isOpen = await bot.isTradeOpen();
        expect(isOpen).toBe(true);
        expect(bot.getAsync).toHaveBeenCalledWith(bot.config.tradeStateKey);
    });

    test('should set the trade state', async () => {
        bot.setAsync = jest.fn().mockResolvedValue(null);
        await bot.setTradeState('closed');
        expect(bot.setAsync).toHaveBeenCalledWith(bot.config.tradeStateKey, 'closed');
    });

    test('should run the swing trading strategy', async () => {
        // Mock the exchange's fetchOHLCV method to return sample data
        exchange.fetchOHLCV = jest.fn().mockResolvedValue([
            [1504541580000, '0.0027', '0.0027', '0.0027', '0.0027', '10'], // Sample candle
            // ... more candles as needed
        ]);

        // Mock the bot's calculateFibonacciLevels method
        bot.calculateFibonacciLevels = jest.fn().mockReturnValue([0.0020, 0.0023, 0.0027]);

        // Mock the bot's setTradeState method
        bot.setTradeState = jest.fn().mockResolvedValue(null);

        // Run the swing trading strategy
        await bot.runSwingTradingStrategy();

        // Assertions will depend on the logic within the strategy
        // For example, you might check if the buy or sell signals were triggered
        // and if the appropriate methods were called on the exchange
    });

    test('should run the scalping strategy', async () => {
        // Mock the exchange's fetchOHLCV method to return sample data
        exchange.fetchOHLCV = jest.fn().mockResolvedValue([
            [1504541580000, '0.0027', '0.0027', '0.0027', '0.0027', '10'], // Sample candle
            // ... more candles as needed
        ]);

        // Mock the bot's setTradeState method
        bot.setTradeState = jest.fn().mockResolvedValue(null);

        // Run the scalping strategy
        await bot.runScalpingStrategy();

        // Assertions will depend on the logic within the strategy
        // For example, you might check if the buy or sell signals were triggered
        // and if the appropriate methods were called on the exchange
    });
});