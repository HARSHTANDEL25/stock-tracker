import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const resolvedParams = await params;
  const symbol = resolvedParams.symbol?.toUpperCase();
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'revenue'; // revenue, profit, networth
  const period = searchParams.get('period') || 'quarterly'; // quarterly, yearly

  if (!symbol) {
    return NextResponse.json({ error: 'Symbol is required' }, { status: 400 });
  }

  // Mock financial data
  const quarterlyRevenue = [
    { period: 'Sep 24', value: 182803 },
    { period: 'Dec 24', value: 271400 },
    { period: 'Mar 25', value: 283015 },
    { period: 'Jun 25', value: 284371 },
    { period: 'Sep 25', value: 289030 },
  ];

  const quarterlyProfit = [
    { period: 'Sep 24', value: 15250 },
    { period: 'Dec 24', value: 18200 },
    { period: 'Mar 25', value: 19500 },
    { period: 'Jun 25', value: 20100 },
    { period: 'Sep 25', value: 21500 },
  ];

  const quarterlyNetWorth = [
    { period: 'Sep 24', value: 845000 },
    { period: 'Dec 24', value: 862000 },
    { period: 'Mar 25', value: 878000 },
    { period: 'Jun 25', value: 895000 },
    { period: 'Sep 25', value: 912000 },
  ];

  let data = [];
  if (type === 'revenue') {
    data = period === 'quarterly' ? quarterlyRevenue : [
      { period: '2020', value: 450000 },
      { period: '2021', value: 520000 },
      { period: '2022', value: 680000 },
      { period: '2023', value: 800000 },
      { period: '2024', value: 950000 },
    ];
  } else if (type === 'profit') {
    data = period === 'quarterly' ? quarterlyProfit : [
      { period: '2020', value: 35000 },
      { period: '2021', value: 45000 },
      { period: '2022', value: 62000 },
      { period: '2023', value: 75000 },
      { period: '2024', value: 88000 },
    ];
  } else {
    data = period === 'quarterly' ? quarterlyNetWorth : [
      { period: '2020', value: 650000 },
      { period: '2021', value: 720000 },
      { period: '2022', value: 780000 },
      { period: '2023', value: 850000 },
      { period: '2024', value: 910000 },
    ];
  }

  return NextResponse.json({ financials: data, type, period });
}

