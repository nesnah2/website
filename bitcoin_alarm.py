#!/usr/bin/env python3
"""
Bitcoin Trading Alarm System

Monitors Bitcoin price movements and generates buy/sell signals based on 
technical analysis, without executing actual trades.
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
import requests
import webbrowser
import argparse
from pathlib import Path
import yaml

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("bitcoin_alarm.log"),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger('bitcoin_alarm')

# Load environment variables
load_dotenv()

class BitcoinAlarm:
    def __init__(self, config_file='config.yaml', test_mode=False, notification_method='browser'):
        """Initialize the Bitcoin alarm system."""
        # Load configuration
        self.config = self.load_config(config_file)
        
        # Exchange settings
        self.exchange_id = self.config['exchange']['name']
        self.api_key = os.getenv('API_KEY', self.config['exchange'].get('api_key', ''))
        self.api_secret = os.getenv('API_SECRET', self.config['exchange'].get('api_secret', ''))
        self.test_mode = test_mode
        
        # Trading parameters
        self.symbols = ["BTC/USDT"]  # Focus on Bitcoin only
        self.check_interval = int(os.getenv('CHECK_INTERVAL', self.config['trading'].get('check_interval', 300)))  # Check every 5 minutes by default
        
        # Timeframes for analysis
        self.timeframes = self.config['timeframes']
        
        # Strategy parameters
        self.profit_target = float(os.getenv('PROFIT_TARGET', self.config['strategy'].get('profit_target', 2.5)))
        self.stop_loss = float(os.getenv('STOP_LOSS', self.config['strategy'].get('stop_loss', 2.0)))
        self.trailing_stop = float(os.getenv('TRAILING_STOP', self.config['strategy'].get('trailing_stop', 1.0)))
        
        # Notification settings
        self.notification_method = notification_method
        self.last_notification_time = {}  # Track when we last sent notifications for each symbol
        self.notification_cooldown = 3600  # Don't send repeated notifications within this many seconds (1 hour default)
        
        # Initialize exchange connection for price data
        self.initialize_exchange()
        
        # Market data cache
        self.market_data = {}
        
        # Signal history to prevent duplicate alerts
        self.signal_history = {symbol: {'last_buy_signal': None, 'last_sell_signal': None} for symbol in self.symbols}
        
        # Create log directory
        Path("signals").mkdir(exist_ok=True)
        
    def load_config(self, config_file):
        """Load configuration from YAML file."""
        try:
            with open(config_file, 'r') as file:
                config = yaml.safe_load(file)
            logger.info(f"Loaded configuration from {config_file}")
            return config
        except Exception as e:
            logger.error(f"Error loading config file: {e}")
            # Use default configuration if file can't be loaded
            return {
                'exchange': {'name': 'binance'},
                'trading': {
                    'symbols': ["BTC/USDT"],
                    'check_interval': 300
                },
                'timeframes': {
                    'trend': '4h',
                    'signal': '1h',
                    'entry': '15m'
                },
                'strategy': {
                    'profit_target': 2.5,
                    'stop_loss': 2.0,
                    'trailing_stop': 1.0
                },
                'risk_management': {
                    'max_open_trades': 2
                }
            }
        
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
            
            logger.info(f"Connected to {self.exchange_id}")
                
        except Exception as e:
            logger.error(f"Error initializing exchange: {e}")
            raise

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
    
    def check_buy_signal(self, symbol):
        """Determine if we have a buy signal."""
        try:
            # Check trend on higher timeframe
            trend_data = self.fetch_market_data(symbol, self.timeframes['trend'])
            if trend_data is None or len(trend_data) < 50:
                return False, {}
            
            # Check if we're in an uptrend on the higher timeframe
            in_uptrend = (trend_data['close'].iloc[-1] > trend_data['sma_50'].iloc[-1] and 
                          trend_data['adx'].iloc[-1] > 25)
            
            if not in_uptrend:
                logger.debug(f"{symbol} not in uptrend on {self.timeframes['trend']} timeframe")
                return False, {}
            
            # Check signal on mid timeframe
            signal_data = self.fetch_market_data(symbol, self.timeframes['signal'])
            if signal_data is None or len(signal_data) < 30:
                return False, {}
            
            # Check for bullish signals
            bullish_macd = (signal_data['macd_diff'].iloc[-1] > 0 and 
                           signal_data['macd_diff'].iloc[-2] <= 0)  # MACD crossover
            
            bullish_rsi = (signal_data['rsi'].iloc[-1] > 40 and 
                           signal_data['rsi'].iloc[-1] < 70 and
                           signal_data['rsi'].iloc[-2] < signal_data['rsi'].iloc[-1])  # RSI trending up
            
            # Check for entry on lower timeframe
            entry_data = self.fetch_market_data(symbol, self.timeframes['entry'])
            if entry_data is None or len(entry_data) < 20:
                return False, {}
            
            price_above_vwap = entry_data['close'].iloc[-1] > entry_data['vwap'].iloc[-1]
            
            # Volume confirmation
            volume_increasing = entry_data['volume'].iloc[-1] > entry_data['volume_ma'].iloc[-1]
            
            # Current price and additional metrics for the alert
            current_price = entry_data['close'].iloc[-1]
            signal_metrics = {
                'price': current_price,
                'rsi': signal_data['rsi'].iloc[-1],
                'macd': signal_data['macd'].iloc[-1],
                'macd_signal': signal_data['macd_signal'].iloc[-1],
                'adx': trend_data['adx'].iloc[-1],
                'in_uptrend': in_uptrend,
                'bullish_macd': bullish_macd,
                'bullish_rsi': bullish_rsi,
                'price_above_vwap': price_above_vwap,
                'volume_increasing': volume_increasing,
                'sma_50': trend_data['sma_50'].iloc[-1],
                'sma_200': trend_data['sma_200'].iloc[-1]
            }
            
            # Final decision
            if (in_uptrend and 
                (bullish_macd or bullish_rsi) and 
                price_above_vwap and 
                volume_increasing):
                
                # Check if this is a new signal
                if self.signal_history[symbol]['last_buy_signal'] is None or \
                   datetime.now() - self.signal_history[symbol]['last_buy_signal'] > timedelta(hours=1):
                    self.signal_history[symbol]['last_buy_signal'] = datetime.now()
                    logger.info(f"BUY signal for {symbol} detected")
                    return True, signal_metrics
                
                return False, {}  # Already notified recently
            
            return False, {}
            
        except Exception as e:
            logger.error(f"Error in check_buy_signal for {symbol}: {e}")
            return False, {}
    
    def check_sell_signal(self, symbol):
        """Determine if we have a sell signal."""
        try:
            # Get current price and technical data
            signal_data = self.fetch_market_data(symbol, self.timeframes['signal'])
            entry_data = self.fetch_market_data(symbol, self.timeframes['entry'])
            
            if signal_data is None or entry_data is None:
                return False, {}
                
            current_price = entry_data['close'].iloc[-1]
                
            # MACD bearish crossover
            bearish_macd = (signal_data['macd_diff'].iloc[-1] < 0 and 
                           signal_data['macd_diff'].iloc[-2] >= 0)
                           
            # RSI overbought
            rsi_overbought = signal_data['rsi'].iloc[-1] > 70
            
            # Price below VWAP
            price_below_vwap = entry_data['close'].iloc[-1] < entry_data['vwap'].iloc[-1]
            
            # Check for trend reversal
            trend_data = self.fetch_market_data(symbol, self.timeframes['trend'])
            trend_reversal = (
                trend_data['close'].iloc[-1] < trend_data['sma_50'].iloc[-1] and
                trend_data['close'].iloc[-2] >= trend_data['sma_50'].iloc[-2]
            )
            
            # Signal metrics for the alert
            signal_metrics = {
                'price': current_price,
                'rsi': signal_data['rsi'].iloc[-1],
                'macd': signal_data['macd'].iloc[-1],
                'macd_signal': signal_data['macd_signal'].iloc[-1],
                'bearish_macd': bearish_macd,
                'rsi_overbought': rsi_overbought,
                'price_below_vwap': price_below_vwap,
                'trend_reversal': trend_reversal
            }
            
            # Final sell decision
            if bearish_macd or rsi_overbought or price_below_vwap or trend_reversal:
                # Check if this is a new signal
                if self.signal_history[symbol]['last_sell_signal'] is None or \
                   datetime.now() - self.signal_history[symbol]['last_sell_signal'] > timedelta(hours=1):
                    self.signal_history[symbol]['last_sell_signal'] = datetime.now()
                    logger.info(f"SELL signal for {symbol} detected")
                    return True, signal_metrics
                    
                return False, {}  # Already notified recently
                
            return False, {}
            
        except Exception as e:
            logger.error(f"Error in check_sell_signal for {symbol}: {e}")
            return False, {}
    
    def get_current_price(self, symbol):
        """Get current market price."""
        try:
            ticker = self.exchange.fetch_ticker(symbol)
            current_price = ticker['last']
            return current_price
        except Exception as e:
            logger.error(f"Error fetching current price for {symbol}: {e}")
            return None
    
    def send_notification(self, symbol, signal_type, metrics):
        """Send notification based on the configured method."""
        current_time = datetime.now()
        price = metrics['price']
        
        # Check if we've recently sent a notification for this symbol/signal type
        key = f"{symbol}_{signal_type}"
        if key in self.last_notification_time:
            time_since_last = (current_time - self.last_notification_time[key]).total_seconds()
            if time_since_last < self.notification_cooldown:
                logger.info(f"Skipping {signal_type} notification for {symbol} (cooldown: {time_since_last:.0f}s < {self.notification_cooldown}s)")
                return False
        
        # Format the notification message
        if signal_type == 'BUY':
            title = f"🚀 BUY SIGNAL: {symbol} @ ${price:.2f}"
            message = (
                f"Strong buy signal detected for {symbol}\n\n"
                f"Current price: ${price:.2f}\n"
                f"RSI: {metrics['rsi']:.2f}\n"
                f"ADX (Trend Strength): {metrics['adx']:.2f}\n"
                f"MACD: {metrics['macd']:.6f}\n"
                f"MACD Signal: {metrics['macd_signal']:.6f}\n\n"
                f"Technical factors:\n"
                f"• {'✅' if metrics['in_uptrend'] else '❌'} In uptrend\n"
                f"• {'✅' if metrics['bullish_macd'] else '❌'} Bullish MACD crossover\n"
                f"• {'✅' if metrics['bullish_rsi'] else '❌'} Bullish RSI\n"
                f"• {'✅' if metrics['price_above_vwap'] else '❌'} Price above VWAP\n"
                f"• {'✅' if metrics['volume_increasing'] else '❌'} Increasing volume\n\n"
                f"Generated at {current_time.strftime('%Y-%m-%d %H:%M:%S')}"
            )
        else:  # SELL signal
            title = f"🔴 SELL SIGNAL: {symbol} @ ${price:.2f}"
            message = (
                f"Sell signal detected for {symbol}\n\n"
                f"Current price: ${price:.2f}\n"
                f"RSI: {metrics['rsi']:.2f}\n"
                f"MACD: {metrics['macd']:.6f}\n"
                f"MACD Signal: {metrics['macd_signal']:.6f}\n\n"
                f"Technical factors:\n"
                f"• {'🔴' if metrics['bearish_macd'] else '⚪'} Bearish MACD crossover\n"
                f"• {'🔴' if metrics['rsi_overbought'] else '⚪'} RSI overbought (>70)\n"
                f"• {'🔴' if metrics['price_below_vwap'] else '⚪'} Price below VWAP\n"
                f"• {'🔴' if metrics.get('trend_reversal', False) else '⚪'} Trend reversal\n\n"
                f"Generated at {current_time.strftime('%Y-%m-%d %H:%M:%S')}"
            )
        
        # Save the signal to a log file
        signal_id = f"{symbol.replace('/', '_')}_{signal_type}_{current_time.strftime('%Y%m%d_%H%M%S')}"
        signal_file = f"signals/{signal_id}.json"
        
        signal_data = {
            "symbol": symbol,
            "signal_type": signal_type,
            "timestamp": current_time.isoformat(),
            "price": float(price),
            "metrics": {k: float(v) if isinstance(v, (float, np.float64)) else v for k, v in metrics.items()}
        }
        
        with open(signal_file, 'w') as f:
            json.dump(signal_data, f, indent=4)
        
        logger.info(f"Saved {signal_type} signal to {signal_file}")
        
        # Send notification based on method
        if self.notification_method == 'browser':
            self.notify_browser(title, message)
        elif self.notification_method == 'console':
            self.notify_console(title, message)
        
        # Update last notification time
        self.last_notification_time[key] = current_time
        return True
    
    def notify_browser(self, title, message):
        """Show notification in browser."""
        try:
            # Create a simple HTML file with the notification
            html_content = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>{title}</title>
                <style>
                    body {{
                        font-family: 'Inter', sans-serif;
                        background: linear-gradient(135deg, #0f1419 0%, #1a2332 100%);
                        color: #ffffff;
                        margin: 0;
                        padding: 20px;
                        min-height: 100vh;
                    }}
                    .notification {{
                        max-width: 600px;
                        margin: 20px auto;
                        padding: 20px;
                        background: rgba(255, 255, 255, 0.1);
                        border-radius: 16px;
                        border: 2px solid {'#ffd700' if 'BUY' in title else '#ff4444'};
                    }}
                    h1 {{
                        font-size: 24px;
                        margin-bottom: 20px;
                        text-align: center;
                        color: {'#ffd700' if 'BUY' in title else '#ff4444'};
                    }}
                    pre {{
                        white-space: pre-wrap;
                        font-size: 14px;
                        line-height: 1.5;
                        background: rgba(0, 0, 0, 0.2);
                        padding: 15px;
                        border-radius: 8px;
                    }}
                    .close-btn {{
                        display: block;
                        width: 100%;
                        background: {'#ffd700' if 'BUY' in title else '#ff4444'};
                        color: #0f1419;
                        border: none;
                        padding: 10px;
                        margin-top: 20px;
                        font-size: 16px;
                        font-weight: bold;
                        cursor: pointer;
                        border-radius: 8px;
                    }}
                    .auto-close {{
                        text-align: center;
                        font-size: 12px;
                        margin-top: 10px;
                        color: #aaaaaa;
                    }}
                </style>
            </head>
            <body>
                <div class="notification">
                    <h1>{title}</h1>
                    <pre>{message}</pre>
                    <button class="close-btn" onclick="window.close()">Close</button>
                    <p class="auto-close">This window will automatically close after 5 minutes</p>
                </div>
                <script>
                    // Auto close after 5 minutes
                    setTimeout(() => {{
                        window.close();
                    }}, 300000);
                </script>
            </body>
            </html>
            """
            
            # Save the HTML file
            notification_file = f"bitcoin_alarm_{datetime.now().strftime('%Y%m%d_%H%M%S')}.html"
            with open(notification_file, 'w') as f:
                f.write(html_content)
            
            # Open in browser
            webbrowser.open(notification_file)
            logger.info(f"Browser notification sent: {title}")
            
        except Exception as e:
            logger.error(f"Error sending browser notification: {e}")
    
    def notify_console(self, title, message):
        """Display notification in console."""
        border = "=" * 80
        logger.info(f"\n{border}\n{title}\n{border}\n{message}\n{border}")
    
    def run(self):
        """Main alarm loop."""
        logger.info(f"Starting Bitcoin Alarm for {self.symbols} on {self.exchange_id}...")
        
        try:
            while True:
                current_time = datetime.now()
                logger.info(f"Checking for signals at {current_time}")
                
                for symbol in self.symbols:
                    # Check for buy signals
                    buy_signal, buy_metrics = self.check_buy_signal(symbol)
                    if buy_signal:
                        logger.info(f"BUY SIGNAL for {symbol}: {buy_metrics}")
                        self.send_notification(symbol, "BUY", buy_metrics)
                    
                    # Check for sell signals
                    sell_signal, sell_metrics = self.check_sell_signal(symbol)
                    if sell_signal:
                        logger.info(f"SELL SIGNAL for {symbol}: {sell_metrics}")
                        self.send_notification(symbol, "SELL", sell_metrics)
                    
                    # If neither signal triggered, log current price
                    if not (buy_signal or sell_signal):
                        current_price = self.get_current_price(symbol)
                        logger.info(f"No signal for {symbol}. Current price: ${current_price}")
                
                # Sleep until next check
                logger.info(f"Next check in {self.check_interval} seconds...")
                time.sleep(self.check_interval)
                
        except KeyboardInterrupt:
            logger.info("Alarm system stopped manually.")
        except Exception as e:
            logger.error(f"Unexpected error: {e}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Bitcoin Trading Alarm')
    parser.add_argument('--config', type=str, default='config.yaml', help='Path to config file')
    parser.add_argument('--notification', type=str, default='browser', choices=['browser', 'console'], 
                        help='Notification method (browser or console)')
    parser.add_argument('--interval', type=int, help='Check interval in seconds')
    args = parser.parse_args()
    
    alarm = BitcoinAlarm(config_file=args.config, notification_method=args.notification)
    
    # Override check interval if provided
    if args.interval:
        alarm.check_interval = args.interval
        
    alarm.run()