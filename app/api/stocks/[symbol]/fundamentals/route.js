import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const symbol = resolvedParams.symbol?.toUpperCase();

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  // Mock fundamentals data - in production, fetch from NSE API
  const fundamentals = {
    RELIANCE: {
      marketCap: 201240100000000,
      peRatio: 20.06,
      pbRatio: 2.29,
      industryPE: 19.30,
      debtToEquity: 0.43,
      roe: 9.47,
      eps: 71.90,
      dividendYield: 0.37,
      bookValue: 648.20,
      faceValue: 10,
    },
    TCS: {
      marketCap: 125000000000000,
      peRatio: 32.50,
      pbRatio: 15.80,
      industryPE: 30.00,
      debtToEquity: 0.02,
      roe: 48.50,
      eps: 105.30,
      dividendYield: 1.20,
      bookValue: 216.50,
      faceValue: 1,
    },
    HDFCBANK: {
      marketCap: 85000000000000,
      peRatio: 18.50,
      pbRatio: 3.20,
      industryPE: 19.00,
      debtToEquity: 0.00,
      roe: 17.50,
      eps: 88.90,
      dividendYield: 1.50,
      bookValue: 514.20,
      faceValue: 2,
    },
    ITC: {
      marketCap: 52500000000000,
      peRatio: 28.50,
      pbRatio: 5.80,
      industryPE: 27.00,
      debtToEquity: 0.05,
      roe: 20.50,
      eps: 14.80,
      dividendYield: 3.20,
      bookValue: 72.80,
      faceValue: 1,
    },
  };

  const data = fundamentals[symbol] || {
    marketCap: 10000000000000,
    peRatio: 25.0,
    pbRatio: 3.0,
    industryPE: 24.0,
    debtToEquity: 0.5,
    roe: 12.0,
    eps: 40.0,
    dividendYield: 1.0,
    bookValue: 500.0,
    faceValue: 10,
  };

  return NextResponse.json({ fundamentals: data });
}

