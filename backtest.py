#!/usr/bin/env python3
"""
Backtesting Module for Optimized Trading Bot

Allows you to test trading strategies against historical data.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import ccxt
import ta
import os
import json
import argparse
from datetime import datetime, timedelta
import logging
from pathlib import Path
import yaml

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger('backtest')

class BacktestEngine:
    def __init__(self, config_file='config.yaml'):
        """Initialize the backtesting engine."""
        self.config = self.load_config(config_file)
        self.exchange_id = self.config['exchange']['name']
        self.symbols = self.config['trading']['symbols'] if isinstance(self.config['trading']['symbols'], list) else [self.config['trading']['symbols']]
        self.timeframes = self.config['timeframes']
        
        # Strategy parameters
        self.profit_target = self.config['strategy']['profit_target']
        self.stop_loss = self.config['strategy']['stop_loss']
        self.trailing_stop = self.config['strategy']['trailing_stop']
        
        # Risk parameters
        self.position_size_pct = self.config['trading']['position_size_pct']
        self.max_open_trades = self.config['risk_management']['max_open_trades']
        
        # Initialize exchange for historical data
        self.initialize_exchange()
        
    def load_config(self, config_file):
        """Load configuration from YAML file."""
        try:
            with open(config_file, 'r') as file:
                config = yaml.safe_load(file)
            logger.info(f"Loaded configuration from {config_file}")
            return config
        except Exception as e:
            logger.error(f"Error loading config file: {e}")
            raise
        
    def initialize_exchange(self):
        """Initialize exchange for historical data."""
        try:
            exchange_class = getattr(ccxt, self.exchange_id)
            self.exchange = exchange_class({
                'enableRateLimit': True
            })
            logger.info(f"Initialized {self.exchange_id} for historical data")
        except Exception as e:
            logger.error(f"Error initializing exchange: {e}")
            raise
    
    def fetch_historical_data(self, symbol, timeframe='1h', start_date=None, end_date=None):
        """Fetch historical OHLCV data for backtesting."""
        try:
            if start_date is None:
                # Default to 3 months ago
                start_date = datetime.now() - timedelta(days=90)
            if end_date is None:
                end_date = datetime.now()
                
            # Convert dates to timestamps
            since = int(start_date.timestamp() * 1000)
            until = int(end_date.timestamp() * 1000)
            
            # Fetch data in chunks
            all_candles = []
            current = since
            
            while current < until:
                logger.info(f"Fetching {symbol} data for {timeframe} from {datetime.fromtimestamp(current/1000)}")
                candles = self.exchange.fetch_ohlcv(symbol, timeframe, since=current, limit=1000)
                
                if not candles:
                    break
                    
                all_candles.extend(candles)
                
                # Update current timestamp
                current = candles[-1][0] + 1
                
                # Rate limiting
                self.exchange.sleep(self.exchange.rateLimit / 1000)
                
            # Convert to DataFrame
            df = pd.DataFrame(all_candles, columns=['timestamp', 'open', 'high', 'low', 'close', 'volume'])
            df['timestamp'] = pd.to_datetime(df['timestamp'], unit='ms')
            df.set_index('timestamp', inplace=True)
            
            logger.info(f"Fetched {len(df)} candles for {symbol} ({timeframe})")
            return df
            
        except Exception as e:
            logger.error(f"Error fetching historical data: {e}")
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
    
    def generate_signals(self, trend_data, signal_data, entry_data):
        """Generate buy and sell signals based on multi-timeframe analysis."""
        try:
            # Initialize signal columns
            entry_data['buy_signal'] = False
            entry_data['sell_signal'] = False
            
            # Process each row for signals
            for i in range(1, len(entry_data)):
                # Skip if we don't have enough data
                if i < 20:
                    continue
                    
                # Get current index
                current_idx = entry_data.index[i]
                
                # Find closest trend and signal data points
                trend_idx = trend_data.index[trend_data.index <= current_idx][-1]
                signal_idx = signal_data.index[signal_data.index <= current_idx][-1]
                
                # Get trend data
                trend_in_uptrend = (
                    trend_data.loc[trend_idx, 'close'] > trend_data.loc[trend_idx, 'sma_50'] and 
                    trend_data.loc[trend_idx, 'adx'] > 25
                )
                
                # Get signal data
                signal_bullish_macd = (
                    signal_data.loc[signal_idx, 'macd_diff'] > 0 and 
                    i > 1 and signal_data.loc[signal_data.index[signal_data.index < signal_idx][-1], 'macd_diff'] <= 0
                )
                
                signal_bullish_rsi = (
                    signal_data.loc[signal_idx, 'rsi'] > 40 and 
                    signal_data.loc[signal_idx, 'rsi'] < 70 and
                    i > 1 and signal_data.loc[signal_data.index[signal_data.index < signal_idx][-1], 'rsi'] < 
                    signal_data.loc[signal_idx, 'rsi']
                )
                
                # Entry conditions
                price_above_vwap = entry_data.loc[current_idx, 'close'] > entry_data.loc[current_idx, 'vwap']
                volume_increasing = entry_data.loc[current_idx, 'volume'] > entry_data.loc[current_idx, 'volume_ma']
                
                # Buy signal
                entry_data.loc[current_idx, 'buy_signal'] = (
                    trend_in_uptrend and 
                    (signal_bullish_macd or signal_bullish_rsi) and 
                    price_above_vwap and 
                    volume_increasing
                )
                
                # Sell conditions
                bearish_macd = (
                    signal_data.loc[signal_idx, 'macd_diff'] < 0 and 
                    i > 1 and signal_data.loc[signal_data.index[signal_data.index < signal_idx][-1], 'macd_diff'] >= 0
                )
                
                rsi_overbought = signal_data.loc[signal_idx, 'rsi'] > 70
                price_below_vwap = entry_data.loc[current_idx, 'close'] < entry_data.loc[current_idx, 'vwap']
                
                # Sell signal
                entry_data.loc[current_idx, 'sell_signal'] = bearish_macd or rsi_overbought or price_below_vwap
                
            return entry_data
            
        except Exception as e:
            logger.error(f"Error generating signals: {e}")
            return None
    
    def run_backtest(self, symbol, start_date=None, end_date=None):
        """Run backtest for a symbol."""
        logger.info(f"Starting backtest for {symbol}")
        
        # Fetch data for each timeframe
        trend_data = self.fetch_historical_data(symbol, self.timeframes['trend'], start_date, end_date)
        signal_data = self.fetch_historical_data(symbol, self.timeframes['signal'], start_date, end_date)
        entry_data = self.fetch_historical_data(symbol, self.timeframes['entry'], start_date, end_date)
        
        if trend_data is None or signal_data is None or entry_data is None:
            logger.error("Failed to fetch data for backtest")
            return None
        
        # Add indicators
        trend_data = self.add_technical_indicators(trend_data)
        signal_data = self.add_technical_indicators(signal_data)
        entry_data = self.add_technical_indicators(entry_data)
        
        # Generate signals
        entry_data = self.generate_signals(trend_data, signal_data, entry_data)
        
        # Run simulation
        results = self.simulate_trades(entry_data, symbol)
        
        return results
    
    def simulate_trades(self, df, symbol):
        """Simulate trades based on signals."""
        initial_balance = 10000  # Starting with $10,000 USDT
        balance = initial_balance
        position = None
        trades = []
        equity_curve = []
        
        for i in range(len(df)):
            current_idx = df.index[i]
            current_price = df.loc[current_idx, 'close']
            
            # Record equity at this point
            equity = balance if position is None else balance + position['quantity'] * current_price
            equity_curve.append({'timestamp': current_idx, 'equity': equity})
            
            # Check for sell signals if in position
            if position is not None:
                # Update highest price seen
                if current_price > position['highest_price']:
                    position['highest_price'] = current_price
                
                # Calculate price change and drawdown
                price_change_pct = ((current_price - position['buy_price']) / position['buy_price']) * 100
                drawdown_pct = ((position['highest_price'] - current_price) / position['highest_price']) * 100
                
                # Check for sell conditions
                sell_triggered = False
                sell_reason = ''
                
                # Take profit
                if price_change_pct >= self.profit_target:
                    sell_triggered = True
                    sell_reason = 'Take Profit'
                
                # Stop loss
                elif price_change_pct <= -self.stop_loss:
                    sell_triggered = True
                    sell_reason = 'Stop Loss'
                
                # Trailing stop
                elif position['highest_price'] > position['buy_price'] and drawdown_pct >= self.trailing_stop:
                    sell_triggered = True
                    sell_reason = 'Trailing Stop'
                
                # Technical sell signal
                elif df.loc[current_idx, 'sell_signal'] and price_change_pct > 0:
                    sell_triggered = True
                    sell_reason = 'Technical Signal'
                
                # Execute sell if triggered
                if sell_triggered:
                    # Calculate trade results
                    position_value = position['quantity'] * current_price
                    profit_loss = position_value - position['cost']
                    
                    # Update balance
                    balance = balance + position_value
                    
                    # Record trade
                    trade = {
                        'symbol': symbol,
                        'type': 'sell',
                        'price': current_price,
                        'quantity': position['quantity'],
                        'value': position_value,
                        'timestamp': current_idx,
                        'profit_loss': profit_loss,
                        'profit_loss_pct': price_change_pct,
                        'reason': sell_reason,
                        'balance': balance
                    }
                    trades.append(trade)
                    
                    # Clear position
                    position = None
                    
                    logger.info(f"SELL: {current_idx} | Price: {current_price} | P/L: {price_change_pct:.2f}% | Reason: {sell_reason}")
            
            # Check for buy signals if not in position
            elif df.loc[current_idx, 'buy_signal']:
                # Calculate position size (% of current balance)
                position_value = balance * (self.position_size_pct / 100)
                quantity = position_value / current_price
                
                # Record trade
                trade = {
                    'symbol': symbol,
                    'type': 'buy',
                    'price': current_price,
                    'quantity': quantity,
                    'value': position_value,
                    'timestamp': current_idx,
                    'balance': balance - position_value
                }
                trades.append(trade)
                
                # Update balance and open position
                balance = balance - position_value
                position = {
                    'buy_price': current_price,
                    'quantity': quantity,
                    'cost': position_value,
                    'buy_time': current_idx,
                    'highest_price': current_price
                }
                
                logger.info(f"BUY: {current_idx} | Price: {current_price} | Quantity: {quantity}")
        
        # Close any open position at the end
        if position is not None:
            current_price = df['close'].iloc[-1]
            position_value = position['quantity'] * current_price
            profit_loss = position_value - position['cost']
            price_change_pct = ((current_price - position['buy_price']) / position['buy_price']) * 100
            
            # Update balance
            balance = balance + position_value
            
            # Record trade
            trade = {
                'symbol': symbol,
                'type': 'sell',
                'price': current_price,
                'quantity': position['quantity'],
                'value': position_value,
                'timestamp': df.index[-1],
                'profit_loss': profit_loss,
                'profit_loss_pct': price_change_pct,
                'reason': 'End of Backtest',
                'balance': balance
            }
            trades.append(trade)
            
            logger.info(f"Final position closed: P/L: {price_change_pct:.2f}%")
        
        # Calculate performance metrics
        metrics = self.calculate_performance(trades, initial_balance, balance, df, equity_curve)
        
        return {
            'trades': trades,
            'metrics': metrics,
            'equity_curve': equity_curve
        }
    
    def calculate_performance(self, trades, initial_balance, final_balance, price_data, equity_curve):
        """Calculate performance metrics."""
        if not trades:
            return {
                'total_trades': 0,
                'win_rate': 0,
                'total_return': 0,
                'total_return_pct': 0,
                'max_drawdown': 0,
                'profit_factor': 0,
                'avg_profit_per_trade': 0
            }
        
        # Extract sell trades (completed trades with profit/loss)
        sell_trades = [t for t in trades if t['type'] == 'sell']
        
        # Win rate
        winning_trades = [t for t in sell_trades if t['profit_loss'] > 0]
        win_rate = len(winning_trades) / len(sell_trades) * 100 if sell_trades else 0
        
        # Return metrics
        total_return = final_balance - initial_balance
        total_return_pct = (total_return / initial_balance) * 100
        
        # Profit factor
        gross_profit = sum([t['profit_loss'] for t in sell_trades if t['profit_loss'] > 0])
        gross_loss = sum([abs(t['profit_loss']) for t in sell_trades if t['profit_loss'] < 0])
        profit_factor = gross_profit / gross_loss if gross_loss > 0 else float('inf')
        
        # Average metrics
        avg_profit_per_trade = total_return / len(sell_trades) if sell_trades else 0
        avg_win = sum([t['profit_loss'] for t in winning_trades]) / len(winning_trades) if winning_trades else 0
        avg_loss = sum([t['profit_loss'] for t in sell_trades if t['profit_loss'] <= 0]) / (len(sell_trades) - len(winning_trades)) if len(sell_trades) > len(winning_trades) else 0
        
        # Calculate max drawdown
        equity_series = pd.DataFrame(equity_curve).set_index('timestamp')
        equity_series['equity'] = equity_series['equity'].astype(float)
        
        # Calculate drawdown series
        equity_series['peak'] = equity_series['equity'].cummax()
        equity_series['drawdown'] = (equity_series['equity'] - equity_series['peak']) / equity_series['peak'] * 100
        max_drawdown = abs(min(equity_series['drawdown']))
        
        # Sharpe ratio (assuming risk-free rate of 0)
        daily_returns = equity_series['equity'].pct_change().dropna()
        sharpe_ratio = daily_returns.mean() / daily_returns.std() * np.sqrt(252) if len(daily_returns) > 0 else 0
        
        return {
            'total_trades': len(sell_trades),
            'win_rate': win_rate,
            'total_return': total_return,
            'total_return_pct': total_return_pct,
            'profit_factor': profit_factor,
            'avg_profit_per_trade': avg_profit_per_trade,
            'avg_win': avg_win,
            'avg_loss': avg_loss,
            'max_drawdown': max_drawdown,
            'sharpe_ratio': sharpe_ratio
        }
    
    def plot_results(self, results, symbol):
        """Plot backtest results."""
        if not results:
            logger.error("No results to plot")
            return
        
        # Create a figure with subplots
        fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 10), gridspec_kw={'height_ratios': [3, 1]})
        
        # Plot equity curve
        equity_df = pd.DataFrame(results['equity_curve']).set_index('timestamp')
        equity_df['equity'].plot(ax=ax1, label='Equity Curve')
        
        # Plot buy and sell points
        trades = results['trades']
        buy_trades = [t for t in trades if t['type'] == 'buy']
        sell_trades = [t for t in trades if t['type'] == 'sell']
        
        buy_times = [t['timestamp'] for t in buy_trades]
        buy_prices = [t['value'] / t['quantity'] for t in buy_trades]  # Convert back to price
        
        sell_times = [t['timestamp'] for t in sell_trades]
        sell_prices = [t['price'] for t in sell_trades]
        
        # Plot buy and sell points on equity curve
        buy_equity = [equity_df.loc[t]['equity'] for t in buy_times if t in equity_df.index]
        sell_equity = [equity_df.loc[t]['equity'] for t in sell_times if t in equity_df.index]
        
        ax1.scatter(buy_times, buy_equity, color='green', marker='^', s=100, label='Buy')
        ax1.scatter(sell_times, sell_equity, color='red', marker='v', s=100, label='Sell')
        
        # Add legend and title
        ax1.set_title(f'Backtest Results for {symbol}')
        ax1.set_ylabel('Equity ($)')
        ax1.legend()
        ax1.grid(True)
        
        # Plot drawdown
        equity_df['peak'] = equity_df['equity'].cummax()
        equity_df['drawdown'] = (equity_df['equity'] - equity_df['peak']) / equity_df['peak'] * 100
        equity_df['drawdown'].plot(ax=ax2, color='red', label='Drawdown')
        
        ax2.set_title('Drawdown')
        ax2.set_ylabel('Drawdown (%)')
        ax2.set_xlabel('Date')
        ax2.grid(True)
        ax2.fill_between(equity_df.index, equity_df['drawdown'], 0, color='red', alpha=0.3)
        
        plt.tight_layout()
        
        # Save the plot
        plt.savefig(f'backtest_{symbol.replace("/", "_")}.png')
        logger.info(f"Saved backtest plot to backtest_{symbol.replace('/', '_')}.png")
        
        # Display performance metrics
        metrics = results['metrics']
        print("\n=== BACKTEST RESULTS ===")
        print(f"Symbol: {symbol}")
        print(f"Total Trades: {metrics['total_trades']}")
        print(f"Win Rate: {metrics['win_rate']:.2f}%")
        print(f"Total Return: ${metrics['total_return']:.2f} ({metrics['total_return_pct']:.2f}%)")
        print(f"Max Drawdown: {metrics['max_drawdown']:.2f}%")
        print(f"Profit Factor: {metrics['profit_factor']:.2f}")
        print(f"Sharpe Ratio: {metrics['sharpe_ratio']:.2f}")
        print(f"Avg Profit/Trade: ${metrics['avg_profit_per_trade']:.2f}")
        print(f"Avg Win: ${metrics['avg_win']:.2f}")
        print(f"Avg Loss: ${metrics['avg_loss']:.2f}")
        print("======================\n")
        
        return fig

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Backtest trading strategy')
    parser.add_argument('--config', type=str, default='config.yaml', help='Path to config file')
    parser.add_argument('--symbol', type=str, default='BTC/USDT', help='Symbol to backtest')
    parser.add_argument('--days', type=int, default=90, help='Number of days to backtest')
    args = parser.parse_args()
    
    # Initialize backtesting engine
    engine = BacktestEngine(config_file=args.config)
    
    # Set date range
    end_date = datetime.now()
    start_date = end_date - timedelta(days=args.days)
    
    # Run backtest
    results = engine.run_backtest(args.symbol, start_date, end_date)
    
    # Plot results
    if results:
        engine.plot_results(results, args.symbol)










