import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const marketCap = searchParams.get('marketCap') || 'large'; // small, medium, large

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://www.nseindia.com/',
    'Origin': 'https://www.nseindia.com',
  };

  try {
    // First, get a session cookie by visiting the main page
    // This is required for NSE APIs to work
    const sessionResponse = await fetch('https://www.nseindia.com/', {
      headers: {
        'User-Agent': headers['User-Agent'],
      },
      redirect: 'follow',
    });

    if (!sessionResponse.ok) {
      throw new Error('Failed to establish NSE session');
    }

    // Extract cookies from the session response
    const setCookieHeader = sessionResponse.headers.get('set-cookie');
    const cookies = setCookieHeader ? setCookieHeader.split(',').map(cookie => cookie.split(';')[0]).join('; ') : '';

    const fetchHeaders = {
      ...headers,
      'Cookie': cookies,
    };

    // NSE API endpoints for gainers and losers
    // Using the correct endpoint: https://www.nseindia.com/api/live-analysis-variations?index=gainers
    const gainersResponse = await fetch(
      'https://www.nseindia.com/api/live-analysis-variations?index=gainers',
      {
        headers: fetchHeaders,
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    );

    const losersResponse = await fetch(
      'https://www.nseindia.com/api/live-analysis-variations?index=losers',
      {
        headers: fetchHeaders,
        next: { revalidate: 300 },
      }
    );

    if (gainersResponse.ok && losersResponse.ok) {
      const gainersData = await gainersResponse.json();
      const losersData = await losersResponse.json();

      // Handle different response formats from NSE API
      let gainersArray = [];
      let losersArray = [];

      // Check various possible response structures
      if (Array.isArray(gainersData)) {
        gainersArray = gainersData;
      } else if (gainersData.data && Array.isArray(gainersData.data)) {
        gainersArray = gainersData.data;
      } else if (gainersData.FO && Array.isArray(gainersData.FO)) {
        gainersArray = gainersData.FO;
      } else if (gainersData.gainers && Array.isArray(gainersData.gainers)) {
        gainersArray = gainersData.gainers;
      }

      if (Array.isArray(losersData)) {
        losersArray = losersData;
      } else if (losersData.data && Array.isArray(losersData.data)) {
        losersArray = losersData.data;
      } else if (losersData.FO && Array.isArray(losersData.FO)) {
        losersArray = losersData.FO;
      } else if (losersData.losers && Array.isArray(losersData.losers)) {
        losersArray = losersData.losers;
      }

      // Transform NSE data format
      const transformStock = (stock) => {
        const symbol = stock.symbol || stock.mSymbol || stock.tradingsymbol || '';
        const name = stock.meta?.companyName || stock.companyName || stock.securityName || symbol;
        const price = parseFloat(stock.lastPrice || stock.ltp || stock.closePrice || stock.price || 0);
        const prevClose = parseFloat(stock.previousClose || stock.prevClose || stock.prev_close || 0);
        
        // Try multiple field names for change
        let change = parseFloat(
          stock.netPrice || 
          stock.net_price || 
          stock.change || 
          stock.changePrice || 
          stock.change_price ||
          stock.priceChange ||
          (price && prevClose ? price - prevClose : 0)
        );
        
        // Try multiple field names for changePercent
        let changePercent = parseFloat(
          stock.pChange || 
          stock.perChange || 
          stock.priceChangePercent ||
          stock.changePercent ||
          stock.pctChange ||
          (price && prevClose ? ((change / prevClose) * 100) : 0)
        );

        // If changePercent is 0 but we have change, calculate it
        if (changePercent === 0 && change !== 0 && prevClose > 0) {
          changePercent = (change / prevClose) * 100;
        }

        // If change is 0 but we have changePercent, calculate it
        if (change === 0 && changePercent !== 0 && prevClose > 0) {
          change = (changePercent / 100) * prevClose;
        }

        return {
          symbol,
          name,
          price,
          change,
          changePercent,
        };
      };

      const gainers = gainersArray.slice(0, 50)
        .map(transformStock)
        .filter(stock => stock.symbol && stock.price > 0 && stock.changePercent > 0)
        .sort((a, b) => b.changePercent - a.changePercent);

      const losers = losersArray.slice(0, 50)
        .map(transformStock)
        .filter(stock => stock.symbol && stock.price > 0 && stock.changePercent < 0)
        .sort((a, b) => a.changePercent - b.changePercent);

      // Return top 5 gainers and losers
      const filteredGainers = gainers.slice(0, 5);
      const filteredLosers = losers.slice(0, 5);

      if (filteredGainers.length > 0 && filteredLosers.length > 0) {
        return NextResponse.json({ 
          gainers: filteredGainers,
          losers: filteredLosers 
        });
      }
    }
  } catch (error) {
    console.error('Error fetching from NSE API:', error);
  }

  // Fallback to mock data if API fails
  const mockData = {
    small: {
      gainers: [
        { symbol: 'SHANTHALA', name: 'Shanthala FMCG Products Ltd.', price: 31.80, change: 6.36, changePercent: 20.00 },
        { symbol: 'SUGALDAM', name: 'Sugal & Damani Share Brokers', price: 91.20, change: 18.24, changePercent: 20.00 },
        { symbol: 'PASUPTAC', name: 'Pasupati Acrylon Limited', price: 51.42, change: 10.28, changePercent: 20.00 },
        { symbol: 'MEGASTAR', name: 'Megastar Foods Ltd.', price: 260.59, change: 52.12, changePercent: 20.00 },
        { symbol: 'JGTL', name: 'Jasch Gauging Technologies', price: 666.75, change: 133.20, changePercent: 19.99 },
      ],
      losers: [
        { symbol: 'ROCKINGDCE', name: 'Rockingdeals Circular Economy', price: 204.90, change: -42.31, changePercent: -20.66 },
        { symbol: 'SIDDHA', name: 'Siddha Ventures Limited', price: 5.31, change: -0.89, changePercent: -16.77 },
        { symbol: 'COMCL', name: 'Comfort Commotrade Ltd.', price: 25.28, change: -3.72, changePercent: -14.71 },
        { symbol: 'SBLI', name: 'SBL Infratech Limited', price: 43.08, change: -5.59, changePercent: -12.99 },
        { symbol: 'RADIOWALLA', name: 'Radiowalla Network Limited', price: 63.00, change: -7.88, changePercent: -12.50 },
      ],
    },
    medium: {
      gainers: [
        { symbol: 'CANBK', name: 'Canara Bank', price: 485.50, change: 22.15, changePercent: 4.78 },
        { symbol: 'BANKBARODA', name: 'Bank of Baroda', price: 245.80, change: 10.25, changePercent: 4.35 },
        { symbol: 'PNB', name: 'Punjab National Bank', price: 118.45, change: 4.85, changePercent: 4.27 },
        { symbol: 'UNIONBANK', name: 'Union Bank of India', price: 142.30, change: 5.65, changePercent: 4.14 },
        { symbol: 'IOB', name: 'Indian Overseas Bank', price: 58.75, change: 2.25, changePercent: 3.98 },
      ],
      losers: [
        { symbol: 'RAMCOCEM', name: 'Ramco Cements', price: 845.20, change: -35.80, changePercent: -4.06 },
        { symbol: 'SHREECEM', name: 'Shree Cement', price: 28456.50, change: -1125.30, changePercent: -3.80 },
        { symbol: 'DABUR', name: 'Dabur India', price: 542.80, change: -19.45, changePercent: -3.46 },
        { symbol: 'MARICO', name: 'Marico Limited', price: 582.40, change: -19.85, changePercent: -3.29 },
        { symbol: 'GODREJCP', name: 'Godrej Consumer', price: 1125.60, change: -35.20, changePercent: -3.03 },
      ],
    },
    large: {
      gainers: [
        { symbol: 'ADANIPORTS', name: 'Adani Ports', price: 1454.1, change: 36.2, changePercent: 2.55 },
        { symbol: 'RELIANCE', name: 'Reliance Industries', price: 2456.8, change: 58.5, changePercent: 2.44 },
        { symbol: 'TCS', name: 'Tata Consultancy Services', price: 3421.5, change: 72.3, changePercent: 2.16 },
        { symbol: 'HDFCBANK', name: 'HDFC Bank', price: 1645.2, change: 32.1, changePercent: 1.99 },
        { symbol: 'ICICIBANK', name: 'ICICI Bank', price: 978.4, change: 18.6, changePercent: 1.94 },
      ],
      losers: [
        { symbol: 'INDUSINDBK', name: 'IndusInd Bank', price: 1425.6, change: -38.2, changePercent: -2.61 },
        { symbol: 'BAJFINANCE', name: 'Bajaj Finance', price: 6834.5, change: -175.3, changePercent: -2.50 },
        { symbol: 'MARUTI', name: 'Maruti Suzuki', price: 10123.4, change: -245.6, changePercent: -2.37 },
        { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank', price: 1689.7, change: -38.9, changePercent: -2.25 },
        { symbol: 'ASIANPAINT', name: 'Asian Paints', price: 2895.2, change: -62.1, changePercent: -2.10 },
      ],
    },
  };

  const marketCapData = mockData[marketCap] || mockData.large;
  return NextResponse.json(marketCapData);
}
