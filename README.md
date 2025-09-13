# News Website - Next.js with Server-Side Rendering

This is a Next.js application that provides a news website with full server-side rendering (SSR) for optimal SEO and performance.

## Features

- **Full Server-Side Rendering (SSR)** using `getServerSideProps`
- **Dynamic Meta Tags** - Title, description, Open Graph, Twitter Cards
- **Structured Data (JSON-LD)** for better search engine understanding
- **SEO Optimized** - All content rendered on the server
- **Responsive Design** with Bootstrap 5
- **Search Functionality** with dedicated search page
- **Category Filtering**
- **Article Detail Pages** with related articles

## Tech Stack

- **Next.js 14** - React framework with SSR
- **TypeScript** - Type safety
- **Bootstrap 5** - UI framework
- **Tailwind CSS** - Utility-first CSS
- **Server-Side Rendering** - All pages rendered on server

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Backend API running on port 8000

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create environment file:
   ```bash
   cp env.example .env.local
   ```

4. Update `.env.local` with your configuration:
   ```
   BACKEND_URL=https://afisha.bestjourneymap.com/api
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── pages/
│   ├── _app.tsx              # App wrapper with global styles
│   ├── index.tsx             # Home page with news list
│   ├── search.tsx            # Search page
│   └── article/
│       └── [id].tsx          # Dynamic article detail page
├── components/
│   ├── SearchComponent.tsx   # Search functionality
│   └── RandomNews.tsx        # Related articles component
├── lib/
│   ├── api.ts               # API functions
│   ├── seo.ts               # SEO utilities
│   └── utils.ts             # Helper functions
├── types/
│   └── index.ts             # TypeScript type definitions
└── styles/
    └── globals.css          # Global styles
```

## API Integration

The application expects a backend API with the following endpoints:

- `GET /news/` - Get all news articles
- `GET /news/{id}` - Get specific article
- `GET /categories/` - Get all categories
- `GET /filter/?category={category}` - Filter by category
- `GET /search/?q={query}` - Search articles

## SEO Features

### Server-Side Meta Tags
- Dynamic `<title>` tags
- Meta descriptions
- Open Graph tags for social sharing
- Twitter Card tags
- Canonical URLs

### Structured Data (JSON-LD)
- NewsArticle schema for articles
- Event schema for event content
- Website schema for homepage
- Breadcrumb schema for navigation

### Performance
- All content rendered on server
- No client-side hydration delays
- Fast initial page loads
- Search engine friendly

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Set the following environment variables in production:

- `BACKEND_URL` - Your backend API URL
- `NEXT_PUBLIC_BASE_URL` - Your frontend URL for SEO

## Key Differences from React SPA

1. **Server-Side Rendering**: All pages are rendered on the server
2. **Dynamic Meta Tags**: SEO tags are generated server-side
3. **getServerSideProps**: Data fetching happens on the server
4. **No Client-Side Routing**: Uses Next.js file-based routing
5. **Better SEO**: Search engines see fully rendered content

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
