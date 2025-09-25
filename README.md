# Cryptocurrency Trading Bot

An automated trading bot for buying and selling Bitcoin and other cryptocurrencies.

## Features

- Connects to popular cryptocurrency exchanges using CCXT
- Configurable trading strategy
- Automatic buy and sell based on price movements
- Stop loss and take profit functionality
- Logging and monitoring

## Prerequisites

- Python 3.8+
- API keys from your preferred cryptocurrency exchange

## Installation

1. Clone this repository
```
git clone https://github.com/yourusername/crypto-trading-bot.git
cd crypto-trading-bot
```

2. Install dependencies
```
pip install -r requirements.txt
```

3. Set up your environment variables by copying the example file
```
cp .env.example .env
```

4. Edit the `.env` file with your exchange API keys and trading preferences

## Configuration

Edit the `.env` file to configure your bot:

```
# Exchange API credentials
EXCHANGE=binance
API_KEY=your_api_key_here
API_SECRET=your_api_secret_here

# Trading parameters
SYMBOL=BTC/USDT
TRADE_AMOUNT=0.001  # Amount of BTC to trade
PROFIT_THRESHOLD=1.5  # Percentage profit target
STOP_LOSS=1.0  # Percentage stop loss
CHECK_INTERVAL=60  # Time in seconds between checks
```

## Usage

Run the bot:

```
python crypto_bot.py
```

To use a custom strategy:

```
python crypto_bot.py --strategy moving_average
```

## Available Strategies

- Default: Simple profit threshold and stop loss
- Moving Average: Buy when short-term MA crosses above long-term MA, sell when it crosses below
- RSI: Buy when RSI is below 30 (oversold), sell when RSI is above 70 (overbought)

## Disclaimer

This bot is for educational purposes only. Use it at your own risk. Cryptocurrency trading involves substantial risk of loss and is not suitable for everyone.

## License

MIT