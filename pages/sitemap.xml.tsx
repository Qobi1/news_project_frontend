import { GetServerSideProps } from 'next';
import { fetchNewsData, fetchCategories } from '../lib/api';

function generateSiteMap(articles: any[], categories: string[], baseUrl: string) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Homepage -->
     <url>
       <loc>${baseUrl}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     <!-- Search page -->
     <url>
       <loc>${baseUrl}/search</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     <!-- Category pages -->
     ${categories
       .filter(cat => cat !== 'Все')
       .map(category => `
     <url>
       <loc>${baseUrl}/?category=${encodeURIComponent(category)}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>0.9</priority>
     </url>`).join('')}
     <!-- Article pages -->
     ${articles
       .map(article => `
     <url>
       <loc>${baseUrl}/article/${article.id}</loc>
       <lastmod>${new Date(article.datetime_str).toISOString()}</lastmod>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>`).join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    // Fetch articles and categories
    const [articles, categories] = await Promise.all([
      fetchNewsData(),
      fetchCategories()
    ]);

    // Generate the XML sitemap
    const sitemap = generateSiteMap(articles, categories, baseUrl);

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return empty sitemap on error
    const emptySitemap = `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
   </urlset>`;
    
    res.setHeader('Content-Type', 'text/xml');
    res.write(emptySitemap);
    res.end();

    return {
      props: {},
    };
  }
};

export default SiteMap;
