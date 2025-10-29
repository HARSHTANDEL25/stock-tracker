import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // NSE India API endpoint for current IPO issues
    const response = await fetch('https://www.nseindia.com/api/ipo-current-issue', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'application/json',
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error('Failed to fetch IPO data');
    }

    const data = await response.json();

    // Transform NSE data format to our component format
    // The API structure may vary, so we'll handle different possible formats
    const ipos = Array.isArray(data) 
      ? data.slice(0, 6).map((ipo) => ({
          companyName: ipo.companyName || ipo.company_name || ipo.name || 'N/A',
          symbol: ipo.symbol || ipo.companySymbol || 'N/A',
          issueSize: ipo.issueSize || ipo.issue_size || ipo.size || 'N/A',
          priceBand: ipo.priceBand || ipo.price_band || ipo.priceRange || 'N/A',
          openDate: ipo.openDate || ipo.open_date || ipo.biddingStartDate || 'N/A',
          closeDate: ipo.closeDate || ipo.close_date || ipo.biddingEndDate || 'N/A',
          lotSize: ipo.lotSize || ipo.lot_size || 'N/A',
        }))
      : data.data?.slice(0, 6).map((ipo) => ({
          companyName: ipo.companyName || ipo.company_name || ipo.name || 'N/A',
          symbol: ipo.symbol || ipo.companySymbol || 'N/A',
          issueSize: ipo.issueSize || ipo.issue_size || ipo.size || 'N/A',
          priceBand: ipo.priceBand || ipo.price_band || ipo.priceRange || 'N/A',
          openDate: ipo.openDate || ipo.open_date || ipo.biddingStartDate || 'N/A',
          closeDate: ipo.closeDate || ipo.close_date || ipo.biddingEndDate || 'N/A',
          lotSize: ipo.lotSize || ipo.lot_size || 'N/A',
        })) || [];

    return NextResponse.json({ ipos });
  } catch (error) {
    console.error('Error fetching IPO data:', error);
    
    // Return mock data as fallback if API fails
    return NextResponse.json({
      ipos: [
        {
          companyName: 'TechCorp Solutions Ltd.',
          symbol: 'TCSL',
          issueSize: '₹450 Cr',
          priceBand: '₹320 - ₹335',
          openDate: '2024-01-15',
          closeDate: '2024-01-17',
          lotSize: '44',
        },
        {
          companyName: 'Green Energy Industries',
          symbol: 'GEIL',
          issueSize: '₹680 Cr',
          priceBand: '₹480 - ₹500',
          openDate: '2024-01-20',
          closeDate: '2024-01-22',
          lotSize: '30',
        },
        {
          companyName: 'Digital Finance Hub',
          symbol: 'DFHL',
          issueSize: '₹350 Cr',
          priceBand: '₹125 - ₹130',
          openDate: '2024-01-25',
          closeDate: '2024-01-27',
          lotSize: '115',
        },
        {
          companyName: 'Healthcare Innovations',
          symbol: 'HINL',
          issueSize: '₹520 Cr',
          priceBand: '₹180 - ₹185',
          openDate: '2024-02-01',
          closeDate: '2024-02-03',
          lotSize: '81',
        },
      ],
    });
  }
}

