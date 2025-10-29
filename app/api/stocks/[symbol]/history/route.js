import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const symbol = resolvedParams.symbol?.toUpperCase();
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '1M';

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  // Generate mock historical data
  const basePrice = 1500;
  const days = period === '1D' ? 1 : period === '5D' ? 5 : period === '1M' ? 30 : period === '3M' ? 90 : period === '6M' ? 180 : period === '1Y' ? 365 : 730;
  
  const history = [];
  const today = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const variation = (Math.random() - 0.5) * 50;
    const price = basePrice + variation + (days - i) * 0.5;
    
    history.push({
      date: date.toISOString().split('T')[0],
      open: price - Math.random() * 10,
      high: price + Math.random() * 15,
      low: price - Math.random() * 15,
      close: price,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
    });
  }

  return NextResponse.json({ history });
}

