import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // CoinGecko API - free and no API key required
    const response = await fetch(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd,inr&include_24hr_change=true&include_24hr_vol=true&include_market_cap=true',
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch Bitcoin data');
    }

    const data = await response.json();

    // CoinGecko returns data in format: { bitcoin: { usd: price, usd_24h_change: change, ... } }
    const bitcoinData = data.bitcoin || {};

    const bitcoin = {
      symbol: 'BTC',
      name: 'Bitcoin',
      priceUSD: bitcoinData.usd || 0,
      priceINR: bitcoinData.inr || 0,
      change24h: bitcoinData.usd_24h_change || 0,
      volume24h: bitcoinData.usd_24h_vol || 0,
      marketCap: bitcoinData.usd_market_cap || 0,
    };

    return NextResponse.json({ bitcoin });
  } catch (error) {
    console.error('Error fetching Bitcoin data:', error);
    
    // Return mock data as fallback
    return NextResponse.json({
      bitcoin: {
        symbol: 'BTC',
        name: 'Bitcoin',
        priceUSD: 43250.50,
        priceINR: 3598000.00,
        change24h: 2.45,
        volume24h: 28500000000,
        marketCap: 850000000000,
      },
    });
  }
}

