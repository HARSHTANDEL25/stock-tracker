# StockTracker - Real-Time Stock Market Tracker

A modern, responsive web application built with Next.js 16 for tracking Indian stock market data in real-time. Features include portfolio management, watchlist, market insights, and comprehensive stock analysis.

## 🌐 Live Demo

**Production URL**: [https://stock-tracker-e2pikdj38-harshtandel2508-7363s-projects.vercel.app/)

**GitHub Repository**: [https://github.com/HARSHTANDEL25/stock-tracker](https://github.com/HARSHTANDEL25/stock-tracker)

## ✨ Features

- 📊 **Real-Time Market Data**: Get instant stock prices and market updates
- 📈 **Portfolio Tracking**: Monitor your investments and track performance
- ⭐ **Watchlist**: Save and track your favorite stocks
- 📰 **Market News**: Stay updated with latest financial news
- 🔍 **Stock Search**: Quick search functionality for Indian stocks
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- 🌙 **Dark Mode**: Built-in dark mode support
- 📉 **Market Indices**: Track Nifty, Sensex, and other key indices
- 🪙 **Crypto Integration**: Bitcoin price tracking
- 📊 **Stock Details**: Comprehensive stock information including fundamentals, financials, and historical data

## 🛠️ Tech Stack

- **Framework**: Next.js 16.0.1
- **Language**: JavaScript (React)
- **Styling**: Tailwind CSS 4
- **Deployment**: Vercel
- **API**: NSE (National Stock Exchange) API integration

## 📁 Project Structure

```
my-app/
├── app/
│   ├── api/              # API routes
│   │   ├── crypto/        # Cryptocurrency APIs
│   │   ├── market/        # Market data APIs
│   │   ├── news/          # News APIs
│   │   └── stocks/        # Stock-related APIs
│   ├── components/        # React components
│   ├── dashboard/         # Dashboard page
│   ├── markets/           # Markets page
│   ├── portfolio/         # Portfolio page
│   ├── stock/             # Stock detail pages
│   └── watchlist/         # Watchlist page
├── public/                # Static assets
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/HARSHTANDEL25/stock-tracker.git
cd stock-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌟 Key Features Explained

### Dashboard
- Overview of market performance
- Quick access to key metrics

### Watchlist
- Save favorite stocks
- Track price changes
- Real-time updates

### Portfolio
- Track your investments
- View portfolio performance
- Analyze gains/losses

### Markets
- View market indices
- Top gainers and losers
- Market summaries

### Stock Details
- Comprehensive stock information
- Historical price charts
- Financial fundamentals
- Company financials

## 🔗 API Routes

- `/api/stocks/search` - Search for stocks
- `/api/stocks/[symbol]` - Get stock details
- `/api/stocks/gainers-losers` - Top gainers and losers
- `/api/stocks/[symbol]/history` - Historical data
- `/api/stocks/[symbol]/fundamentals` - Stock fundamentals
- `/api/stocks/[symbol]/financials` - Financial data
- `/api/market/indices` - Market indices
- `/api/crypto/bitcoin` - Bitcoin price data
- `/api/news` - Financial news

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1920px+)
- Tablet (768px - 1024px)
- Mobile (< 768px)

## 🚀 Deployment

This project is deployed on Vercel. To deploy your own version:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Vercel will automatically detect Next.js and deploy

Or use Vercel CLI:
```bash
npm install -g vercel
vercel
```

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built with ❤️ using Next.js and Tailwind CSS

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---

**🔗 Links**:
- **Live Demo**: [https://stock-tracker.vercel.app](https://stock-tracker.vercel.app)
- **GitHub**: [https://github.com/HARSHTANDEL25/stock-tracker](https://github.com/HARSHTANDEL25/stock-tracker)
