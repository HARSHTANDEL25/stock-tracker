import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // CoinGecko API for top gainers and losers (24h change)
    // Fetch top 250 coins by market cap to get meaningful gainers/losers
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&sparkline=false&price_change_percentage=24h',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch crypto data');
    }

    const data = await response.json();

    // Filter out coins with null or undefined price_change_percentage_24h
    const validCoins = data.filter(coin => 
      coin.price_change_percentage_24h != null && 
      coin.price_change_percentage_24h !== undefined &&
      coin.current_price > 0
    );

    // Sort by 24h change percentage (descending for gainers)
    const sortedByGain = [...validCoins].sort((a, b) => 
      (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
    );

    // Get top 5 gainers (highest positive changes)
    const topGainers = sortedByGain
      .filter(coin => coin.price_change_percentage_24h > 0)
      .slice(0, 5)
      .map((coin) => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price || 0,
        change: coin.price_change_24h || 0,
        changePercent: coin.price_change_percentage_24h || 0,
        image: coin.image,
      }));

    // Sort by 24h change percentage (ascending for losers)
    const sortedByLoss = [...validCoins].sort((a, b) => 
      (a.price_change_percentage_24h || 0) - (b.price_change_percentage_24h || 0)
    );

    // Get top 5 losers (most negative changes)
    const topLosers = sortedByLoss
      .filter(coin => coin.price_change_percentage_24h < 0)
      .slice(0, 5)
      .map((coin) => ({
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        price: coin.current_price || 0,
        change: coin.price_change_24h || 0,
        changePercent: coin.price_change_percentage_24h || 0,
        image: coin.image,
      }));

    return NextResponse.json({ gainers: topGainers, losers: topLosers });
  } catch (error) {
    console.error('Error fetching crypto data:', error);
    
    // Return mock data as fallback
    return NextResponse.json({
      gainers: [
        { symbol: 'BTC', name: 'Bitcoin', price: 43250.50, change: 1050.25, changePercent: 2.48, image: null },
        { symbol: 'ETH', name: 'Ethereum', price: 2650.75, change: 85.50, changePercent: 3.33, image: null },
        { symbol: 'BNB', name: 'Binance Coin', price: 315.20, change: 8.45, changePercent: 2.75, image: null },
        { symbol: 'SOL', name: 'Solana', price: 98.45, change: 4.20, changePercent: 4.46, image: null },
        { symbol: 'ADA', name: 'Cardano', price: 0.52, change: 0.02, changePercent: 4.00, image: null },
      ],
      losers: [
        { symbol: 'DOGE', name: 'Dogecoin', price: 0.083, change: -0.004, changePercent: -4.60, image: null },
        { symbol: 'TRX', name: 'TRON', price: 0.105, change: -0.005, changePercent: -4.54, image: null },
        { symbol: 'DOT', name: 'Polkadot', price: 7.15, change: -0.35, changePercent: -4.66, image: null },
        { symbol: 'MATIC', name: 'Polygon', price: 0.82, change: -0.04, changePercent: -4.65, image: null },
        { symbol: 'LINK', name: 'Chainlink', price: 14.25, change: -0.75, changePercent: -5.00, image: null },
      ],
    });
  }
}

