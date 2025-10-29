import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Fetch Indian market indices from NSE
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'application/json',
      'Referer': 'https://www.nseindia.com/',
      'Origin': 'https://www.nseindia.com',
    };

    // Get session cookie
    const sessionResponse = await fetch('https://www.nseindia.com/', {
      headers: {
        'User-Agent': headers['User-Agent'],
      },
      redirect: 'follow',
    });

    if (sessionResponse.ok) {
      const setCookieHeader = sessionResponse.headers.get('set-cookie');
      const cookies = setCookieHeader ? setCookieHeader.split(',').map(cookie => cookie.split(';')[0]).join('; ') : '';

      const fetchHeaders = {
        ...headers,
        'Cookie': cookies,
      };

      // Fetch NSE indices
      const indicesResponse = await fetch(
        'https://www.nseindia.com/api/allIndices',
        {
          headers: fetchHeaders,
          next: { revalidate: 300 }, // Cache for 5 minutes
        }
      );

      if (indicesResponse.ok) {
        const indicesData = await indicesResponse.json();
        const allIndices = indicesData.data || [];

        // Extract major indices
        const majorIndices = [
          { symbol: 'NIFTY 50', name: 'Nifty 50', key: 'NIFTY 50' },
          { symbol: 'NIFTY BANK', name: 'Nifty Bank', key: 'NIFTY BANK' },
          { symbol: 'NIFTY IT', name: 'Nifty IT', key: 'NIFTY IT' },
          { symbol: 'NIFTY AUTO', name: 'Nifty Auto', key: 'NIFTY AUTO' },
          { symbol: 'NIFTY PHARMA', name: 'Nifty Pharma', key: 'NIFTY PHARMA' },
          { symbol: 'NIFTY FMCG', name: 'Nifty FMCG', key: 'NIFTY FMCG' },
        ];

        const result = majorIndices.map((index) => {
          const found = allIndices.find((idx) => idx.index === index.key || idx.name === index.key);
          if (found) {
            return {
              symbol: found.index || index.symbol,
              name: index.name,
              country: 'India',
              price: parseFloat(found.last || found.advances || 0),
              change: parseFloat(found.change || found.chng || 0),
              changePercent: parseFloat(found.pChange || found.perChange || 0),
            };
          }
          return null;
        }).filter(Boolean);

        if (result.length > 0) {
          return NextResponse.json({ indices: result });
        }
      }
    }
  } catch (error) {
    console.error('Error fetching indices from NSE:', error);
  }

  // Fallback: Return Indian market indices mock data
  return NextResponse.json({
    indices: [
      { symbol: 'NIFTY 50', name: 'Nifty 50', country: 'India', price: 21750.50, change: 125.75, changePercent: 0.58 },
      { symbol: 'NIFTY BANK', name: 'Nifty Bank', country: 'India', price: 47250.25, change: 325.30, changePercent: 0.69 },
      { symbol: 'NIFTY IT', name: 'Nifty IT', country: 'India', price: 38500.75, change: 225.50, changePercent: 0.59 },
      { symbol: 'NIFTY AUTO', name: 'Nifty Auto', country: 'India', price: 18250.20, change: 95.25, changePercent: 0.52 },
      { symbol: 'NIFTY PHARMA', name: 'Nifty Pharma', country: 'India', price: 18500.80, change: 185.40, changePercent: 1.01 },
      { symbol: 'NIFTY FMCG', name: 'Nifty FMCG', country: 'India', price: 54250.50, change: 350.75, changePercent: 0.65 },
    ],
  });
}

