#!/usr/bin/env python3
"""
Optimized Crypto Trading Bot

A professional-grade trading bot with enhanced profit potential.
"""

import os
import time
import logging
import json
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import ccxt
from dotenv import load_dotenv
import ta  # Technical Analysis library

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("trading_bot.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('optimized_bot')

# Load environment variables
load_dotenv()

class OptimizedTradingBot:
    def __init__(self, exchange_id='binance', test_mode=False):
        """Initialize the optimized trading bot."""
        # Exchange settings
        self.exchange_id = os.getenv('EXCHANGE', exchange_id)
        self.api_key = os.getenv('API_KEY')
        self.api_secret = os.getenv('API_SECRET')
        self.test_mode = test_mode
        
        # Trading parameters
        self.symbols = os.getenv('SYMBOLS', 'BTC/USDT,ETH/USDT').split(',')
        self.base_currencies = [s.split('/')[0] for s in self.symbols]
        self.quote_currency = self.symbols[0].split('/')[1]  # Assuming all use same quote
        
        # Dynamic position sizing - percentage of available balance
        self.position_size_pct = float(os.getenv('POSITION_SIZE_PCT', 10))  # Default 10%
        
        # Strategy parameters
        self.check_interval = int(os.getenv('CHECK_INTERVAL', 60))  # Seconds
        self.timeframes = {
            'trend': os.getenv('TREND_TIMEFRAME', '4h'),
            'signal': os.getenv('SIGNAL_TIMEFRAME', '1h'),
            'entry': os.getenv('ENTRY_TIMEFRAME', '15m')
        }
        
        # Risk management parameters
        self.max_trades_per_day = int(os.getenv('MAX_TRADES_PER_DAY', 5))
        self.max_open_trades = int(os.getenv('MAX_OPEN_TRADES', 2))
        self.max_daily_loss = float(os.getenv('MAX_DAILY_LOSS', 5.0))  # Percentage
        self.trailing_stop = float(os.getenv('TRAILING_STOP', 1.0))  # Percentage
        self.profit_target = float(os.getenv('PROFIT_TARGET', 2.5))  # Percentage
        self.stop_loss = float(os.getenv('STOP_LOSS', 2.0))  # Percentage
        
        # Trading state
        self.open_positions = {}
        self.daily_stats = {
            'trades': 0,
            'profit_loss': 0.0,
            'date': datetime.now().date()
        }
        self.trade_history = []
        
        # Initialize exchange
        self.initialize_exchange()
        
        # Market data cache
        self.market_data = {}
        
    def initialize_exchange(self):
        """Connect to the cryptocurrency exchange."""
        try:
            # Create exchange instance
            exchange_class = getattr(ccxt, self.exchange_id)
            self.exchange = exchange_class({
                'apiKey': self.api_key,
                'secret': self.api_secret,
                'enableRateLimit': True,
                'options': {
                    'defaultType': 'spot'
                }
            })
            
            if not self.test_mode:
                # Check if API keys are valid
                if self.api_key and self.api_secret:
                    logger.info(f"Connected to {self.exchange_id}")
                    self.fetch_balances()  # This will fail if API keys are invalid
                else:
                    logger.warning("API keys not provided. Running in demo mode.")
            else:
                logger.info("Running in TEST MODE - no real trades will be executed")
                
        except Exception as e:
            logger.error(f"Error initializing exchange: {e}")
            raise

    def fetch_balances(self):
        """Fetch account balances for all relevant currencies."""
        try:
            if self.test_mode:
                # Return fake balances for testing
                return {
                    'USDT': 1000.0,
                    'BTC': 0.05,
                    'ETH': 0.5
                }
                
            balance = self.exchange.fetch_balance()
            result = {}
            
            # Get quote currency balance
            quote_balance = balance.get(self.quote_currency, {}).get('free', 0)
            result[self.quote_currency] = quote_balance
            
            # Get base currency balances
            for base in self.base_currencies:
                base_balance = balance.get(base, {}).get('free', 0)
                result[base] = base_balance
            
            logger.info(f"Balances: {result}")
            return result
            
        except Exception as e:
            logger.error(f"Error fetching balances: {e}")
            return None
    
    def fetch_market_data(self, symbol, timeframe='1h', limit=100):
        """Fetch historical market data and compute technical indicators."""
        try:
            # Check if we already have recent data
            cache_key = f"{symbol}_{timeframe}"
            if cache_key in self.market_data:
                last_update = self.market_data[cache_key]['last_update']
                if datetime.now() - last_update < timedelta(minutes=1):
                    return self.market_data[cache_key]['data']
            
            # Fetch new data
            ohlcv = self.exchange.fetch_ohlcv(symbol, timeframe, limit=limit)
            df = pd.DataFrame(ohlcv, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
            df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
            df.set_index('timestamp', inplace=True)
            
            # Calculate technical indicators
            self.add_technical_indicators(df)
            
            # Cache the data
            self.market_data[cache_key] = {
                'data': df,
                'last_update': datetime.now()
            }
            
            return df
            
        except Exception as e:
            logger.error(f"Error fetching market data for {symbol}/{timeframe}: {e}")
            return None
    
    def add_technical_indicators(self, df):
        """Add technical indicators to the dataframe."""
        try:
            # Moving Averages
            df['sma_9'] = ta.trend.sma_indicator(df['close'], window=9)
            df['sma_20'] = ta.trend.sma_indicator(df['close'], window=20)
            df['sma_50'] = ta.trend.sma_indicator(df['close'], window=50)
            df['sma_200'] = ta.trend.sma_indicator(df['close'], window=200)
            df['ema_12'] = ta.trend.ema_indicator(df['close'], window=12)
            df['ema_26'] = ta.trend.ema_indicator(df['close'], window=26)
            
            # MACD
            macd = ta.trend.MACD(df['close'], window_slow=26, window_fast=12, window_sign=9)
            df['macd'] = macd.macd()
            df['macd_signal'] = macd.macd_signal()
            df['macd_diff'] = macd.macd_diff()
            
            # RSI
            df['rsi'] = ta.momentum.RSIIndicator(df['close'], window=14).rsi()
            
            # Bollinger Bands
            bollinger = ta.volatility.BollingerBands(df['close'], window=20, window_dev=2)
            df['bollinger_upper'] = bollinger.bollinger_hband()
            df['bollinger_middle'] = bollinger.bollinger_mavg()
            df['bollinger_lower'] = bollinger.bollinger_lband()
            
            # ADX - Trend strength
            df['adx'] = ta.trend.ADXIndicator(df['high'], df['low'], df['close'], window=14).adx()
            
            # Volume indicators
            df['vwap'] = self.calculate_vwap(df)
            df['volume_ma'] = ta.volume.volume_sma_indicator(df['volume'], window=20)
            
            return df
        except Exception as e:
            logger.error(f"Error calculating technical indicators: {e}")
            return df
    
    def calculate_vwap(self, df):
        """Calculate Volume Weighted Average Price."""
        try:
            df = df.copy()
            df['typical_price'] = (df['high'] + df['low'] + df['close']) / 3
            df['price_volume'] = df['typical_price'] * df['volume']
            df['cumulative_volume'] = df['volume'].cumsum()
            df['cumulative_price_volume'] = df['price_volume'].cumsum()
            vwap = df['cumulative_price_volume'] / df['cumulative_volume']
            return vwap
        except Exception as e:
            logger.error(f"Error calculating VWAP: {e}")
            return pd.Series(index=df.index)
    
    def should_buy(self, symbol):
        """Determine if we should buy based on multiple timeframe analysis."""
        try:
            # Check trend on higher timeframe
            trend_data = self.fetch_market_data(symbol, self.timeframes['trend'])
            if trend_data is None or len(trend_data) < 50:
                return False
            
            # Check if we're in an uptrend on the higher timeframe
            in_uptrend = (trend_data['close'].iloc[-1] > trend_data['sma_50'].iloc[-1] and 
                          trend_data['adx'].iloc[-1] > 25)
            
            if not in_uptrend:
                logger.info(f"{symbol} not in uptrend on {self.timeframes['trend']} timeframe")
                return False
            
            # Check signal on mid timeframe
            signal_data = self.fetch_market_data(symbol, self.timeframes['signal'])
            if signal_data is None or len(signal_data) < 30:
                return False
            
            # Check for bullish signals
            bullish_macd = (signal_data['macd_diff'].iloc[-1] > 0 and 
                           signal_data['macd_diff'].iloc[-2] <= 0)  # MACD crossover
            
            bullish_rsi = (signal_data['rsi'].iloc[-1] > 40 and 
                           signal_data['rsi'].iloc[-1] < 70 and
                           signal_data['rsi'].iloc[-2] < signal_data['rsi'].iloc[-1])  # RSI trending up
            
            # Check for entry on lower timeframe
            entry_data = self.fetch_market_data(symbol, self.timeframes['entry'])
            if entry_data is None or len(entry_data) < 20:
                return False
            
            price_above_vwap = entry_data['close'].iloc[-1] > entry_data['vwap'].iloc[-1]
            
            # Volume confirmation
            volume_increasing = entry_data['volume'].iloc[-1] > entry_data['volume_ma'].iloc[-1]
            
            # Final decision
            if (in_uptrend and 
                (bullish_macd or bullish_rsi) and 
                price_above_vwap and 
                volume_increasing):
                logger.info(f"Buy signal for {symbol} detected")
                logger.info(f"Uptrend: {in_uptrend}, MACD: {bullish_macd}, RSI: {bullish_rsi}, Price>VWAP: {price_above_vwap}, Volume: {volume_increasing}")
                return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error in should_buy for {symbol}: {e}")
            return False
    
    def should_sell(self, symbol, position):
        """Determine if we should sell a position."""
        try:
            current_price = self.get_current_price(symbol)
            if not current_price:
                return False
                
            buy_price = position['buy_price']
            highest_price = position.get('highest_price', buy_price)
            
            # Update highest seen price
            if current_price > highest_price:
                position['highest_price'] = current_price
                highest_price = current_price
            
            # Calculate percentages
            price_change_pct = ((current_price - buy_price) / buy_price) * 100
            drawdown_pct = ((highest_price - current_price) / highest_price) * 100
            
            # Trailing stop logic - sell if price drops x% from highest seen
            if highest_price > buy_price and drawdown_pct >= self.trailing_stop:
                logger.info(f"Trailing stop triggered for {symbol}: {drawdown_pct:.2f}% drop from high of {highest_price}")
                return True
                
            # Take profit logic
            if price_change_pct >= self.profit_target:
                logger.info(f"Take profit triggered for {symbol}: {price_change_pct:.2f}% profit")
                return True
                
            # Stop loss logic
            if price_change_pct <= -self.stop_loss:
                logger.info(f"Stop loss triggered for {symbol}: {price_change_pct:.2f}% loss")
                return True
            
            # Check for sell signals based on indicators
            signal_data = self.fetch_market_data(symbol, self.timeframes['signal'])
            if signal_data is None:
                return False
                
            # MACD bearish crossover
            bearish_macd = (signal_data['macd_diff'].iloc[-1] < 0 and 
                           signal_data['macd_diff'].iloc[-2] >= 0)
                           
            # RSI overbought
            rsi_overbought = signal_data['rsi'].iloc[-1] > 70
            
            # Price below VWAP
            entry_data = self.fetch_market_data(symbol, self.timeframes['entry'])
            price_below_vwap = entry_data['close'].iloc[-1] < entry_data['vwap'].iloc[-1]
            
            # Only use technical indicators for exit if we're in profit
            if price_change_pct > 0 and (bearish_macd or rsi_overbought or price_below_vwap):
                logger.info(f"Technical sell signal for {symbol}: MACD: {bearish_macd}, RSI: {rsi_overbought}, Price<VWAP: {price_below_vwap}")
                return True
                
            return False
            
        except Exception as e:
            logger.error(f"Error in should_sell for {symbol}: {e}")
            return False
    
    def get_current_price(self, symbol):
        """Get current market price."""
        try:
            ticker = self.exchange.fetch_ticker(symbol)
            current_price = ticker['last']
            return current_price
        except Exception as e:
            logger.error(f"Error fetching current price for {symbol}: {e}")
            return None
    
    def calculate_position_size(self, symbol):
        """Dynamically calculate position size based on available balance and risk."""
        try:
            balances = self.fetch_balances()
            if not balances:
                return 0
                
            quote_balance = balances.get(self.quote_currency, 0)
            
            # Determine how much to allocate based on percentage
            allocation = quote_balance * (self.position_size_pct / 100)
            
            # Ensure we don't exceed maximum open trades
            if len(self.open_positions) >= self.max_open_trades:
                logger.warning(f"Maximum open trades reached: {self.max_open_trades}")
                return 0
                
            # Check if we've reached daily trade limit
            if self.daily_stats['trades'] >= self.max_trades_per_day:
                logger.warning(f"Maximum daily trades reached: {self.max_trades_per_day}")
                return 0
                
            # Check if we've reached daily loss limit
            if self.daily_stats['profit_loss'] <= -self.max_daily_loss:
                logger.warning(f"Maximum daily loss reached: {self.daily_stats['profit_loss']:.2f}%")
                return 0
                
            # Get current price to calculate quantity
            current_price = self.get_current_price(symbol)
            if not current_price:
                return 0
                
            # Calculate quantity
            quantity = allocation / current_price
            
            # Round to appropriate decimals for the asset
            try:
                market = self.exchange.market(symbol)
                precision = market['precision']['amount']
                quantity = round(quantity, precision) if precision else int(quantity)
            except:
                # Default precision if we can't get market info
                quantity = round(quantity, 6)
                
            logger.info(f"Calculated position size for {symbol}: {quantity} (value: {quantity * current_price} {self.quote_currency})")
            return quantity
            
        except Exception as e:
            logger.error(f"Error calculating position size for {symbol}: {e}")
            return 0
    
    def place_buy_order(self, symbol):
        """Place a buy order."""
        try:
            # Calculate position size
            quantity = self.calculate_position_size(symbol)
            
            if quantity <= 0:
                logger.warning(f"Invalid quantity ({quantity}) for {symbol}, skipping buy")
                return False
                
            price = self.get_current_price(symbol)
            if not price:
                return False
                
            if self.test_mode or not (self.api_key and self.api_secret):
                # Test mode or demo mode
                logger.info(f"[TEST] Buy order placed: {quantity} {symbol} at {price}")
                
                # Record the position
                self.open_positions[symbol] = {
                    'quantity': quantity,
                    'buy_price': price,
                    'buy_time': datetime.now(),
                    'highest_price': price
                }
                
                # Update daily stats
                self.daily_stats['trades'] += 1
                
                return True
                
            # Place limit buy order slightly above current price to ensure it fills
            limit_price = price * 1.002  # 0.2% above current price
            
            order = self.exchange.create_limit_buy_order(
                symbol,
                quantity,
                limit_price
            )
            
            logger.info(f"Buy order placed: {order}")
            
            # Record the position
            self.open_positions[symbol] = {
                'quantity': quantity,
                'buy_price': price,
                'order_id': order['id'],
                'buy_time': datetime.now(),
                'highest_price': price
            }
            
            # Update daily stats
            self.daily_stats['trades'] += 1
            
            return True
            
        except Exception as e:
            logger.error(f"Error placing buy order for {symbol}: {e}")
            return False
    
    def place_sell_order(self, symbol):
        """Place a sell order."""
        try:
            if symbol not in self.open_positions:
                logger.warning(f"No open position for {symbol}, cannot sell")
                return False
                
            position = self.open_positions[symbol]
            quantity = position['quantity']
            buy_price = position['buy_price']
            
            price = self.get_current_price(symbol)
            if not price:
                return False
                
            if self.test_mode or not (self.api_key and self.api_secret):
                # Test mode or demo mode
                logger.info(f"[TEST] Sell order placed: {quantity} {symbol} at {price}")
                
                # Calculate profit/loss
                profit_loss_pct = ((price - buy_price) / buy_price) * 100
                
                # Update daily stats
                self.daily_stats['profit_loss'] += profit_loss_pct
                
                # Record trade
                trade = {
                    'symbol': symbol,
                    'buy_price': buy_price,
                    'sell_price': price,
                    'quantity': quantity,
                    'profit_loss': profit_loss_pct,
                    'buy_time': position['buy_time'],
                    'sell_time': datetime.now(),
                    'holding_time': (datetime.now() - position['buy_time']).total_seconds() / 60  # minutes
                }
                
                self.trade_history.append(trade)
                logger.info(f"Trade closed: {profit_loss_pct:.2f}% P/L on {symbol}")
                
                # Remove the position
                del self.open_positions[symbol]
                
                return True
                
            # Place limit sell order slightly below current price to ensure it fills
            limit_price = price * 0.998  # 0.2% below current price
            
            order = self.exchange.create_limit_sell_order(
                symbol,
                quantity,
                limit_price
            )
            
            logger.info(f"Sell order placed: {order}")
            
            # Calculate profit/loss
            profit_loss_pct = ((price - buy_price) / buy_price) * 100
            
            # Update daily stats
            self.daily_stats['profit_loss'] += profit_loss_pct
            
            # Record trade
            trade = {
                'symbol': symbol,
                'buy_price': buy_price,
                'sell_price': price,
                'quantity': quantity,
                'profit_loss': profit_loss_pct,
                'buy_time': position['buy_time'],
                'sell_time': datetime.now(),
                'order_id': order['id'],
                'holding_time': (datetime.now() - position['buy_time']).total_seconds() / 60  # minutes
            }
            
            self.trade_history.append(trade)
            logger.info(f"Trade closed: {profit_loss_pct:.2f}% P/L on {symbol}")
            
            # Remove the position
            del self.open_positions[symbol]
            
            return True
            
        except Exception as e:
            logger.error(f"Error placing sell order for {symbol}: {e}")
            return False
    
    def check_daily_reset(self):
        """Reset daily counters if it's a new day."""
        today = datetime.now().date()
        if today > self.daily_stats['date']:
            logger.info(f"New day started. Resetting daily stats. Previous: {self.daily_stats}")
            self.daily_stats = {
                'trades': 0,
                'profit_loss': 0.0,
                'date': today
            }
    
    def check_and_execute_trades(self):
        """Check for trading opportunities and execute trades."""
        # Check if we need to reset daily counters
        self.check_daily_reset()
        
        # First check existing positions for sell signals
        for symbol in list(self.open_positions.keys()):
            position = self.open_positions[symbol]
            if self.should_sell(symbol, position):
                logger.info(f"Sell signal for {symbol}, executing...")
                self.place_sell_order(symbol)
        
        # Then check for new buy opportunities
        if len(self.open_positions) < self.max_open_trades and self.daily_stats['trades'] < self.max_trades_per_day:
            for symbol in self.symbols:
                if symbol not in self.open_positions and self.should_buy(symbol):
                    logger.info(f"Buy signal for {symbol}, executing...")
                    if self.place_buy_order(symbol):
                        # If we reached max open trades, stop looking for more
                        if len(self.open_positions) >= self.max_open_trades:
                            break
    
    def run(self):
        """Main bot loop."""
        logger.info(f"Starting optimized trading bot for {self.symbols} on {self.exchange_id}...")
        
        if self.test_mode:
            logger.info("RUNNING IN TEST MODE - NO REAL TRADES WILL BE EXECUTED")
        
        try:
            while True:
                current_time = datetime.now()
                logger.info(f"Checking trading conditions at {current_time}")
                
                # Execute trades
                self.check_and_execute_trades()
                
                # Log current status
                self.log_status()
                
                # Sleep until next check
                logger.info(f"Sleeping for {self.check_interval} seconds...")
                time.sleep(self.check_interval)
                
        except KeyboardInterrupt:
            logger.info("Bot stopped manually.")
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
    
    def log_status(self):
        """Log current trading status."""
        try:
            balances = self.fetch_balances()
            
            logger.info("=== CURRENT STATUS ===")
            logger.info(f"Open positions: {len(self.open_positions)}")
            
            for symbol, position in self.open_positions.items():
                current_price = self.get_current_price(symbol)
                if current_price:
                    buy_price = position['buy_price']
                    profit_loss_pct = ((current_price - buy_price) / buy_price) * 100
                    logger.info(f"  {symbol}: {position['quantity']} @ {buy_price} | Current: {current_price} | P/L: {profit_loss_pct:.2f}%")
            
            logger.info(f"Today's trades: {self.daily_stats['trades']}/{self.max_trades_per_day}")
            logger.info(f"Today's P/L: {self.daily_stats['profit_loss']:.2f}%")
            
            if balances:
                logger.info("Current balances:")
                for currency, amount in balances.items():
                    logger.info(f"  {currency}: {amount}")
            
            logger.info("====================")
        except Exception as e:
            logger.error(f"Error logging status: {e}")


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description='Optimized Cryptocurrency Trading Bot')
    parser.add_argument('--test', action='store_true', help='Run in test mode (no real trades)')
    parser.add_argument('--exchange', type=str, default='binance', help='Exchange to use')
    args = parser.parse_args()
    
    bot = OptimizedTradingBot(exchange_id=args.exchange, test_mode=args.test)
    bot.run()










